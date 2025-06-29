import Link from "next/link";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default function Navigation() {
  return (
    <main className="flex items-center justify-between">
        {/* The Application Logo and Name */}
        <h1 className="text-xl font-bold">ASYV-PWS</h1>

        {/* Login, Signup and Profile Buttons */}
        <div className="flex items-center justify-end space-x-4">
            <SignInButton className="cursor-pointer border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-100">
              Login
            </SignInButton>
            <SignUpButton className="cursor-pointer bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800">
              Sign Up
            </SignUpButton>
        </div>
    </main>
  )
}