import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isDashboardRoute = nextUrl.pathname.startsWith('/dashboard')
      const isCompanyRoute = nextUrl.pathname.startsWith('/company-portal') || nextUrl.pathname.startsWith('/company/dashboard')
      const isDealerRoute = nextUrl.pathname.startsWith('/dealer-portal') || nextUrl.pathname.startsWith('/dealer/dashboard')
      const isAuthRoute = ['/login', '/forgot-password', '/reset-password'].some(p => nextUrl.pathname.startsWith(p))

      // Prevent logged in users from accessing auth pages
      if (isLoggedIn && isAuthRoute) {
        // Redirect based on roles
        const roles = (auth.user as any).roles || []
        if (roles.includes('company-admin')) return Response.redirect(new URL('/company/dashboard', nextUrl))
        if (roles.includes('dealer-admin')) return Response.redirect(new URL('/dealer/dashboard', nextUrl))
        return Response.redirect(new URL('/dashboard', nextUrl))
      }

      // Protect dashboard routes
      if (isDashboardRoute) {
        if (!isLoggedIn) return false
        const roles = (auth.user as any).roles || []
        const allowedRoles = [
          'super-admin', 'admin', 'manager', 'sales-manager',
          'dealer-manager', 'marketing', 'customer-support',
          'content-editor', 'finance', 'viewer', 'employee'
        ]
        const hasAccess = roles.some((r: string) => allowedRoles.includes(r))
        if (!hasAccess) {
            return Response.redirect(new URL('/unauthorized', nextUrl))
        }
        return true
      }

      // Protect company routes
      if (isCompanyRoute) {
        if (!isLoggedIn) return false
        const roles = (auth.user as any).roles || []
        if (!roles.includes('company-admin') && !roles.includes('super-admin')) {
            return Response.redirect(new URL('/unauthorized', nextUrl))
        }
        return true
      }

      // Protect dealer routes
      if (isDealerRoute) {
        if (!isLoggedIn) return false
        const roles = (auth.user as any).roles || []
        if (!roles.includes('dealer-admin') && !roles.includes('super-admin')) {
            return Response.redirect(new URL('/unauthorized', nextUrl))
        }
        return true
      }

      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.companyId = (user as any).companyId
        token.dealerId = (user as any).dealerId
        token.roles = (user as any).roles
        token.status = (user as any).status
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        ;(session.user as any).companyId = token.companyId as string | null
        ;(session.user as any).dealerId = token.dealerId as string | null
        ;(session.user as any).roles = token.roles as string[]
        ;(session.user as any).status = token.status as string
      }
      return session
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig
