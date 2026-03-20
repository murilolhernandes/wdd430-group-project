

import Footer from "@/components/footer";
import Header from "@/components/header";

export default function Home() {
  return (
      <div>
      <Header />
    
      <main className="flex min-h-screen flex-col items-center justify-between p-24 ">
        <h1 className="text-center text-6xl font-bold text-zinc-900">
          {" "}
          Welcome home, <span className="text-blue-600">Team 4</span>!{" "}
        </h1>
      </main>
   

      <Footer />
    </div>
  );
}
