"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, SignOutButton, useUser } from "@clerk/nextjs";

export default function Navigation() {
  const { isLoaded, isSignedIn, user } = useUser();
  const dashboardRoute = "/protected/dashboard/employee";

  // while Clerk loads, render nothing or a placeholder
  // if (!isLoaded) return null;

  return (
    <main className="flex items-center justify-between">
      <h1 className="text-xl font-bold">ASYV-PWS</h1>

      <div className="flex items-center justify-end space-x-4">
        {!isSignedIn ? (
          <>
              <Link href="/sign-in" className="cursor-pointer bg-gray-200 text-black px-4 py-2 rounded-full hover:bg-gray-300">
                Sign In
              </Link>

            <SignUpButton>
              <button className="py-2 px-4 bg-black text-white rounded-full">
                Get Started
              </button>
            </SignUpButton>
          </>
        ) : (
          <>
            <Link href={dashboardRoute} className="py-2 px-4 bg-blue-100 text-black rounded-full">
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