'use client'

import Image from "next/image";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { User } from "lucide-react";

export default function Profile() {    
    const { user } = useUser();

    return (
        <main className="flex justify-center items-center">
            <h1 className="text-2xl font-bold">Welcome {user?.firstName}</h1>         
        </main>
    )
}