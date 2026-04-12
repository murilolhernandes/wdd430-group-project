'use server';

import { signIn } from "@/auth";
import { auth } from "@/auth";
import { AuthError } from 'next-auth';
import dbConnect from "@/app/lib/mongodb";
import { User } from "@/app/lib/models/User";
import bcrypt from 'bcryptjs';
import { redirect } from "next/navigation";

interface DBItem {
  productId: string;
  quantity: number;
}

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

export async function updateAccount(formData: FormData) {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const password = formData.get('password') as string;
  const bio = formData.get('bio') as string;

  const fields = { firstName, lastName, password, bio };

  if (!firstName || !lastName) {
    redirect('/account-info?error=First name and last name are required.');
  }

  try {
    const session = await auth();
    if (!session?.user?.email) {
      redirect('/account-info?error=Unauthorized.');
    }

    await dbConnect();
    const updateData: any = { firstName, lastName };

    if (password) {
      if (password.length < 6) {
        redirect('/account-info?error=Password must be at least 6 characters long.');
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (bio !== undefined) {
      updateData.bio = bio;
    }

    await User.findOneAndUpdate({ email: session.user.email }, updateData);
  } catch (error: any) {
    if (error.digest === 'NEXT_REDIRECT') {
      throw error;
    }
    console.error('Failed to update account: ', error);
    redirect('/account-info?error=Database error. Failed to update account.');
  }

  redirect('/account-info?message=Account updated successfully.');
}

export async function addToCartDB(productId: string, quantity: number) {
  try {
    const session = await auth();
    if (!session?.user?.email) return { error: "Not logged in" };

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    if (!user) return { error: "User not found" };

    const existingItemIndex = user.cart.findIndex(
      (item: DBItem) => item.productId === productId
    );

    if (existingItemIndex > -1) {
      user.cart[existingItemIndex].quantity += quantity;
    } else {
      user.cart.push({ productId, quantity });
    }

    await user.save();
    return { success: true, cart: JSON.parse(JSON.stringify(user.cart)) };
  } catch (error) {
    console.error("Failed to add to cart:", error);
    return { error: "Failed to update cart" };
  }
}

export async function syncGuestCartToDB(localCartItems: DBItem[]) {
  try {
    const session = await auth();
    if (!session?.user?.email || localCartItems.length === 0) return { success: true };

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    if (!user) return { error: "User not found" };

    for (const localItem of localCartItems) {
      const existingItemIndex = user.cart.findIndex(
        (dbItem: DBItem) => dbItem.productId === localItem.productId
      );

      if (existingItemIndex > -1) {
        user.cart[existingItemIndex].quantity += localItem.quantity;
      } else {
        user.cart.push(localItem);
      }
    }

    await user.save();
    return { success: true, cart: JSON.parse(JSON.stringify(user.cart)) };
  } catch (error) {
    console.error("Failed to sync cart:", error);
    return { error: "Failed to sync cart" };
  }
}

export async function clearCartDB() {
  try {
    const session = await auth();
    if (!session?.user?.email) return { error: "Not logged in" };

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    if (!user) return { error: "User not found" };

    user.cart = [];
    await user.save();

    return { success: true };
  } catch (error) {
    console.error("Failed to clear cart:", error);
    return { error: "Failed to clear cart" };
  }
}