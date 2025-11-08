'use server';

import DashboardLayout from "../employee/layout";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/");

  const cuser = await prisma.profile.findFirst({
    where: { email: { equals: user.email, mode: "insensitive" } },
  });
  if (!cuser) redirect("/auth/login");

  let requests = [];
  const role = cuser.role;

  switch (role) {
    case "EMPLOYEE":
      requests = await prisma.procurementRequest.findMany({
        where: { requesterId: cuser.id },
        include: { ProcurementItems: true },
        orderBy: { createdAt: "desc" },
      });
      break;
    case "STOREKEEPER":
      requests = await prisma.procurementRequest.findMany({
        where: { stage: "STA_STOREKEEPER" },
        include: { ProcurementItems: true },
        orderBy: { createdAt: "desc" },
      });
      break;
    case "DEPARTMENT_HEAD":
      requests = await prisma.procurementRequest.findMany({
        where: { stage: "DEPARTMENT_HEAD" },
        include: { ProcurementItems: true },
        orderBy: { createdAt: "desc" },
      });
      break;
  }

  // Rename procurementItems -> items for layout
  const serializedRequests = requests.map(r => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    items: r.procurementItems?.map(item => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    })) || [],
  }));

  return (
    <DashboardLayout
      email={cuser.email}
      roleName={role}
      requests={serializedRequests}
    />
  );
}
