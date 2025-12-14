import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export default async function EmployeeLayout({ children }) {
  // Create Supabase server client

  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/");
  }

  const cuser = await prisma.profile.findFirst({
    where: { email: { equals: user.email, mode: "insensitive" } },
  });

  if (!cuser) {
    redirect("/");
  }

  // Check if user has department, if not redirect to department selection
  if (!cuser.department) {
    redirect("/protected/department-selection");
  }

  // Role-based redirects
  if (!["EMPLOYEE", "STOREKEEPER", "DEPARTMENT_HEAD"].includes(cuser.role)) {
    redirect("/protected/dashboard/admin");
  }

  // Render children without sidebar
  return (
    <main suppressHydrationWarning>
      {children}
    </main>
  );
}
