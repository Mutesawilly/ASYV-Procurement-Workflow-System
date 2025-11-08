"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Eye, FileText } from "lucide-react"
import ProcurementViewForm from "@/components/order-preview/preview-form"

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const getStatusColor = (status) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800"
    case "APPROVED":
      return "bg-green-100 text-green-800"
    case "REJECTED":
      return "bg-red-100 text-red-800"
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-800"
    case "COMPLETED":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function ProcurementViewDialog({ requestData }) {
  const defaultTrigger = (
    <Button variant="outline">
      <Eye className="h-4 w-4 mr-2" />
      View Request
    </Button>
  )

  return (
    <Dialog>
      <DialogTrigger asChild>{triggerButton || defaultTrigger}</DialogTrigger>
      <DialogContent className="w-full max-h-screen overflow-y-auto lg:max-w-screen-lg scrollbar-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <FileText className="h-5 w-5" />
                Procurement Request Details
              </DialogTitle>
              <DialogDescription className="mt-1">
                Request ID: {requestData.requesterId} • Created {formatDate(requestData.createdAt)}
              </DialogDescription>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(requestData.status)}`}>
              {requestData.status}
            </div>
          </div>
        </DialogHeader>

          <ProcurementViewForm requestData={requestData} />
      </DialogContent>
    </Dialog>
  )
}
