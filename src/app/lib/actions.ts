'use server';

import { signIn } from "@/auth";
import { auth } from "@/auth";
import { AuthError } from 'next-auth';
import dbConnect from "@/app/lib/mongodb";
import { User } from "@/app/lib/models/User";
import { Product } from "@/app/lib/models/Product";
import bcrypt from 'bcryptjs';
import { redirect } from "next/navigation";
import { writeFile } from 'fs/promises';
import path from 'path';
import { revalidatePath } from "next/cache";

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

export type UpdateAccountState = {
  message: string;
  fields?: {
    firstName?: string,
    lastName?: string,
    bio?: string;
  };
};

export async function updateAccount(
  prevState: UpdateAccountState | undefined,
  formData: FormData
) {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const password = formData.get('password') as string;
  const bio = formData.get('bio') as string;

  const fields = { firstName, lastName, bio };

  if (!firstName) {
    return { message: 'First name is required.', fields };
  }

  if (!lastName) {
    return { message: 'Last name is required.', fields };
  }

  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { message: 'Unauthorized.', fields };
    }

    await dbConnect();

    interface UpdateData {
      firstName: string;
      lastName: string;
      password?: string;
      bio?: string;
    }

    const updateData: UpdateData = { firstName, lastName };

    if (password) {
      if (password.length < 6) {
        return { message: 'Password must be at least 6 characters long.', fields};
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (bio !== undefined) {
      updateData.bio = bio;
    }

    await User.findOneAndUpdate({ email: session.user.email }, updateData);
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 
      'digest'in error && 
      error.digest === 'NEXT_REDIRECT'
    ) {
      throw error;
    }
    console.error('Failed to update account: ', error);
    return { message: 'Database error. Failed to update account.', fields };
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
  const session = await auth();
  
  if (!session?.user?.email) {
    return { message: "You must be logged in to create a listing." };
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return { message: 'User account not found.' };
  }

  const artisan = `${user.firstName} ${user.lastName}`;

  const featured = false;


  const slug = formData.get('slug') as string;
  const categoryRaw = formData.get('category') as string;
  const category = categoryRaw.charAt(0).toUpperCase() + categoryRaw.slice(1);;
  const description = formData.get('description') as string;
  const imageAlt = formData.get('imageAlt') as string;
  const material = formData.get('material') as string;
  const name = formData.get('name') as string;
  const priceRaw = formData.get('price') as string;
  const price = parseFloat(priceRaw);
  const shippingEstimate = formData.get('shippingEstimate') as string;
  const stockRaw = formData.get('stock') as string;
  const stock = parseInt(stockRaw, 10);

  const imageFile = formData.get('imageSrc') as File;
  let imagePathForDb = '';

  const fields = { slug, category, description, imageAlt, material, name, price, shippingEstimate, stock };

  if (!imageFile || imageFile.size === 0) {
    return { message: 'An image file is required.', fields}
  }

  try {
    const buffer = Buffer.from(await imageFile.arrayBuffer());

    const filename = `${Date.now()}-${imageFile.name.replaceAll(' ', '-')}`;

    const uploadDir = path.join(process.cwd(), 'public', 'items');
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);

    imagePathForDb = `/items/${filename}`;

  } catch (error) {
    console.error("Error saving file:", error);
    return { message: 'Failed to upload image.' };
  }

  if (!slug || !category || !description || !imageAlt || !material || !name || !shippingEstimate) {
    return { message: 'All fields are required.', fields };
  }

  if (isNaN(price) || price < 0) {
    return { message: "Invalid price", fields };
  }

  if (isNaN(stock) || stock < 0) {
    return { message: "Stock must be a positive number", fields };
  }

  try {
    await dbConnect();

    const existingListing = await Product.findOne({ slug });
    if (existingListing) {
      return { message: 'A listing with this slug already exists. Please choose a different slug.', fields };
    }

    await Product.create({
      slug,
      artisan,
      category,
      description,
      featured,
      imageAlt,
      imageSrc: imagePathForDb,
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

  revalidatePath('/shop');
  revalidatePath('/');

  redirect(`/shop/${slug}`);
}

export type ListingFormState = {
  message?: string;
  error?: string;
  fields?: Record<string, string | number>;
} | undefined;

export async function updateListing(
  productId: string,
  existingImageSrc: string,
  prevState: ListingFormState,
  formData: FormData
) : Promise<ListingFormState> {
  const session = await auth();

  if(!session?.user?.email) {
    return { error: "You must be logged in to delete a listing." };
  }

  try {
    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) return { message: 'User account not found.' };
    const artisanName = `${user.firstName} ${user.lastName}`;
    const isAdmin = user.role === "admin";

    const existingProduct = await Product.findById(productId);
    if (!existingProduct) return { message: 'Listing not found.' };

    if (!isAdmin && existingProduct.artisan !== artisanName) {
      return { message: 'You do not have permission to edit this listing.' };
    }

    const formArtisan = formData.get('artisan') as string;
    const finalArtisan = isAdmin && formArtisan ? formArtisan : existingProduct.artisan;

    const slug = formData.get('slug') as string;
    const categoryRaw = formData.get('category') as string;
    const category = categoryRaw.charAt(0).toUpperCase() + categoryRaw.slice(1);;
    const description = formData.get('description') as string;
    const imageAlt = formData.get('imageAlt') as string;
    const material = formData.get('material') as string;
    const name = formData.get('name') as string;
    const priceRaw = formData.get('price') as string;
    const price = parseFloat(priceRaw);
    const shippingEstimate = formData.get('shippingEstimate') as string;
    const stockRaw = formData.get('stock') as string;
    const stock = parseInt(stockRaw, 10);

    const imageFile = formData.get('imageSrc') as File | null;
    let imagePathForDb = existingImageSrc;

    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      const filename = `${Date.now()}-${imageFile.name.replaceAll(' ', '-')}`;

      const uploadDir = path.join(process.cwd(), 'public', 'items');
      const filePath = path.join(uploadDir, filename);

      await writeFile(filePath, buffer);

      imagePathForDb = `/items/${filename}`;
    }

    if (!slug || !category || !description || !imageAlt || !material || !name || !shippingEstimate) {
      return { message: 'All fields are required.' };
    }

    if (isNaN(price) || price < 0) {
      return { message: "Invalid price" };
    }

    if (isNaN(stock) || stock < 0) {
      return { message: "Stock must be a positive number" };
    }

    await Product.findByIdAndUpdate(productId, {
      slug,
      artisan: finalArtisan,
      category,
      description,
      imageAlt,
      imageSrc: imagePathForDb,
      material,
      name,
      price,
      shippingEstimate,
      stock,
    });

  } catch (error) {
    console.error("Failed to update listing: ", error);
    return { message: 'Database error. Failed to update listing.' };
  }

  revalidatePath('/shop');
  revalidatePath('/');

  redirect('/account-info?message=Listing updated successfully.');
}

export async function deleteListing(productId: string) {
  const session = await auth();

  if(!session?.user?.email) {
    return { error: "You must be logged in to delete a listing." };
  }

  try {
    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    const existingProduct = await Product.findByIdAndDelete(productId);

    const isAdmin = user.role === 'Admin';

    if (!isAdmin && existingProduct.artisan !== `${user.firstName} ${user.lastName}`) {
      return { error: "Unauthorized to delete this listing." };
    }

    await Product.findByIdAndDelete(productId);

    revalidatePath('/account-info');
    revalidatePath('/shop');

    return { success: true};
  } catch (error) {
    console.error("Failed to delete listing: ", error);
    return { error: "Failed to delete listing." };
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
