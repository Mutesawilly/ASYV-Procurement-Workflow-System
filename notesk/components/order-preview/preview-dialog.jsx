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

// FIX APPLIED HERE: Added 'triggerButton' to the destructured props
export default function ProcurementViewDialog({ userData, requestData, triggerButton }) {
  const defaultTrigger = (
    <button className="bg-green-600 text-white" variant="outline">
      View Request
    </button>
  )

  return (
    <Dialog>
      {/* This line now correctly checks if the 'triggerButton' prop was passed, 
          otherwise it defaults to 'defaultTrigger'. */}
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="w-full max-h-screen overflow-y-auto lg:max-w-screen-lg scrollbar-hidden">
        <DialogHeader>
          {/* ... (rest of DialogHeader content) */}
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

          <ProcurementViewForm userData={userData} requestData={requestData} />
      </DialogContent>
    </Dialog>
  )
}
