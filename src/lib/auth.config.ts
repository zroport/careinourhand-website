import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  providers: [], // Providers with Prisma/bcrypt are defined in auth.ts
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith("/admin")
      const isOnLogin = nextUrl.pathname === "/admin/login"

      if (isOnLogin) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/admin", nextUrl))
        }
        return true
      }

      if (isOnAdmin) {
        if (isLoggedIn) return true
        return false // next-auth redirects to pages.signIn with callbackUrl
      }

      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.role = (user as any).role as string
      }
      return token
    },
    session({ session, token }) {
      const s = session as any
      if (s.user) {
        s.user.id = token.id as string
        s.user.role = token.role as string
      }
      return session
    },
  },
} satisfies NextAuthConfig
