import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/app/lib/mongodb';
import { User } from '@/app/lib/models/User';
import { updateAccount } from '@/app/lib/actions';

export default async function AccountInfoPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect('/login');
  }

  await dbConnect();
  
  const user = await User.findOne({ email: session.user.email })
    .select('-password')
    .lean();

  if (!user) {
    redirect('/login');
  }

  const sp = await searchParams;
  const message = sp.message as string;
  const error = sp.error as string;

  return (
    
    <main className="container-earth section-padding min-h-screen">
      
      
      <div className="max-w-2xl mx-auto w-full">
        
        <h1 className="text-4xl font-bold mb-2">Account Information</h1>
        <p className="text-[var(--muted-foreground)] mb-10 text-lg">
          Update your personal details and manage your artisan profile.
        </p>

        {message && <p className="mb-4 text-green-500">{message}</p>}
        {error && <p className="mb-4 text-red-500">{error}</p>}

        <form action={updateAccount} className="space-y-6">
          
          <div className="space-y-2">
            <label className="block font-semibold text-stone-700">First Name</label>
            <input 
              type="text" 
              name="firstName"
              defaultValue={user.firstName as string}
              className="earth-input w-full" 
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block font-semibold text-stone-700">Last Name</label>
            <input 
              type="text" 
              name="lastName"
              defaultValue={user.lastName as string}
              className="earth-input w-full" 
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block font-semibold text-stone-700">Email Address 🔒</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-sm" aria-hidden="true"></span>
              <input 
                type="email" 
                defaultValue={user.email as string}
                disabled 
                className="earth-input w-full pl-9 opacity-60 cursor-not-allowed bg-[var(--muted)] text-stone-500" 
              />
            </div>
            <p className="text-xs text-[var(--muted-foreground)] italic">
              Email cannot be changed for security reasons.
            </p>
          </div>

          <div className="space-y-2">
            <label className="block font-semibold text-stone-700">New Password (leave blank to keep current)</label>
            <input 
              type="password"
              name="password"
              placeholder="Enter a new password to change" 
              className="earth-input w-full" 
            />
          </div>

          <div className="space-y-2">
            <label className="block font-semibold text-stone-700">Artisan Bio / About You</label>
            <textarea 
              rows={4} 
              name="bio"
              defaultValue={(user.bio as string) || ''}
              placeholder="Tell your story to your customers..." 
              className="earth-input w-full"
            ></textarea>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" className="earth-button-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}