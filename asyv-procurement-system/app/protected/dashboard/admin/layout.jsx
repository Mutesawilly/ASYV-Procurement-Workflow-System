import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/dashboard/dashboard-sidebar";
import { redirect } from "next/navigation"; 
import { currentUser } from "@clerk/nextjs/server";

export default async function DashboardLayout({ children }) {
  const user = await currentUser();
      const clerkId = user?.id;
  
      // Mock data for procurement requests on the employee dashboard
      const cuser = await prisma.User.findUnique({
          where: { clerkId },
      });
    
    if (!cuser) {
        // redirect or show fallback
        redirect("/sign-in"); // from next/navigation
        // OR
        return <div>Loading user...</div>;
    }

      if (cuser.role === "ADMIN"){
        redirect("/protected/dashboard/admin")
      } else {
        redirect("/protected/dashboard/employee")
      }
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1" suppressHydrationWarning>
        {children}
      </main>
    </SidebarProvider>
  );
}
