'use client'

import { SignIn, useUser, SignOutButton } from '@clerk/nextjs'

export default function Home() {
  const { user } = useUser()

  if (!user) return <SignIn />

  return <div className='flex justify-center items-center'>
      <h1 className='text-2xl text-center'>Welcome to ASYV Procurement Workflow System!</h1>
      <SignOutButton />
    </div>
}