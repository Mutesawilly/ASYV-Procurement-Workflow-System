'use client'

import Link from "next/link";
import { SignInButton, SignUpButton, SignOutButton, useUser } from "@clerk/nextjs";

export default function Navigation() {
  const { user, isSignedIn } = useUser();

  return (
    <main className="flex items-center justify-between">
      {/* The Application Logo and Name */}
      <h1 className="text-xl font-bold">ASYV-PWS</h1>

      {/* Login, Signup and Profile Buttons */}
      <div className="flex items-center justify-end space-x-4"> 
        {!isSignedIn ? (
          <>
            <Link href="/sign-in" mode="modal">
              <button className="cursor-pointer bg-gray-200 text-black px-4 py-2 rounded-full hover:bg-gray-300">
                Sign In
              </button>
            </Link>
            <Link href="/sign-up"className="py-2 px-4 bg-black text-white rounded-full">Get Started</Link>
            <Link href="/protected/dashboard"className="py-2 px-4 bg-blue-100 text-black rounded-full">Dashboard</Link>
          </>
        ) : ( 
          <>         
            <Link href="/protected/dashboard" className="ml-4 text-white bg-black py-2 px-4 rounded-full">
              Dashboard
            </Link>
            <SignOutButton>
              <button className="cursor-pointer border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-100">
                Sign Out
              </button>
            </SignOutButton>
          </>
        )}
      </div>
    </main>
  );
}