"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { CalendarDays, DollarSign, Package, User, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// Helper function to get status color
function getStatusColor(status) {
    switch (status) {
        case "APPROVED":
            return "bg-green-100 text-green-800 hover:bg-green-200"
        case "REJECTED":
            return "bg-red-100 text-red-800 hover:bg-red-200"
        case "PENDING":
            return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
        case "COMPLETED":
            return "bg-blue-100 text-blue-800 hover:bg-blue-200"
        case "CANCELLED":
            return "bg-gray-100 text-gray-800 hover:bg-gray-200"
        default:
            return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
}

// Helper function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount)
}

// Helper function to format date
function formatDate(date) {
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(date)
}

export default function OrdersPage() {
    // Empty state - no orders
    const orders = []
    const totalOrders = 1
    const pendingOrders = 1
    const approvedOrders = 0
    const totalValue = 1249.5

    return (
        <main>
            <section>
                <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto p-6 space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Procurement Orders</h1>
                        <p className="text-gray-600 mt-1">Manage and track all procurement requests</p>
                    </div>
                    <Link href="/protected/dashboard/orders/order-form">
                        <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
                            <Plus className="h-4 w-4 mr-2" />
                            New Order
                        </Button>
                    </Link>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
                            <Package className="h-5 w-5 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{totalOrders}</div>
                            <p className="text-xs text-gray-500 mt-1">All time</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
                            <CalendarDays className="h-5 w-5 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{pendingOrders}</div>
                            <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
                            <User className="h-5 w-5 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{approvedOrders}</div>
                            <p className="text-xs text-gray-500 mt-1">Ready to proceed</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Total Value</CardTitle>
                            <DollarSign className="h-5 w-5 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</div>
                            <p className="text-xs text-gray-500 mt-1">All orders combined</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Orders Table */}
                <Card className="border-0 shadow-sm">
                    <CardHeader className="border-b border-gray-100">
                        <CardTitle className="text-lg font-semibold text-gray-900">Recent Orders</CardTitle>
                        <p className="text-sm text-gray-600">A list of all procurement requests and their current status</p>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-gray-100">
                                        <TableHead className="font-semibold text-gray-700">Order ID</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Title</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Requester</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Items</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Total Value</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Status</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Created</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {/* Demo Row */}
                                    <TableRow className="border-gray-100 hover:bg-gray-50">
                                        <TableCell className="font-mono text-sm text-gray-600">#39439011</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">Office Supplies Q1 2024</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-sm text-gray-500">john.smith@company.com</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">3 items</span>
                                        </TableCell>
                                        <TableCell className="font-semibold text-gray-900">$1,249.50</TableCell>
                                        <TableCell>
                                            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200" variant="secondary">
                                                PENDING
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-500">Jan 15, 2024</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                            {/* Empty State */}
                            {/* <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                  Get started by creating your first procurement request. You can add items, set quantities, and submit
                  for approval.
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Order
                </Button>
              </div> */}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
            </section>
        </main>
        
    )
}
