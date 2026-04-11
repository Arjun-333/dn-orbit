import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import type { Adapter } from "next-auth/adapters";
import authConfig from "@/auth.config";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "admin" | "member";
      usn: string | null;
      accessToken?: string;
    } & import("next-auth").DefaultSession["user"];
  }
  interface User {
    id?: string;
    role?: "admin" | "member";
    usn?: string | null;
  }
}

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
  adapter: PrismaAdapter(db) as Adapter,
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, account }) {
      // First sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.usn = user.usn;
      }
      
      // Persist access token
      if (account) {
        token.accessToken = account.access_token;
      }

      // Sync with DB if needed (only in non-edge runtime)
      if (token.id && typeof window === 'undefined') {
        const dbUser = await db.user.findUnique({
          where: { id: token.id as string },
          select: { role: true, usn: true }
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.usn = dbUser.usn;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "admin" | "member";
        session.user.usn = token.usn as string | null;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
});
