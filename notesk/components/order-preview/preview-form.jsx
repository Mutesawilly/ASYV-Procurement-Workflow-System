"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTrigger,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import {
  Printer,
  Download,
  ArrowLeft,
  Eye,
  Edit,
  DollarSign,
  Calendar,
  User,
  FileText,
  Package,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { approveRequest } from "@/app/actions/approveRequest";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const getStatusColor = (status) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "APPROVED":
      return "bg-green-100 text-green-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-800";
    case "COMPLETED":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function ProcurementViewForm({ userData, requestData }) {

  // --- START FIX FOR STRINGIFIED ITEMS/NULL ---
  const [items, setItems] = useState([]);

  useEffect(() => {
    let parsedItems = [];
    if (requestData?.items) {
      if (Array.isArray(requestData.items)) {
        // It's already an array (correct format)
        parsedItems = requestData.items;
      } else if (typeof requestData.items === 'string') {
        // It's a string (e.g., "null", "[]", or a JSON string)
        try {
          const jsonParsed = JSON.parse(requestData.items);
          if (Array.isArray(jsonParsed)) {
            parsedItems = jsonParsed;
          }
        } catch (e) {
          // console.error("Could not parse requestData.items string:", e);
          parsedItems = [];
        }
      }
    }
    setItems(parsedItems);
  }, [requestData.items]);

  const totalAmount = items.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

  // --- END FIX FOR STRINGIFIED ITEMS/NULL ---

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8 justify-between">
          <div className="text-left">
            <h1 className="text-3xl font-bold tracking-tight">
              Procurement Request Details
            </h1>
            <p className="text-gray-600 mt-2">Requester: {userData.email}</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Request Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Request Overview
                  </CardTitle>
                  <CardDescription>
                    Basic information about this procurement request
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(requestData.status)}>
                  {requestData.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-500 mb-1">
                      Title
                    </h4>
                    <p className="text-lg font-semibold">{requestData.title}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-500 mb-1">
                      Description
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {requestData.description}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <h4 className="font-medium text-sm text-gray-500">
                        Requested by
                      </h4>
                      <p className="font-medium">{userData.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <h4 className="font-medium text-sm text-gray-500">
                        Created on
                      </h4>
                      <p className="font-medium">
                        {formatDate(requestData.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <div>
                      <h4 className="font-medium text-sm text-gray-500">
                        Total Amount
                      </h4>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(totalAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Procurement Items ({items.length})
              </CardTitle>
              <CardDescription>
                Detailed breakdown of all requested items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Item Details</TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.length > 0 ? (
                      items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-500 leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-center font-medium">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(item.unitPrice)}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(item.totalPrice)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500">
                          No items found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <Separator className="my-6" />

              {/* Total Summary */}
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Total Items: {items.length}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">
                    Total Request Amount
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {formatCurrency(totalAmount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Print Request
              </Button>
              <Button variant="outline">Export PDF</Button>
            </div>
            <div className="flex space-x-3">
              {(userData && requestData.stage === "STA_EMPLOYEE") ? (
                <>
                  <Link
                    href={`/protected/dashboard/employee/order-form/${requestData.id}`}
                  >
                    <Button variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Request
                    </Button>
                  </Link>
                  <Button
                    className={
                      "cursor-pointer hover:bg-gray-600 active:bg-green-900 duration-500 ease-in-out"
                    }
                    onClick={async () => approveRequest(requestData)}
                  >
                    Approve Request
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className={
                      "cursor-pointer hover:bg-gray-600 active:bg-green-900 duration-500 ease-in-out"
                    }
                    onClick={async () => approveRequest(requestData)}
                  >
                    Approve Request
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}