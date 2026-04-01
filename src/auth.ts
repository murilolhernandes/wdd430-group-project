import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/app/lib/mongodb';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { User } from '@/app/lib/models/User';
import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';

const clientPromise = dbConnect().then((m) => m.connection.getClient() as MongoClient);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,

      profile(profile) {
        return {
          id: profile.sub,
          firstName: profile.given_name,
          lastName: profile.family_name,
          email: profile.email,
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      }
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        try {
          await dbConnect();
          
          const user = await User.findOne({ email: credentials.email });

          if (!user || !user.password) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (passwordsMatch) {
            return {
              id: user._id.toString(),
              email: user.email,
              name: user.name,
              role: user.role,
            };
          }

          return null;
        } catch (error) {
          console.error("Error during authorization:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 Hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    }
  }
});