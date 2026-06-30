import type { NextAuthConfig } from "next-auth";

const AUTH_PAGES = ["/login", "/signup"];
const DEFAULT_REDIRECT = "/board";

export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAuthPage = AUTH_PAGES.includes(nextUrl.pathname);

      if (isAuthPage) {
        if (isLoggedIn) {
          return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl));
        }
        return true;
      }

      return isLoggedIn;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
