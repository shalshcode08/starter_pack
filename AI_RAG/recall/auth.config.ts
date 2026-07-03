import type { NextAuthConfig } from "next-auth";

// Edge-safe config: no database or bcrypt imports, so it can run in middleware.
// The Credentials provider (which needs Node) is added in auth.ts.
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAuthPage =
        nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/register");

      if (isOnAuthPage) {
        if (isLoggedIn) return Response.redirect(new URL("/dashboard", nextUrl));
        return true;
      }

      // Everything under these prefixes requires a session.
      const isProtected =
        nextUrl.pathname.startsWith("/dashboard") ||
        nextUrl.pathname.startsWith("/study-sets");

      if (isProtected) return isLoggedIn;
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isGuest = "isGuest" in user ? Boolean(user.isGuest) : false;
      }
      return token;
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      session.user.isGuest = Boolean(token.isGuest);
      return session;
    },
  },
} satisfies NextAuthConfig;
