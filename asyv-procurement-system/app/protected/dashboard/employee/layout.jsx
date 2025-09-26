import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/dashboard/employee-dashboard-sidebar";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({ children }) {
  const user = await currentUser();
  const clerkId = user?.id;

  if (!clerkId) {
    redirect("/sign-in");
  }

  const cuser = await prisma.user.findUnique({
    where: { clerkId },
  });
      
  if (!cuser) {
      // redirect or show fallback
      redirect("/sign-in"); // from next/navigation
      // OR
      return <div>Loading user...</div>;
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
