import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      companyId: string | null
      dealerId: string | null
      roles: string[]
      status: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    companyId: string | null
    dealerId: string | null
    roles: string[]
    status: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    companyId: string | null
    dealerId: string | null
    roles: string[]
    status: string
  }
}
