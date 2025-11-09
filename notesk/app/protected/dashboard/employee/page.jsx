"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Clock, CheckSquare, TrendingUp } from "lucide-react";

import ProcurementViewDialog from "@/components/order-preview/preview-dialog";
import { Button } from "@/components/ui/button";

// CONFIG: page size for pagination - REMOVED
// const PAGE_SIZE = 5;

// Removed awaitedSearchParams from the props since it was only used for pagination
export default async function EmployeeDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) redirect("/");

  const cuser = await prisma.profile.findFirst({
    where: { email: { equals: user.email, mode: "insensitive" } },
  });

  if (!cuser) redirect("/auth/login");

  const role = cuser.role;

  // Role-based redirect if needed
  if (!["EMPLOYEE", "STOREKEEPER", "DEPARTMENT_HEAD"].includes(role)) {
    redirect("/unauthorized");
  }

  // searchParams logic removed

  // Pagination logic removed
  // const page = parseInt(searchParams?.page || "1", 10);
  // const skip = (page - 1) * PAGE_SIZE;

  let requests = await prisma.procurementRequest.findMany({
    where:
      role === "EMPLOYEE"
        ? { requesterId: cuser.id }
        : role === "STOREKEEPER"
        ? { stage: "STA_STOREKEEPER" }
        : role === "DEPARTMENT_HEAD"
        ? { stage: "STA_DEPARTMENT_HEAD" }
        : {},
    include: {
      ProcurementItems: true,
      requester: true,
    },
    orderBy: { createdAt: "desc" },
    // skip removed
    // take removed
  });

  // Count total requests for pagination - REMOVED, now using requests.length
  const totalRequests = requests.length;

  // const totalPages = Math.ceil(totalRequests / PAGE_SIZE); // Removed

  // Serialization
  const serializedRequests = requests.map((r) => ({
    ...r,
    id: r.id.toString(),
    requesterId: r.requesterId.toString(),
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    items: r.ProcurementItems.map((item) => ({
      ...item,
      id: item.id.toString(),
      procurementRequestId: item.procurementRequestId.toString(),
    })),
    requester: {
      ...r.requester,
      id: r.requester.id.toString(),
    },
  }));

  const reqs = Array.isArray(serializedRequests) ? serializedRequests : [];

  // Compute stats
  const totalValue = reqs.reduce(
    (acc, request) =>
      acc +
      (request.items?.reduce(
        (itemAcc, item) => itemAcc + (parseFloat(item.totalPrice) || 0),
        0
      ) || 0),
    0
  );

  const triggerBtn = (
    <Button variant="outline" className={"px-4 py-2 rounded-full bg-green-200"}>
      View Request
    </Button>
  );

  return (
    <main className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user.email}
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening on{" "}
            <span className="bg-green-600 px-4 rounded-full text-white">
              {role}
            </span>{" "}
            dashboard.
          </p>
        </div>

        <div className="flex items-stretch justify-around space-x-2">
          <Link href="/">
            <p className="py-2 px-4 rounded-full bg-green-300 cursor-pointer">
              Home
            </p>
          </Link>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="cursor-pointer flex rounded-full bg-green-300 green:bg-red-400 py-2 px-4"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRequests}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approvals
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reqs.filter((r) => r.status === "PENDING").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Approved Requests
            </CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reqs.filter((r) => r.status === "APPROVED").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Requests Table */}
      <section>
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <div>
                <CardTitle>{role} Requests Dashboard</CardTitle>
                <CardDescription>
                  Your recent requests and their status
                </CardDescription>
              </div>
              <div>{role === "EMPLOYEE" ? (
                
                <Link
                  href="/protected/dashboard/employee/order-form"
                  className="flex rounded-full bg-green-800 text-white px-5 py-2" // Apply styles directly to Link
                >
                  + Request
                </Link>
              ) : (
                
                <div></div>
              )}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {reqs.map((request) => {
                    const requestTotalPrice = request.items.reduce(
                      (acc, item) => acc + (parseFloat(item.totalPrice) || 0),
                      0
                    );

                    return (
                      <TableRow key={request.id}>
                        <TableCell>{request.title}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {request.description}
                        </TableCell>
                        <TableCell>${requestTotalPrice.toFixed(2)}</TableCell>
                        <TableCell>{request.stage}</TableCell>
                        <TableCell>{request.items.length}</TableCell>
                        <TableCell>
                          {new Date(request.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <ProcurementViewDialog
                            userData={cuser}
                            triggerButton={triggerBtn}
                            requestData={request}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination UI removed */}
            {/* <div className="flex justify-center space-x-2 mt-4">
              {Array.from({ length: totalPages }, (_, i) => (
                <Link
                  key={i}
                  href={`/protected/dashboard/employee?page=${i + 1}`}
                  className={`px-3 py-1 rounded ${
                    i + 1 === page ? "bg-green-600 text-white" : "bg-green-200"
                  }`}
                >
                  {i + 1}
                </Link>
              ))}
            </div> */}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}