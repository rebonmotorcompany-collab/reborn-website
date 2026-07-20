import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"
import { z } from "zod"
import { prisma } from "./db"
import bcrypt from "bcryptjs"
import { PrismaAdapter } from "@auth/prisma-adapter"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const parsedCredentials = z
            .object({ email: z.string().email(), password: z.string().min(6) })
            .safeParse(credentials)

          if (!parsedCredentials.success) {
            console.log('Auth Failed: Invalid credentials format')
            return null
          }

          const { email, password } = parsedCredentials.data
          const user = await prisma.user.findUnique({ 
            where: { email },
            include: { userRoles: { include: { role: true } } }
          })
          
          if (!user) {
            console.log('Auth Failed: User not found for email:', email)
            return null
          }

          // 1. Enforce Account Status Check (ACTIVE only)
          if (user.status !== 'ACTIVE') {
            await prisma.loginHistory.create({
              data: {
                userId: user.id,
                status: 'FAILED',
                failureReason: `Account Status is ${user.status}`,
              }
            })
            console.log('Auth Failed: User status is not ACTIVE:', user.status)
            return null
          }

          // 2. Enforce Account Locking
          if (user.lockedAt) {
            await prisma.loginHistory.create({
              data: {
                userId: user.id,
                status: 'FAILED',
                failureReason: 'Account Locked',
              }
            })
            console.log('Auth Failed: Account is locked since:', user.lockedAt)
            return null
          }

          const passwordsMatch = await bcrypt.compare(password, user.password)

          if (passwordsMatch) {
            // SUCCESS LOGIN
            await prisma.$transaction([
              // Reset failed login attempts and update lastLoginAt
              prisma.user.update({
                where: { id: user.id },
                data: {
                  failedLoginAttempts: 0,
                  lastLoginAt: new Date(),
                }
              }),
              // Create success login history
              prisma.loginHistory.create({
                data: {
                  userId: user.id,
                  status: 'SUCCESS'
                }
              }),
              // Log login activity
              prisma.activityLog.create({
                data: {
                  userId: user.id,
                  action: 'LOGIN',
                  entity: 'User',
                  entityId: user.id,
                  description: `User ${user.email} successfully logged in.`,
                }
              })
            ])

            return {
              id: user.id,
              name: user.name,
              email: user.email,
              companyId: user.companyId,
              dealerId: user.dealerId,
              status: user.status,
              roles: user.userRoles.map(ur => ur.role.slug)
            }
          } else {
            // FAILED LOGIN
            const newFailedAttempts = user.failedLoginAttempts + 1
            const shouldLock = newFailedAttempts >= 5

            await prisma.$transaction([
              // Increment attempts and lock if threshold exceeded
              prisma.user.update({
                where: { id: user.id },
                data: {
                  failedLoginAttempts: newFailedAttempts,
                  lockedAt: shouldLock ? new Date() : undefined
                }
              }),
              // Record failure in history
              prisma.loginHistory.create({
                data: {
                  userId: user.id,
                  status: 'FAILED',
                  failureReason: shouldLock ? 'Account Locked due to brute force' : 'Invalid Password'
                }
              }),
              // Record lockout in activity log if triggered
              ...(shouldLock ? [
                prisma.activityLog.create({
                  data: {
                    userId: user.id,
                    action: 'OTHER',
                    entity: 'User',
                    entityId: user.id,
                    description: `Account ${user.email} locked due to 5 failed login attempts.`,
                  }
                })
              ] : [])
            ])

            console.log('Auth Failed: Invalid password for email:', email)
            return null
          }
        } catch (error) {
          console.error('CRITICAL DATABASE ERROR IN AUTHORIZE:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
  },
})
