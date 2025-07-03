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
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default async function employeeDashboard() {
    const testRole = "EMPLOYEE"
    const user = await currentUser();
    const clerkId = user?.id;

    // Mock data for procurement requests on the employee dashboard
    const cuser = await prisma.User.findUnique({
        where: { clerkId },
    });

    const procurementRequests = await prisma.ProcurementRequest.findMany({
        where: {
            requesterId: clerkId,
        },
    });

    const pendingRequests = await prisma.ProcurementRequest.findMany({
        where: {
            requesterId: clerkId,
            status: "PENDING",
        },
    });


    const approvedRequests = await prisma.ProcurementRequest.findMany({
        where: {
            requesterId: clerkId,
            status: "APPROVED",
        },
    });

    // Mock data for procurement requests on the STOREKEEPER dashboard
    const storekeeperProcurementRequests = await prisma.ProcurementRequest.findMany();
    const storekeeperPendingRequests = await prisma.ProcurementRequest.findMany({
        where: {
            status: "PENDING",
        },
    });


    const storekeeperApprovedRequests = await prisma.ProcurementRequest.findMany({
        where: {
            status: "APPROVED",
        },
    });
    // Mock data for procurement requests on the DEPARTMENT_HEAD dashboard
    // Mock data for procurement requests on the LOGISTICS_OFFICER dashboard
    // Mock data for procurement requests on the INVENTORY_ASSET_MANAGER dashboard
    // Mock data for procurement requests on the FINANCE_OFFICER dashboard
    // Mock data for procurement requests on the SUPPLIER dashboard

    // Employee dashboard
    if (cuser.role === "EMPLOYEE") {
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
                                    {procurementRequests.length}
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
                                    {pendingRequests.length}
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
                                    {approvedRequests.length}
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
                                    {procurementRequests?.items
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
                                        {procurementRequests.map((request, index) => (
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
                                                    <Button variant="ghost" size="sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
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
        const approvalSteps = [
            "PENDING",
            "APPROVED",
            "REJECTED",
            "ERROR"
        ]
        const requestStatusUpadate = async (newStatus, reqId) => {
            "use server"
            try {
                // checking for the user to update the role
                const user = await prisma.ProcurementRequest.update({
                    where: { id: reqId },
                    data: {
                        status: newStatus
                    }
                })

                return { success: true };

            } catch (error) {
                console.log(error.message)
                return null;

            }
        }
        const triggerBtn = (
            <Button variant="outline">
                <View className="h-4 w-4 mr-2" />
                View Request
            </Button>
        )


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
                                <button className="bg-amber-600 px-4 rounded-full text-white">
                                    Storekeeper
                                </button>{" "}
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
                                    {storekeeperPendingRequests.length}
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
                                <div className="text-2xl font-bold">{storekeeperPendingRequests.length}</div>
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
                                <div className="text-2xl font-bold">{storekeeperApprovedRequests.length}</div>
                                <p className="text-xs text-muted-foreground">
                                    <span className="text-green-400 font-bold">+20</span> from last
                                    month
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    $
                                    {storekeeperProcurementRequests?.items
                                        ?.reduce((acc, item) => acc + (item.totalPrice || 0), 0)
                                        .toFixed(2)}
                                </div>
                                <p className="text-xs text-muted-foreground">Approved requests</p>
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
                                        {storekeeperProcurementRequests.map((request, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">
                                                    {request.title}
                                                </TableCell>
                                                <TableCell className="max-w-[200px] truncate">
                                                    {request.description}
                                                </TableCell>
                                                <TableCell>{request.items[index]?.totalPrice}</TableCell>
                                                <TableCell>
                                                    <RoleDropdown handleClick={async (status) => {
                                                        'use server'
                                                        requestStatusUpadate(status, request.id)
                                                    }} currentRole={request.status} allRoles={approvalSteps} />
                                                </TableCell>
                                                <TableCell>{request.items.length}</TableCell>
                                                <TableCell>
                                                    {request.createdAt.toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <ProcurementViewDialog triggerButton={triggerBtn} requestData={request} />
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
        )
    }

    // DEPARTMENT_HEAD DASHBOARD
    else if (cuser.role === "DEPARTMENT_HEAD") {
        <main className="container mx-auto px-4 py-6 space-y-6">
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Welcome back, {user?.firstName}
                        </h1>
                        <p className="text-muted-foreground">
                            Here's what's happening on{" "}
                            <span className="bg-green-600 py-1 px-4 rounded-full">
                                DEPARTMENT_HEAD
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
                                {procurementRequests.length}
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
                            <div className="text-2xl font-bold">{pendingRequests.length}</div>
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
                            <div className="text-2xl font-bold">{pendingRequests.length}</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-green-400 font-bold">+20</span> from last
                                month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                $
                                {procurementRequests?.items
                                    ?.reduce((acc, item) => acc + (item.totalPrice || 0), 0)
                                    .toFixed(2)}
                            </div>
                            <p className="text-xs text-muted-foreground">Approved requests</p>
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
                                    {procurementRequests.map((request, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">
                                                {request.title}
                                            </TableCell>
                                            <TableCell className="max-w-[200px] truncate">
                                                {request.description}
                                            </TableCell>
                                            <TableCell>{request.items[index]?.totalPrice}</TableCell>
                                            <TableCell>
                                                <Badge>{request.status}</Badge>
                                            </TableCell>
                                            <TableCell>{request.items.length}</TableCell>
                                            <TableCell>
                                                {request.createdAt.toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </main>;
    }

    // LOGISTICS_OFFICER DASHBOARD
    else if (cuser.role === "LOGISTICS_OFFICER") {
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
                                <span className="bg-blue-600 py-1 px-4 rounded-full">
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
                                    {procurementRequests.length}
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
                                <div className="text-2xl font-bold">{pendingRequests.length}</div>
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
                                <div className="text-2xl font-bold">{pendingRequests.length}</div>
                                <p className="text-xs text-muted-foreground">
                                    <span className="text-green-400 font-bold">+20</span> from last
                                    month
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    $
                                    {procurementRequests?.items
                                        ?.reduce((acc, item) => acc + (item.totalPrice || 0), 0)
                                        .toFixed(2)}
                                </div>
                                <p className="text-xs text-muted-foreground">Approved requests</p>
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
                                        {procurementRequests.map((request, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">
                                                    {request.title}
                                                </TableCell>
                                                <TableCell className="max-w-[200px] truncate">
                                                    {request.description}
                                                </TableCell>
                                                <TableCell>{request.items[index]?.totalPrice}</TableCell>
                                                <TableCell>
                                                    <Badge>{request.status}</Badge>
                                                </TableCell>
                                                <TableCell>{request.items.length}</TableCell>
                                                <TableCell>
                                                    {request.createdAt.toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
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
        )
    }
    // SUPPLIER DASHBOARD
    else if (cuser.role === "SUPPLIER") {
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
                                <span className="bg-orange-600 py-1 px-4 rounded-full">
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
                                    {procurementRequests.length}
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
                                <div className="text-2xl font-bold">{pendingRequests.length}</div>
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
                                <div className="text-2xl font-bold">{pendingRequests.length}</div>
                                <p className="text-xs text-muted-foreground">
                                    <span className="text-green-400 font-bold">+20</span> from last
                                    month
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    $
                                    {procurementRequests?.items
                                        ?.reduce((acc, item) => acc + (item.totalPrice || 0), 0)
                                        .toFixed(2)}
                                </div>
                                <p className="text-xs text-muted-foreground">Approved requests</p>
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
                                        {procurementRequests.map((request, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">
                                                    {request.title}
                                                </TableCell>
                                                <TableCell className="max-w-[200px] truncate">
                                                    {request.description}
                                                </TableCell>
                                                <TableCell>{request.items[index]?.totalPrice}</TableCell>
                                                <TableCell>
                                                    <Badge>{request.status}</Badge>
                                                </TableCell>
                                                <TableCell>{request.items.length}</TableCell>
                                                <TableCell>
                                                    {request.createdAt.toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
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
        )
    }

    // INVENTORY_ASSET_MANAGER DASHBOARD
    else if (cuser.role === "INVENTORY_ASSET_MANAGER") {
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
                                <span className="bg-blue-600 py-1 px-4 rounded-full">
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
                                    {procurementRequests.length}
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
                                <div className="text-2xl font-bold">{pendingRequests.length}</div>
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
                                <div className="text-2xl font-bold">{pendingRequests.length}</div>
                                <p className="text-xs text-muted-foreground">
                                    <span className="text-green-400 font-bold">+20</span> from last
                                    month
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    $
                                    {procurementRequests?.items
                                        ?.reduce((acc, item) => acc + (item.totalPrice || 0), 0)
                                        .toFixed(2)}
                                </div>
                                <p className="text-xs text-muted-foreground">Approved requests</p>
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
                                        {procurementRequests.map((request, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">
                                                    {request.title}
                                                </TableCell>
                                                <TableCell className="max-w-[200px] truncate">
                                                    {request.description}
                                                </TableCell>
                                                <TableCell>{request.items[index]?.totalPrice}</TableCell>
                                                <TableCell>
                                                    <Badge>{request.status}</Badge>
                                                </TableCell>
                                                <TableCell>{request.items.length}</TableCell>
                                                <TableCell>
                                                    {request.createdAt.toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
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
        )
    }

    // FINANCE_OFFICER DASHBOARD
    else if (cuser.role === "FINANCE_OFFICER") {
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
                                <span className="bg-orange-600 py-1 px-4 rounded-full">
                                    FINANCE_OFFICER
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
                                    {procurementRequests.length}
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
                                <div className="text-2xl font-bold">{pendingRequests.length}</div>
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
                                <div className="text-2xl font-bold">{pendingRequests.length}</div>
                                <p className="text-xs text-muted-foreground">
                                    <span className="text-green-400 font-bold">+20</span> from last
                                    month
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    $
                                    {procurementRequests?.items
                                        ?.reduce((acc, item) => acc + (item.totalPrice || 0), 0)
                                        .toFixed(2)}
                                </div>
                                <p className="text-xs text-muted-foreground">Approved requests</p>
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
                                        {procurementRequests.map((request, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">
                                                    {request.title}
                                                </TableCell>
                                                <TableCell className="max-w-[200px] truncate">
                                                    {request.description}
                                                </TableCell>
                                                <TableCell>{request.items[index]?.totalPrice}</TableCell>
                                                <TableCell>
                                                    <Badge>{request.status}</Badge>
                                                </TableCell>
                                                <TableCell>{request.items.length}</TableCell>
                                                <TableCell>
                                                    {request.createdAt.toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
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
        )
    }

}
