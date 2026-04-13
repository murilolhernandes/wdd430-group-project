'use server';

import { signIn } from "@/auth";
import { auth } from "@/auth";
import { AuthError } from 'next-auth';
import dbConnect from "@/app/lib/mongodb";
import { User } from "@/app/lib/models/User";
import { Product } from "@/app/lib/models/Product";
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
    console.error("Failed to add to cart: ", error);
    return { error: "Failed to update cart." };
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

export async function removeFromCartDB(productId: string, quantityToRemove: number = 1) {
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
      user.cart[existingItemIndex].quantity -= quantityToRemove;
      
      if (user.cart[existingItemIndex].quantity <= 0) {
        user.cart.splice(existingItemIndex, 1);
      }

      user.markModified('cart'); 
    }

    await user.save();
    return { success: true, cart: JSON.parse(JSON.stringify(user.cart)) };
  } catch (error) {
    console.error("Failed to remove product from cart: ", error);
    return { error: "Failed to update cart." };
  }
}

export async function getCartDB() {
  try {
    const session = await auth();
    if (!session?.user?.email) return { error: "Not logged in." };

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    if (!user) return { error: "User not found" };

    return { success: true, cart: JSON.parse(JSON.stringify(user.cart)) };
  } catch (error) {
    console.error("Failed to fetch cart: ", error);
    return { error: "Failed to fetch cart." };
  }
}

export async function addListing(
  prevState: { message: string } | undefined,
  formData: FormData
) {
  const slug = formData.get('slug') as string;
  const artisan = formData.get('artisan') as string;
  const category = formData.get('category') as string;
  const description = formData.get('description') as string;
  const featured = formData.get('featured') as string;
  const imageAlt = formData.get('imageAlt') as string;
  // const imageSrc = formData.get('') as string;
  const material = formData.get('material') as string;
  const name = formData.get('name') as string;
  const priceRaw = formData.get('price') as string;
  const price = parseFloat(priceRaw);
  const shippingEstimate = formData.get('shippingEstimate') as string;
  const stockRaw = formData.get('stock') as string;
  const stock = parseInt(stockRaw, 10);

  const fields = { slug, artisan, category, description, featured, imageAlt, material, name, price, shippingEstimate, stock };

  if (!slug || !artisan || !category || !description || !featured || !imageAlt ||!material || !name || !price || !shippingEstimate || !stock) {
    return { message: 'All fields are required.', fields };
  }

  if (isNaN(price) || price < 0) {
    return { message: "Invalid price" };
  }

  if (isNaN(stock) || stock < 0) {
    return { message: "Stock must be a positive number" };
  }

  try {
    await dbConnect();

    const existingListing = await Product.findOne({ slug });
    if (existingListing) {
      return { message: 'A listing with this slug already exists.', fields };
    }

    await Product.create({
      slug,
      artisan,
      category,
      description,
      featured,
      imageAlt,
      material,
      name,
      price,
      shippingEstimate,
      stock,
    });
  } catch (error) {
    console.error('Failed to add listing: ', error);
    return { message: 'Database error. Failed to add listing.', fields };
  }

  redirect('/shop'); // dynamically redirect to the new listing page.
}