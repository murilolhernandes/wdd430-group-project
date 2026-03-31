'use server';

import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/app/lib/mongodb';
import { redirect } from "next/dist/server/api-utils";

export async function authenticate() {};

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  // await mongodb.auth.signInWithOAuth({
  //   provider: 'google',
  //   options: {
  //     redirectTo: `${window.location.origin}/auth/callback`,
  //   },
  // });
};

const signInAction = NextAuth(authOptions);
export { signInAction as GET, signInAction as POST };