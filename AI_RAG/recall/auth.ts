import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { credentialsSchema } from "./lib/validation";
import { prisma } from "./lib/db";
import { createGuestUser } from "./lib/demo";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
    Credentials({
      id: "guest",
      name: "Guest",
      credentials: {},
      async authorize() {
        const guest = await createGuestUser();
        if (!guest) return null;
        return {
          id: guest.id,
          email: guest.email,
          name: guest.name,
          isGuest: true,
        };
      },
    }),
  ],
});
