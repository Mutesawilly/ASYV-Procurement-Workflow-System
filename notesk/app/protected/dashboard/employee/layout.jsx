'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Clock, CheckSquare, TrendingUp } from "lucide-react";
import ProcurementViewDialog from "@/components/order-preview/preview-dialog";

export default function DashboardLayout({ email, roleName, requests = [] }) {
  // Calculate total value of all requests
  const totalValue = requests.reduce(
    (acc, request) =>
      acc +
      (request.items?.reduce((itemAcc, item) => itemAcc + (item.totalPrice || 0), 0) || 0),
    0
  );

  return (
    <main className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {email}</h1>
          <p className="text-muted-foreground">
            Here's what's happening on{" "}
            <span className="bg-purple-600 px-4 rounded-full text-white">{roleName}</span> dashboard.
          </p>
        </div>

        <div className="flex items-stretch justify-around space-x-2">
          <Link href="/">
            <p className="py-2 px-4 rounded-full bg-green-300 cursor-pointer">Home</p>
          </Link>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="cursor-pointer flex rounded-full bg-red-300 hover:bg-red-400 py-2 px-4"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-400 font-bold">+2</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approved Requests</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-400 font-bold">+20</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Approved requests</p>
          </CardContent>
        </Card>
      </div>

      {/* Procurement Requests Table */}
      <section>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{roleName} Requests</CardTitle>
                <CardDescription>Your recent requests and their status</CardDescription>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request, index) => {
                    const requestTotalPrice =
                      request.items?.reduce((acc, item) => acc + (item.totalPrice || 0), 0) || 0;

                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{request.title}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{request.description}</TableCell>
                        <TableCell>${requestTotalPrice.toFixed(2)}</TableCell>
                        <TableCell>
                          <p className="px-4 py-2 bg-pink-300 w-fit rounded-full">{request.stage}</p>
                        </TableCell>
                        <TableCell>{request.items?.length || 0}</TableCell>
                        <TableCell>
                          {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <ProcurementViewDialog requestData={request} />
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
