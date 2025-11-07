import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/dashboard/employee-dashboard-sidebar";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma"; // FIRST
import { headers } from "next/headers";


export default async function DashboardLayout({ children }) {
  // Get the session token from cookies
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/");
  }

  // console.log("User:", user);

  const cuser = await prisma.profile.findUnique({
    where: { id: user.id },
  });

  // console.log("Cuser:", cuser);

  if (!cuser) {
    redirect("/");
  }


  return (
    <SidebarProvider>
      {/* <AppSidebar /> */}
      <main className="flex-1" suppressHydrationWarning>
        {children}
      </main>
    </SidebarProvider>
  );
}
