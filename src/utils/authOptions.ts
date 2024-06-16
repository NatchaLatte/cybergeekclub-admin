import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { Adapter } from "next-auth/adapters";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "text" },
        password: { type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) return null;
        const account_admin = await prisma.account_admin.findUnique({
          where: {
            email: credentials.email,
          },
        });
        if (
          account_admin &&
          (await bcrypt.compare(credentials.password, account_admin.password))
        ) {
          return {
            id: account_admin.id,
            email: account_admin.email,
            display_name: account_admin.display_name,
          };
        } else {
          return null;
        }
      },
    }),
  ],
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }: any) {
        if(user){
            token.id = user.id,
            token.email = user.email
            token.display_name = user.display_name
        }
        return token
    },
    async session({ session, token }: any) {
        if(session.user){
            session.user.id = token.id
            session.user.display_name = token.display_name
        }
        return session
    }
  }
};