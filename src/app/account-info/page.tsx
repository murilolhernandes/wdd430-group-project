import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/app/lib/mongodb';
import { User } from '@/app/lib/models/User';
import { Product } from '../lib/models/Product';
import { Metadata } from 'next';
import UpdateAccountForm from '@/components/update-account-form';
import UserListings from "@/components/user-listings";

export const metadata: Metadata = {
  title: 'Account',
};

export default async function AccountInfoPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  await dbConnect();
  const user = await User.findOne({ email: session.user.email }).select('-password');

  if (!user) {
    redirect('/login');
  }

  const artisanName = `${user.firstName} ${user.lastName}`

  const userProducts = await Product.find({ artisan: artisanName }).sort({ createdAt: -1 });
  const plainProducts = JSON.parse(JSON.stringify(userProducts));

  let adminProducts: any[] = [];
  if (user.role === "admin") {
    const otherProducts = await Product.find({ artisan: { $ne: artisanName } }).sort({ createdAt: -1});
    adminProducts = JSON.parse(JSON.stringify(otherProducts));
  }

  const sp = await searchParams;
  const message = sp.message as string;
  const plainUser = JSON.parse(JSON.stringify(user));

  return (
    <div className="container-earth section-padding min-h-screen">
      <div className="max-w-2xl mx-auto">
        
        <h1 className="text-4xl font-bold mb-2 text-center">Account Information</h1>
        <p className="text-[var(--muted-foreground)] mb-10 text-lg text-center">
          Update your personal details and manage your artisan profile.
        </p>

        {message && <p className="mb-4 rounded-md text-green-800 py-3 text-center font-medium">{message}</p>}

        <UpdateAccountForm user={plainUser} />

        <div className="mt-16 pt-8 border-t border-stone-200">
          <UserListings initialProducts={plainProducts} />
        </div>

        {user.role === "admin" && (
          <div className="mt-8">
            <UserListings
              title="All Marketplace Listings (Admin)"
              subtitle="Edit or remove items from other artisans"
              initialProducts={adminProducts}
            />
          </div>
        )}
      </div>
    </div>
  );
}