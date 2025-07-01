"use client"

import { useState } from "react"
import * as Clerk from "@clerk/elements/common"
import * as SignUp from "@clerk/elements/sign-up"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-white border-0 shadow-lg">
        <CardContent className="p-8">
          <SignUp.Root>
            <SignUp.Step name="start">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">Create your account</h1>
                <p className="text-gray-600 text-sm">Get started with your free account</p>
              </div>

              {/* Google Sign Up Button */}
              <Clerk.Connection
                name="google"
                className="w-full mb-6 h-11 border-2 border-gray-200 hover:bg-gray-50 transition-colors bg-transparent rounded-md flex items-center justify-center font-medium text-gray-700"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Clerk.Connection>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-5">
                {/* Username Field */}
                <Clerk.Field name="username" className="space-y-2">
                  <Clerk.Label className="text-sm font-medium text-gray-700">Full name</Clerk.Label>
                  <Clerk.Input
                    className="w-full h-11 px-3 border-2 border-gray-200 rounded-md focus:border-gray-900 focus:ring-gray-900 focus:outline-none transition-colors"
                    placeholder="Enter your full name"
                  />
                  <Clerk.FieldError className="text-sm text-red-600" />
                </Clerk.Field>

                {/* Email Field */}
                <Clerk.Field name="emailAddress" className="space-y-2">
                  <Clerk.Label className="text-sm font-medium text-gray-700">Email address</Clerk.Label>
                  <Clerk.Input
                    className="w-full h-11 px-3 border-2 border-gray-200 rounded-md focus:border-gray-900 focus:ring-gray-900 focus:outline-none transition-colors"
                    placeholder="Enter your email"
                  />
                  <Clerk.FieldError className="text-sm text-red-600" />
                </Clerk.Field>

                {/* Password Field */}
                <Clerk.Field name="password" className="space-y-2">
                  <Clerk.Label className="text-sm font-medium text-gray-700">Password</Clerk.Label>
                  <div className="relative">
                    <Clerk.Input
                      type={showPassword ? "text" : "password"}
                      className="w-full h-11 px-3 pr-10 border-2 border-gray-200 rounded-md focus:border-gray-900 focus:ring-gray-900 focus:outline-none transition-colors"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <Clerk.FieldError className="text-sm text-red-600" />
                </Clerk.Field>

                {/* Submit Button */}
                <SignUp.Action
                  submit
                  className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-md transition-colors"
                >
                  Create account
                </SignUp.Action>
              </div>

              {/* Terms */}
              <p className="mt-4 text-xs text-gray-500 text-center">
                By creating an account, you agree to our{" "}
                <a href="#" className="text-gray-700 hover:underline">
                  Terms of Service
                </a>
                {" and "}
                <a href="#" className="text-gray-700 hover:underline">
                  Privacy Policy
                </a>
              </p>

              {/* Sign In Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <a href="/sign-in" className="font-medium text-gray-900 hover:underline transition-all">
                    Sign in
                  </a>
                </p>
              </div>
            </SignUp.Step>

            {/* Email Verification Step */}
            <SignUp.Step name="verifications">
              <SignUp.Strategy name="email_code">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-semibold text-gray-900 mb-2">Check your email</h1>
                  <p className="text-gray-600 text-sm">We sent a verification code to your email address</p>
                </div>

                <div className="space-y-5">
                  <Clerk.Field name="code" className="space-y-2">
                    <Clerk.Label className="text-sm font-medium text-gray-700">Verification code</Clerk.Label>
                    <Clerk.Input
                      className="w-full h-11 px-3 border-2 border-gray-200 rounded-md focus:border-gray-900 focus:ring-gray-900 focus:outline-none transition-colors text-center text-lg tracking-widest"
                      placeholder="Enter code"
                    />
                    <Clerk.FieldError className="text-sm text-red-600" />
                  </Clerk.Field>

                  <SignUp.Action
                    submit
                    className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-md transition-colors"
                  >
                    Verify email
                  </SignUp.Action>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    {"Didn't receive the code? "}
                    <SignUp.Action
                      resend
                      className="font-medium text-gray-900 hover:underline transition-all bg-transparent border-0 p-0"
                    >
                      Resend
                    </SignUp.Action>
                  </p>
                </div>
              </SignUp.Strategy>
            </SignUp.Step>
          </SignUp.Root>
        </CardContent>
      </Card>
    </div>
  )
}
