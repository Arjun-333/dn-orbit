import GitHub from "next-auth/providers/github";
import type { NextAuthConfig, User } from "next-auth";

interface ExtendedUser extends User {
  role?: "admin" | "member";
  usn?: string | null;
}

export default {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as ExtendedUser;
        token.role = u.role;
        token.usn = u.usn;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as "admin" | "member";
        session.user.usn = token.usn as string | null;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
