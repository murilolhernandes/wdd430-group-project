import Image from "next/image";

export default function Image3() {
  return (
    <Image
      src='/images/craft-image3.jpg'
      alt='Handcrafted Hero Image'
      fill
      priority
      className="object-cover rounded-[2rem]"
      sizes='(max-width: 768px) 100vw, 50vw'
    />
  );
}