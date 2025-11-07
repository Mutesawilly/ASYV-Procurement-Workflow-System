import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-between">
        <nav className="w-full flex justify-between border-b border-b-foreground/10 h-16">
          <div className="w-full flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>ASYV-PWS</Link>
            </div>
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </nav>
        {/* The Hero Section */}
        <section className="flex flex-col items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Welcome to ASYV Procurement System
            </h1>
            <p className="text-lg mb-6">
              Streamlining procurement processes for a better future.
            </p>
            <button className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 cursor-pointer">
              Watch a Demo
            </button>
          </div>
        </section>

        {/* The Footer Section */}        
        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-10">
          <p>
            &copy; {new Date().getFullYear()} ASYV Procurement System. All
            rights reserved.
          </p>
          <ThemeSwitcher />
        </footer>
    </main>
  );
}
