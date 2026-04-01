import Image from "next/image";

export default function HeroImage() {
  return (
    <Image
      src='/images/hero-image1.jpg'
      alt='Handcrafted Hero Image'
      fill
      priority
      className="object-cover rounded-[2rem]"
      sizes='(max-width: 768px) 100vw, 50vw'
    />
  );
}