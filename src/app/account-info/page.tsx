import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/app/lib/mongodb';
import { User } from '@/app/lib/models/User';
import { Metadata } from 'next';
import UpdateAccountForm from '@/components/update-account-form';

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

  const sp = await searchParams;
  const message = sp.message as string;

  const plainUser = JSON.parse(JSON.stringify(user));

  return (
    <div className="container-earth section-padding min-h-screen">
      <div className="max-w-2xl mx-auto">
        
        <h1 className="text-4xl font-bold mb-2">Account Information</h1>
        <p className="text-[var(--muted-foreground)] mb-10 text-lg">
          Update your personal details and manage your artisan profile.
        </p>

        {message && <p className="mb-4 text-green-500">{message}</p>}

        <UpdateAccountForm user={plainUser} />

      </div>
    </div>
  );
}