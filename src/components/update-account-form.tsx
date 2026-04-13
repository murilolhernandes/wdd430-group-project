'use client';

import { useActionState } from 'react';
import { updateAccount, type UpdateAccountState } from '@/app/lib/actions';

export type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
};

const initialState: UpdateAccountState = {
  message: '',
};

export default function UpdateAccountForm({ user }: { user: UserProfile }) {
  const [state, formAction, isPending] = useActionState(updateAccount, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {state.message && (
        <p className="mb-4 text-red-500 font-medium">{state.message}</p>
      )}

      <div className="space-y-2">
        <label className="block font-semibold text-stone-700">First Name</label>
        <input 
          type="text" 
          name="firstName"
          defaultValue={state.fields?.firstName || user.firstName}
          className="earth-input w-full" 
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block font-semibold text-stone-700">Last Name</label>
        <input 
          type="text" 
          name="lastName"
          defaultValue={state.fields?.lastName || user.lastName}
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
            defaultValue={user.email}
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
          defaultValue={state.fields?.bio || user.bio || ''}
          placeholder="Tell your story to your customers..." 
          className="earth-input w-full"
        ></textarea>
      </div>

      <div className="flex gap-4 pt-4">
        <button 
          type="submit" 
          className="earth-button-primary disabled:opacity-50"
          disabled={isPending}
        >
          {isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}