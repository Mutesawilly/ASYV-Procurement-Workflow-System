import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
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
} from "@/components/ui/table";
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
import { SignOutButton, UserProfile, useUser } from "@clerk/nextjs";
import { AppSidebar } from "@/components/ui/dashboard/employee-dashboard-sidebar";
import ProcurementViewDialog from "@/components/order-preview/preview-dialog";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { redirect } from "next/navigation";

export default async function employeeDashboard() {
  const testRole = "EMPLOYEE";
  const user = await currentUser();
  const clerkId = user?.id;

  const storekeeperProcurementRequests =
    await prisma.ProcurementRequest.findMany();
  const storekeeperRequests = await prisma.ProcurementRequest.findMany({
    where: { stage: "STA_EMPLOYEE" },
  });
  const hodRequests = await prisma.ProcurementRequest.findMany({
    where: {
      stage: "STA_STOREKEEPER",
    },
  });
  const invetoryRequests = await prisma.ProcurementRequest.findMany({
    where: {
      stage: "STA_SUPPLIER",
    },
  });
  const logisticsRequests = await prisma.ProcurementRequest.findMany({
    where: {
      stage: "STA_DEPARTMENT_HEAD",
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
  const employeeRequests = await prisma.ProcurementRequest.findMany({
    where: {
      requesterId: clerkId,
    },
  });

  // current user from the database
  const cuser = await prisma.User.findUnique({
    where: { clerkId },
  });
  if (!cuser) {
    // await prisma.user.upsert({
    //   data: {
    //     clerkId,
    //     email: user.emailAddresses?.[0]?.emailAddress,
    //     firstName: user.firstName,
    //     lastName: user.lastName,
    //     role: "EMPLOYEE",
    //   },
    // });
    // Optionally, fetch again or reload
    redirect("/sign-in");
    // return;
  }
  // Employee dashboard
  if (cuser.role === "EMPLOYEE") {
    const triggerBtn = (
      <Button className={"px-4 py-2 bg-gray-600 rounded-full"}>
        View Request
      </Button>
    );

    return (
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {user?.firstName}
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
              <SignOutButton>
                <p className="cursor-pointer flex rounded-full bg-red-300 hover:bg-red-400 py-2 px-4">
                  Sign Out
                </p>
              </SignOutButton>
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
                  $
                  {employeeRequests?.items
                    ?.reduce((acc, item) => acc + (item.totalPrice || 0), 0)
                    .toFixed(2)}
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
                    {employeeRequests.map((request, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {request.title}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {request.description}
                        </TableCell>
                        <TableCell>
                          {request.items[index]?.totalPrice}
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
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    );
  }

  // Storekeeper dashboad
  else if (cuser.role === "STOREKEEPER") {
    const approvalSteps = ["PENDING", "APPROVED", "REJECTED", "ERROR"];

    const requestStatusUpadate = async (newStatus, reqId) => {
      "use server";
      try {
        // checking for the user to update the role
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

    return (
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {user?.firstName}
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
              <SignOutButton>
                <p className="cursor-pointer text-white flex rounded-full bg-gray-700 hover:bg-gray-600 py-2 px-4">
                  Sign Out
                </p>
              </SignOutButton>
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
                  $
                  {storekeeperRequests.items?.reduce((acc, curr) => {
                    const current = curr.reduce(
                      (accumulator, currentItem) =>
                        accumulator + currentItem.totalPrice,
                      0
                    );
                    return acc + current;
                  }, 0)}
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
                        (acc, item) => acc + item.totalPrice,
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
                            {/* {console.log(request.items[index]?.totalPrice)} */}
                            ${requestTotalPrice.toFixed(3)}
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

  // DEPARTMENT_HEAD DASHBOARD
  else if (cuser.role === "DEPARTMENT_HEAD") {
    const triggerBtn = (
      <Button className={"px-4 py-2 bg-gray-600 rounded-full"}>
        View Request
      </Button>
    );

    return (
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {user?.firstName}
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
              <SignOutButton>
                <p className="cursor-pointer text-white flex rounded-full bg-gray-700 hover:bg-gray-600 py-2 px-4">
                  Sign Out
                </p>
              </SignOutButton>
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
                  $
                  {hodRequests?.items
                    ?.reduce((acc, item) => acc + (item.totalPrice || 0), 0)
                    .toFixed(2)}
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
                    {hodRequests.map((request, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {request.title}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {request.description}
                        </TableCell>
                        <TableCell>
                          {request.items[index]?.totalPrice}
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
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    );
  }

  // LOGISTICS_OFFICER DASHBOARD
  else if (cuser.role === "LOGISTICS_OFFICER") {
    const triggerBtn = (
      <Button className={"px-4 py-2 bg-gray-600 rounded-full"}>
        View Request
      </Button>
    );

    return (
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {user?.firstName}
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
              <SignOutButton>
                <p className="cursor-pointer flex rounded-full bg-red-300 hover:bg-red-400 py-2 px-4">
                  Sign Out
                </p>
              </SignOutButton>
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
                  $
                  {logisticsRequests?.items
                    ?.reduce((acc, item) => acc + (item.totalPrice || 0), 0)
                    .toFixed(2)}
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
                    {logisticsRequests.map((request, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {request.title}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {request.description}
                        </TableCell>
                        <TableCell>
                          {request.items[index]?.totalPrice}
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
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    );
  }
  // SUPPLIER DASHBOARD
  else if (cuser.role === "SUPPLIER") {
    const triggerBtn = (
      <Button className={"px-4 py-2 bg-gray-600 rounded-full"}>
        View Request
      </Button>
    );

    return (
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {user?.firstName}
              </h1>
              <p className="text-muted-foreground">
                Here's what's happening on{" "}
                <span className="bg-orange-300 text-black px-4 rounded-full">
                  SUPPLIER
                </span>{" "}
                dashboad.
              </p>
            </div>
            <div className="flex items-stretch justify-around space-x-2">
              <Link href="/">
                <p className="py-2 px-4 rounded-full bg-green-300">Home</p>
              </Link>
              <SignOutButton>
                <p className="cursor-pointer flex rounded-full bg-red-300 hover:bg-red-400 py-2 px-4">
                  Sign Out
                </p>
              </SignOutButton>
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
                  {supplierRequests.length}
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
                  {supplierRequests.length}
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
                  {supplierRequests.length}
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
                  $
                  {supplierRequests?.items
                    ?.reduce((acc, item) => acc + (item.totalPrice || 0), 0)
                    .toFixed(2)}
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
                    {supplierRequests.map((request, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {request.title}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {request.description}
                        </TableCell>
                        <TableCell>
                          {request.items[index]?.totalPrice}
                        </TableCell>
                        <TableCell>
                          <p className="px-4 py-2 rounded-full bg-orange-300 w-fit">
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
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    );
  }

  // INVENTORY_ASSET_MANAGER DASHBOARD
  else if (cuser.role === "INVENTORY_ASSET_MANAGER") {
    const triggerBtn = (
      <Button className={"px-4 py-2 bg-gray-600 rounded-full"}>
        View Request
      </Button>
    );
    return (
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {user?.firstName}
              </h1>
              <p className="text-muted-foreground">
                Here's what's happening on{" "}
                <span className="bg-blue-300 text-black px-4 rounded-full">
                  INVENTORY_ASSET_MANAGER
                </span>{" "}
                dashboad.
              </p>
            </div>
            <div className="flex items-stretch justify-around space-x-2">
              <Link href="/">
                <p className="py-2 px-4 rounded-full bg-green-300">Home</p>
              </Link>
              <SignOutButton>
                <p className="cursor-pointer flex rounded-full bg-red-300 hover:bg-red-400 py-2 px-4">
                  Sign Out
                </p>
              </SignOutButton>
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
                  {invetoryRequests.length}
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
                  {invetoryRequests.length}
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
                  {invetoryRequests.length}
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
                  $
                  {invetoryRequests?.items
                    ?.reduce((acc, item) => acc + (item.totalPrice || 0), 0)
                    .toFixed(2)}
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
                    {invetoryRequests.map((request, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {request.title}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {request.description}
                        </TableCell>
                        <TableCell>
                          {request.items[index]?.totalPrice}
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
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    );
  }

  // FINANCE_OFFICER DASHBOARD
  else if (cuser.role === "FINANCE_OFFICER") {
    const triggerBtn = (
      <Button
        className={
          "px-4 py-2 bg-gray-300 text-black rounded-full hover:text-white"
        }
      >
        View Request
      </Button>
    );

    return (
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {user?.firstName}
              </h1>
              <p className="text-muted-foreground">
                Here's what's happening on{" "}
                <span className="bg-pink-300 text-black px-4 rounded-full">
                  FINANCE_OFFICER
                </span>{" "}
                dashboad.
              </p>
            </div>
            <div className="flex items-stretch justify-around space-x-2">
              <Link href="/">
                <p className="py-2 px-4 rounded-full bg-gray-300 hover:bg-gray-400 duration-300 ease-in-out">
                  Home
                </p>
              </Link>
              <SignOutButton>
                <p className="cursor-pointer flex rounded-full bg-pink-300 hover:bg-pink-400 py-2 px-4 ease-in-out duration-300">
                  Sign Out
                </p>
              </SignOutButton>
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
                  {financeRequests.length}
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
                  {financeRequests.length}
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
                  {financeRequests.length}
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
                  $
                  {financeRequests?.items
                    ?.reduce((acc, item) => acc + (item.totalPrice || 0), 0)
                    .toFixed(2)}
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
                    {financeRequests.map((request, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {request.title}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {request.description}
                        </TableCell>
                        <TableCell>
                          {request.items[index]?.totalPrice}
                        </TableCell>
                        <TableCell>
                          <p className="px-4 py-2 rounded-full bg-pink-300 w-fit">
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
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    );
  }
}
