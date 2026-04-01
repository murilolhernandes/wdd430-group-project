import Link from 'next/link';
import Image from "next/image";

export default function Footer() {
  return <footer className="bg-[#7a5c3e] text-white p-6 flex flex-col md:flex-row justify-around items-center">
    <div >
         <p>About Us</p>
    </div>
    <div>
      <p>Some other link I'll decide later</p>
    </div>
    <div>
      <a href='facebook.com'>
        <img 
          src="/items/facebook.svg" 
          alt="facebook logo" 
          className="w-8 h-8"
        />
      </a>
    </div>
    <div>
      <a href='instagram.com'>
        <img
          src='/items/instagram.svg'
          alt='instagram logo'
          className='w-8 h-8'
        />
      </a>
    </div>
  </footer>;
}
