import Image from "next/image";
import Link from "next/link";
import Header from "@/components/ui/header/header";
import { Geist, Geist_Mono } from "next/font/google";
import Navigation from "@/components/ui/header/header";
import { SignInButton } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ASYV | Procurement Workflow System",
  description: "A procurement system for ASYV",
};

export default function Home() {
  return (
    <main className="flex flex-col justify-between min-h-screen bg-gray-100 p-4">
      {/* The Navigation Bar */}
      <Navigation />

      {/* The Hero Section */}
      <section className="flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to ASYV Procurement System</h1>
          <p className="text-lg mb-6">Streamlining procurement processes for a better future.</p>         
          <SignInButton className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 cursor-pointer">
            Get Started
          </SignInButton>
          <Link href="./login" className="ml-4 text-gray-700 hover:underline">
            Login
          </Link>
        </div>
      </section>
      
      {/* The Footer Section */}
      <footer className="mt-8 text-center text-gray-600">
        <p>&copy; {new Date().getFullYear()} ASYV Procurement System. All rights reserved.</p>
      </footer>
    </main>
  );
}
