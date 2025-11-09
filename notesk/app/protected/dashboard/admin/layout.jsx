import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/dashboard/dashboard-sidebar";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";


export default async function DashboardLayout({ children }) {
  // Create Supabase server client
  
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/");
  }

  console.log("User:", user);

  const cuser = await prisma.Profile.findUnique({
    where: { id: user.id },
  });

  // console.log("User:", cuser);

  if (!cuser) {
    redirect("/");
  }

  // Role-based redirects
  if (cuser.role != "ADMIN") {
    redirect("/protected/dashboard/employee");
  }

  // Render sidebar + children (fallback if redirect didn't occur)
  return (
    <SidebarProvider>
      {/* <AppSidebar /> */}
      <main className="flex-1" suppressHydrationWarning>
        {children}
      </main>
    </SidebarProvider>
  );
}
