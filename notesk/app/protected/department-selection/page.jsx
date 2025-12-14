import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import DepartmentSelection from "@/components/department-selection";

export default async function DepartmentSelectionPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) redirect("/");

  const cuser = await prisma.Profile.findFirst({
    where: { email: { equals: user.email, mode: "insensitive" } },
  });

  if (!cuser) redirect("/auth/login");

  // If user already has department, redirect to dashboard
  if (cuser.department) {
    redirect("/protected/dashboard/employee");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <DepartmentSelection />
    </div>
  );
}
