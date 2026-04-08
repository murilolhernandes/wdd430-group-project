import Image from "next/image";

export default function Image2() {
  return (
    <Image
      src='/images/craft-image2.jpg'
      alt='Handcrafted Hero Image'
      fill
      priority
      className="object-cover rounded-[2rem]"
      sizes='(max-width: 768px) 100vw, 50vw'
    />
  );
}