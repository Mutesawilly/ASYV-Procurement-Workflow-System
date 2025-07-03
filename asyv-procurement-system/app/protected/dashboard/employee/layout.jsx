import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/dashboard/employee-dashboard-sidebar";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const user = await currentUser();
  const clerkId = user?.id;

  // Mock data for procurement requests on the employee dashboard
  const cuser = await prisma.User.findUnique({
    where: { clerkId },
  });

  if (cuser.role === "ADMIN") {
    redirect("/protected/dashboard/admin")
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
