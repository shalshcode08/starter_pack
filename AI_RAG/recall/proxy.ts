import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Middleware runs on the edge, so it uses the bcrypt-free base config only.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
