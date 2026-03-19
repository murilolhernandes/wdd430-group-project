import type { Metadata } from "next";
import "./globals.css";
import Header from "./ui/header";

export const metadata: Metadata = {
  title: "Handcrafted Haven",
  description: "A marketplace for handcrafted products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-stone-50 text-stone-900 antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}