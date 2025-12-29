import prisma from "@/lib/db/prisma";
import { RoleName } from "@prisma/client";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { AuthOptions } from "next-auth";

const SECRET = process.env.NEXTAUTH_SECRET as string;

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;
        

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.userId,
          name: user.name,
          email: user.email,
          role: user.role as RoleName,
          profileImage: user.profileImage ?? null,
        };
      },
    }),
  ],

  callbacks: {
    
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
        token.profileImage = user.profileImage ?? null; 

        token.accessToken = jwt.sign(
          {
            sub: user.id,
            role: user.role,
            email: user.email,
          },
          SECRET,
          {
            expiresIn: "1d",
          }
        );
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: token.name as string,
        role: token.role as RoleName,
        email: token.email as string,
        profileImage: token.profileImage as string | null, 
      };

      session.accessToken = token.accessToken as string;

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};
