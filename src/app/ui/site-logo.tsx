import { inter } from '@/app/ui/fonts';

export default function SiteLogo() {
  return (
    <div className={`${inter.className} flex flex-row items-center leading-none text-white`}>
      <p className='text-2xl font-bold tracking-wide text-stone-800 md:text-3xl'>Handcrafted Haven</p>
    </div>
  );
}