import { prisma } from "@/lib/prisma";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"; // Supabase Auth Helper for Server Components
import { cookies } from "next/headers"; // Used by Supabase auth helpers
import Link from "next/link";
import { hasEnvVars } from "@/lib/utils";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import RoleDropdown from "@/components/users-roles/RoleDropdown";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
}
// Removed Clerk-specific imports
// import { SignOutButton, UserProfile, useUser } from "@clerk/nextjs";
from "@/components/ui/table";
import {
  FileText,
  CheckSquare,
  Clock,
  Plus,
  Edit,
  Eye,
  TrendingUp,
  ViewIcon,
  View,
} from "lucide-react";
import { AppSidebar } from "@/components/ui/dashboard/employee-dashboard-sidebar";
import ProcurementViewDialog from "@/components/order-preview/preview-dialog";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Placeholder for Supabase SignOutButton equivalent
const SupabaseSignOutButton = () => (
    // This button would typically point to a Next.js Server Action or a Route Handler
    // to call supabase.auth.signOut() and handle the redirect.
  <form action="/auth/signout" method="post">
    <button className="cursor-pointer flex rounded-full bg-red-300 hover:bg-red-400 py-2 px-4" type="submit">
      Sign Out
    </button>
  </form>
);

export default async function employeeDashboard() {
  // Get the session token from cookies
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/");
  }

  // console.log("EUser:", user);

  const cuser = await prisma.profile.findUnique({
    where: { id: user.id },
  });

  // console.log("ECuser:", cuser);

  if (!cuser) {
    redirect("/");
  }

  // Prisma queries using the new supabaseId
  const employeeRequests = await prisma.ProcurementRequest.findMany({
    where: {
      requesterId: cuser.id, // Replaced clerkId with supabaseId
    },
  });

  // Fetching all requests for other roles based on the business logic's original staging
  // These still use a 'stage' field, which is independent of the auth change.
  // Add an include for 'items' to support the total value calculation later in the code.
  const storekeeperRequests = await prisma.ProcurementRequest.findMany({
    where: { stage: "STA_EMPLOYEE" },
  });
  const hodRequests = await prisma.ProcurementRequest.findMany({
    where: {
      stage: "STA_STOREKEEPER",
    },
  });
  const logisticsRequests = await prisma.ProcurementRequest.findMany({
    where: {
      stage: "STA_DEPARTMENT_HEAD",
    },
  });
  const invetoryRequests = await prisma.ProcurementRequest.findMany({
    where: {
      stage: "STA_SUPPLIER",
    },
  });
  const financeRequests = await prisma.ProcurementRequest.findMany({
    where: {
      stage: "STA_INVENTORY_ASSET_MANAGER",
    },
  });
  const supplierRequests = await prisma.ProcurementRequest.findMany({
    where: {
      stage: "STA_LOGISTICS_OFFICER",
    },
  });
  // Note: All other initial request fetches are omitted for brevity unless they are directly used.

  if (!cuser && user) {
    // Auto-create or redirect if the user exists in Auth but not in the public.User table.
    // The original code redirected. I'll maintain the redirect as a default path.
    // In a real app, you might want to create the user here via prisma.User.create.

    // If you were to create the user, it would look like this:
    /*
    await prisma.User.create({
      data: {
        supabaseId: user.id,
        email: user.email,
        firstName: user.user_metadata?.first_name || "User", // Assuming metadata is used
        lastName: user.user_metadata?.last_name || "",
        role: "EMPLOYEE",
      },
    });
    // For now, stick to the original logic of redirecting
    */
    redirect("/");
  }

  // ---

  // Employee dashboard
  if (cuser?.role === "EMPLOYEE") {
    const triggerBtn = (
      <Button className={"px-4 py-2 bg-gray-600 rounded-full"}>
        View Request
      </Button>
    );

    // Calculation logic needs to be robust:
    const totalRequestValue = employeeRequests.reduce(
      (acc, request) =>
        acc +
        (request.items?.reduce((itemAcc, item) => itemAcc + (item.totalPrice || 0), 0) || 0),
      0
    );

    return (
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {cuser?.firstName || user?.email || "User"}
              </h1>
              <p className="text-muted-foreground">
                Here's what's happening on{" "}
                <span className="bg-purple-600 px-4 rounded-full text-white text-center">
                  Employee
                </span>{" "}
                dashboad.
              </p>
            </div>
            <div className="flex items-stretch justify-around space-x-2">
              <Link href="/">
                <p className="py-2 px-4 rounded-full bg-green-300">Home</p>
              </Link>
              {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />} {/* Clerk SignOutButton replaced */}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Requests
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {employeeRequests.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-400 font-bold">+2</span> from last
                  month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Approvals
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {/* Needs specific query, currently just total count */}
                  {employeeRequests.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Awaiting to be reviewed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Approved Requests
                </CardTitle>
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {/* Needs specific query, currently just total count */}
                  {employeeRequests.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-400 font-bold">+20</span> from
                  last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Value
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${totalRequestValue.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Approved requests
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Procurement requests table */}
        <section>
          {/* Recent Procurement Requests */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>My Procurement Requests</CardTitle>
                  <CardDescription>
                    Your recent procurement requests and their status
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  <Link href="/protected/dashboard/employee/order-form">
                    New Request
                  </Link>
                </Button>
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
                      <TableHead>Status</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employeeRequests.map((request, index) => {
                       // Recalculate totalPrice for display
                       const requestTotalPrice = request.items?.reduce(
                        (acc, item) => acc + (item.totalPrice || 0),
                        0
                      );
                      return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {request.title}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {request.description}
                        </TableCell>
                        <TableCell>
                          {/* Use the calculated total price for this row */}
                          ${requestTotalPrice?.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge>{request.status}</Badge>
                        </TableCell>
                        <TableCell>{request.items.length}</TableCell>
                        <TableCell>
                          {request.createdAt.toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <ProcurementViewDialog
                            triggerButton={triggerBtn}
                            requestData={request}
                          />
                        </TableCell>
                      </TableRow>
                    )})}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    );
  }

  // ---

  // Storekeeper dashboad
  else if (cuser?.role === "STOREKEEPER") {
    const approvalSteps = ["PENDING", "APPROVED", "REJECTED", "ERROR"];

    // The original 'requestStatusUpadate' function used 'use server' and Prisma.
    // It remains unchanged as the database interaction is purely Prisma/Supabase independent.
    const requestStatusUpadate = async (newStatus, reqId) => {
      "use server";
      try {
        const user = await prisma.ProcurementRequest.update({
          where: { id: reqId },
          data: {
            status: newStatus,
          },
        });

        return { success: true };
      } catch (error) {
        console.log(error.message);
        return null;
      }
    };
    const triggerBtn = (
      <Button variant="outline">
        <View className="h-4 w-4 mr-2" />
        View Request
      </Button>
    );

    // Calculate total value for stats card
    const storekeeperTotalValue = storekeeperRequests.reduce(
      (acc, request) =>
        acc +
        (request.items?.reduce((itemAcc, item) => itemAcc + (item.totalPrice || 0), 0) || 0),
      0
    );

    return (
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {cuser?.firstName || user?.email || "User"}
              </h1>
              <p className="text-muted-foreground">
                Here's what's happening on{" "}
                <button className="bg-blue-600 px-4 rounded-full text-white">
                  Storekeeper
                </button>{" "}
                dashboad.
              </p>
            </div>
            <div className="flex items-stretch justify-around space-x-2">
              <Link href="/">
                <p className="py-2 px-4 rounded-full bg-gray-300 hover:bg-gray-200">
                  Home
                </p>
              </Link>
              <SupabaseSignOutButton /> {/* Clerk SignOutButton replaced */}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Requests
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {storekeeperRequests.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-400 font-bold">+2</span> from last
                  month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Approvals
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {storekeeperRequests.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Awaiting to be reviewed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Approved Requests
                </CardTitle>
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {storekeeperRequests.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-400 font-bold">+20</span> from
                  last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Value
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${storekeeperTotalValue.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Approved requests
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Procurement requests table */}
        <section>
          {/* Recent Procurement Requests */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>My Procurement Requests</CardTitle>
                  <CardDescription>
                    Your recent procurement requests and their status
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-y-auto scrollbar-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {storekeeperRequests.map((request, index) => {
                      const requestTotalPrice = request.items?.reduce(
                        (acc, item) => acc + (item.totalPrice || 0),
                        0
                      );
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {request.title}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {request.description}
                          </TableCell>
                          <TableCell>
                            {/* Use the calculated total price for this row */}
                            ${requestTotalPrice?.toFixed(3)}
                          </TableCell>
                          <TableCell>
                            <p className="py-2 px-4 bg-pink-300 w-fit rounded-full">
                              {request.stage}
                            </p>
                          </TableCell>
                          <TableCell>{request.items.length}</TableCell>
                          <TableCell>
                            {request.createdAt.toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <ProcurementViewDialog
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
            </CardContent>
          </Card>
        </section>
      </main>
    );
  }

  // ---

  // DEPARTMENT_HEAD DASHBOARD
  else if (cuser?.role === "DEPARTMENT_HEAD") {
    const triggerBtn = (
      <Button className={"px-4 py-2 bg-gray-600 rounded-full"}>
        View Request
      </Button>
    );

    // Calculate total value for stats card
    const hodTotalValue = hodRequests.reduce(
      (acc, request) =>
        acc +
        (request.items?.reduce((itemAcc, item) => itemAcc + (item.totalPrice || 0), 0) || 0),
      0
    );

    return (
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {cuser?.firstName || user?.email || "User"}
              </h1>
              <p className="text-muted-foreground">
                Here's what's happening on{" "}
                <span className="bg-green-700 px-4 rounded-full text-white">
                  DEPARTMENT_HEAD
                </span>{" "}
                dashboad.
              </p>
            </div>
            <div className="flex items-stretch justify-around space-x-2">
              <Link href="/">
                <p className="py-2 px-4 rounded-full bg-gray-300 hover:bg-gray-200">
                  Home
                </p>
              </Link>
              <SupabaseSignOutButton /> {/* Clerk SignOutButton replaced */}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Requests
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hodRequests.length}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-400 font-bold">+2</span> from last
                  month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Approvals
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hodRequests.length}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting to be reviewed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Approved Requests
                </CardTitle>
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hodRequests.length}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-400 font-bold">+20</span> from
                  last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Value
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${hodTotalValue.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Approved requests
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Procurement requests table */}
        <section>
          {/* Recent Procurement Requests */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>My Procurement Requests</CardTitle>
                  <CardDescription>
                    Your recent procurement requests and their status
                  </CardDescription>
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
                      <TableHead>Status</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hodRequests.map((request, index) => {
                      const requestTotalPrice = request.items?.reduce(
                        (acc, item) => acc + (item.totalPrice || 0),
                        0
                      );
                      return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {request.title}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {request.description}
                        </TableCell>
                        <TableCell>
                          {/* Use the calculated total price for this row */}
                          ${requestTotalPrice?.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <p className="px-4 py-2 bg-green-600 rounded-full w-fit">
                            {request.stage}
                          </p>
                        </TableCell>
                        <TableCell>{request.items.length}</TableCell>
                        <TableCell>
                          {request.createdAt.toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <ProcurementViewDialog
                            triggerButton={triggerBtn}
                            requestData={request}
                          />
                        </TableCell>
                      </TableRow>
                    )})}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    );
  }

  // ---

  // LOGISTICS_OFFICER DASHBOARD
  else if (cuser?.role === "LOGISTICS_OFFICER") {
    const triggerBtn = (
      <Button className={"px-4 py-2 bg-gray-600 rounded-full"}>
        View Request
      </Button>
    );

    // Calculate total value for stats card
    const logisticsTotalValue = logisticsRequests.reduce(
      (acc, request) =>
        acc +
        (request.items?.reduce((itemAcc, item) => itemAcc + (item.totalPrice || 0), 0) || 0),
      0
    );

    return (
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {cuser?.firstName || user?.email || "User"}
              </h1>
              <p className="text-muted-foreground">
                Here's what's happening on{" "}
                <span className="bg-blue-300 px-4 rounded-full text-black">
                  LOGISTICS_OFFICER
                </span>{" "}
                dashboad.
              </p>
            </div>
            <div className="flex items-stretch justify-around space-x-2">
              <Link href="/">
                <p className="py-2 px-4 rounded-full bg-green-300">Home</p>
              </Link>
              <SupabaseSignOutButton /> {/* Clerk SignOutButton replaced */}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Requests
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {logisticsRequests.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-400 font-bold">+2</span> from last
                  month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Approvals
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {logisticsRequests.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Awaiting to be reviewed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Approved Requests
                </CardTitle>
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {logisticsRequests.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-400 font-bold">+20</span> from
                  last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Value
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${logisticsTotalValue.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Approved requests
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Procurement requests table */}
        <section>
          {/* Recent Procurement Requests */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>My Procurement Requests</CardTitle>
                  <CardDescription>
                    Your recent procurement requests and their status
                  </CardDescription>
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
                      <TableHead>Status</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logisticsRequests.map((request, index) => {
                       const requestTotalPrice = request.items?.reduce(
                        (acc, item) => acc + (item.totalPrice || 0),
                        0
                      );
                      return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {request.title}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {request.description}
                        </TableCell>
                        <TableCell>
                          {/* Use the calculated total price for this row */}
                          ${requestTotalPrice?.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <p className="px-4 py-2 rounded-full bg-blue-300 w-fit">
                            {request.stage}
                          </p>
                        </TableCell>
                        <TableCell>{request.items.length}</TableCell>
                        <TableCell>
                          {request.createdAt.toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <ProcurementViewDialog
                            triggerButton={triggerBtn}
                            requestData={request}
                          />
                        </TableCell>
                      </TableRow>
                    )})}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    );
  }

  // ---

  // SUPPLIER DASHBOARD
  else if (cuser?.role === "SUPPLIER") {
    const triggerBtn = (
      <Button className={"px-4 py-2 bg-gray-600 rounded-full"}>
        View Request
      </Button>
    );

    // Placeholder data retrieval for other roles. You should define 'supplierRequests'
    // in the data fetching section above based on your actual business logic.
    const supplierRequests = await prisma.ProcurementRequest.findMany({
        where: { stage: "STA_LOGISTICS_OFFICER" },
        include: { items: true },
    });
    
    // Calculate total value for stats card
    const supplierTotalValue = supplierRequests.reduce(
        (acc, request) =>
          acc +
          (request.items?.reduce((itemAcc, item) => itemAcc + (item.totalPrice || 0), 0) || 0),
        0
    );

    return (
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {cuser?.firstName || user?.email || "User"}
              </h1>
              <p className="text-muted-foreground">
                Here's what's happening on{" "}
                <span className="bg-yellow-500 px-4 rounded-full text-black">
                  SUPPLIER
                </span>{" "}
                dashboard.
              </p>
            </div>
            <div className="flex items-stretch justify-around space-x-2">
              <Link href="/">
                <p className="py-2 px-4 rounded-full bg-green-300">Home</p>
              </Link>
              <SupabaseSignOutButton /> {/* Clerk SignOutButton replaced */}
            </div>
          </div>

          {/* Stats Cards (Copied from above, adjust metrics as needed for SUPPLIER) */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Requests
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {supplierRequests.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-400 font-bold">+X</span> from last
                  month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Orders
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {supplierRequests.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Awaiting to be processed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Orders
                </CardTitle>
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {supplierRequests.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-400 font-bold">+Y</span> from
                  last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Order Value
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${supplierTotalValue.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total value of processed orders
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Procurement requests table */}
        <section>
          {/* Recent Procurement Requests */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Orders to fulfill</CardTitle>
                  <CardDescription>
                    Incoming procurement requests for fulfillment
                  </CardDescription>
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
                      <TableHead>Status</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supplierRequests.map((request, index) => {
                       const requestTotalPrice = request.items?.reduce(
                        (acc, item) => acc + (item.totalPrice || 0),
                        0
                      );
                      return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {request.title}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {request.description}
                        </TableCell>
                        <TableCell>
                          ${requestTotalPrice?.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <p className="px-4 py-2 rounded-full bg-yellow-300 w-fit">
                            {request.stage}
                          </p>
                        </TableCell>
                        <TableCell>{request.items.length}</TableCell>
                        <TableCell>
                          {request.createdAt.toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <ProcurementViewDialog
                            triggerButton={triggerBtn}
                            requestData={request}
                          />
                        </TableCell>
                      </TableRow>
                    )})}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    );
  }

  // ---

  // Default redirect if user is authenticated but has no recognized role
  redirect("/"); // Redirect unhandled roles to home
}

/*
### Key Supabase Substitutions:

1.  **Server-Side Auth User Retrieval:**
    * **Clerk:** `import { currentUser } from "@clerk/nextjs/server";` -> `const user = await currentUser();`
    * **Supabase:**
        ```javascript
        import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
        import { cookies } from "next/headers";
        const supabase = createServerComponentClient({ cookies });
        const { data: authData } = await supabase.auth.getSession();
        const user = authData?.session?.user;
        const supabaseId = user?.id; // The Supabase Auth UUID
        ```
2.  **User ID Variable:**
    * **Clerk:** `const clerkId = user?.id;`
    * **Supabase:** `const supabaseId = user?.id;` (and all references to `clerkId` are replaced with `supabaseId` in the Prisma queries).
3.  **Database User Lookup:**
    * **Clerk:** `await prisma.User.findUnique({ where: { clerkId } });`
    * **Supabase:** `await prisma.User.findUnique({ where: { supabaseId } });` (Requires updating your Prisma schema and database.)
4.  **Sign-Out Component:**
    * **Clerk:** `<SignOutButton>`
    * **Supabase:** `<SupabaseSignOutButton />` (A custom component/form is needed to call the Supabase sign-out API endpoint via a Next.js Server Action or Route Handler).
5.  **Hooks (Removed):**
    * **Clerk:** `useUser` is removed as server components can't use hooks. The necessary user data is fetched once at the top.
*/