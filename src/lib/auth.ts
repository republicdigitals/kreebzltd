import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { rateLimit, clientIp } from "@/lib/rate-limit";

// Dummy hash so a login attempt for a non-existent email costs the same
// bcrypt work as a real account — prevents user enumeration via timing.
const DUMMY_HASH = "$2a$12$LJ3m4y2nJZ1mVQq3Z0fLHuJ3l5k9m0vXkYy0QhK8kXkE4v0e0pG0a";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Per-IP limit on credential attempts (in addition to the delay below)
        const ip = clientIp(req);
        if (!rateLimit(`login:${ip}`, 10, 15 * 60_000).ok) {
          return null;
        }

        // Artificial delay to mitigate brute force attacks
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email.toLowerCase().trim()
          }
        });

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user?.password ?? DUMMY_HASH
        );

        if (!user || !isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours — limits stolen-token exposure
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
