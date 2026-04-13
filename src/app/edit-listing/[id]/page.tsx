import EditListingForm from "@/app/ui/add-listing/edit-listing-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/app/lib/mongodb";
import { Product } from "@/app/lib/models/Product";
import { User } from '@/app/lib/models/User';
import { Suspense } from "react";
import { Metadata } from "next";

export const metada: Metadata = {
  title: 'Edit Listing',
};

export default async function EditListingPage({
  params, 
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }

  const { id } = await params;

  await dbConnect();
  const user = await User.findOne({ email: session.user.email });
  const product = await Product.findById(id);

  if (!product) {
    redirect('/account-info?message=Listing not found.');
  }

  const plainProduct = JSON.parse(JSON.stringify(product));

  return (
    <div className="container-earth section-padding min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className='text-4xl font-bold text-center'>
            {/* Edit Your Listing */}
            Create a Product Listing!
        </h1>
        <p className='text-center text-stone-500 pt-1'>
          Update the details for &quot;{plainProduct.name}&quot;
        </p>
        <Suspense fallback={<div>Loading form...</div>}>
          <EditListingForm listing={plainProduct} isAdmin={user.role === 'admin'} />
        </Suspense>
      </div >
    </div>
  );
}