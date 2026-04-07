'use server';

import { signIn } from "@/auth";
import { AuthError } from 'next-auth';
import dbConnect from "@/app/lib/mongodb";
import { User } from "@/app/lib/models/User";
import bcrypt from 'bcryptjs';
import { redirect } from "next/navigation";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', {...Object.fromEntries(formData), redirectTo: '/shop'});
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid email or password.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  };
}

export async function googleAuthenticate() {
  await signIn('google', { redirectTo: '/shop' });
}

export async function createAccount(
  prevState: { message: string } | undefined,
  formData: FormData
) {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  const fields = { firstName, lastName, email };

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    return { message: 'All fields are required.', fields };
  }

  if (password !== confirmPassword) {
    return { message: 'Passwords do not match.', fields };
  }

  if (password.length < 6) {
    return { message: 'Password must be at least 6 characters long.', fields };
  }

  try {
    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { message: 'An account with this email already exists.', fields };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
  } catch (error) {
    console.error('Failed to create account: ', error);
    return { message: 'Database error. Failed to create account.', fields };
  }

  redirect('/login');
}