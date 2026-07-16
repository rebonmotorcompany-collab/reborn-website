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

          if (parsedCredentials.success) {
            const { email, password } = parsedCredentials.data
            const user = await prisma.user.findUnique({ 
              where: { email },
              include: { userRoles: { include: { role: true } } }
            })
            
            if (!user) {
              console.log('Auth Failed: User not found for email:', email)
              return null
            }
            if (user.status !== 'ACTIVE') {
              console.log('Auth Failed: User status is not ACTIVE:', user.status)
              return null
            }
            
            const passwordsMatch = await bcrypt.compare(password, user.password)
            if (passwordsMatch) {
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
              console.log('Auth Failed: Invalid password for email:', email)
            }
          } else {
             console.log('Auth Failed: Invalid credentials format', parsedCredentials.error)
          }
          return null
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
