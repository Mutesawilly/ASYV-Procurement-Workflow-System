"use client"

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Plus,
    ArrowLeft,
    Trash2,
    Eye,
    Edit,
    Send,
    DollarSign,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import addRequest from "@/app/actions/addRequest";


// model ProcurementItem {
//   id                  String   @id @default(auto()) @map("_id") @db.ObjectId
//   procurementRequest  ProcurementRequest @relation(fields: [procurementRequestId], references: [id])
//   procurementRequestId String   @db.ObjectId
//   name                String
//   description         String?
//   quantity            Int
//   unitPrice           Float
//   totalPrice          Float
//   status              ItemStatus @default(PENDING)
// }

const initialItem = {
    name: "",
    description: "",
    quantity: 1,
    unitPrice: 1,
    totalPrice: 1
}

const initialValues = {
    title: "",
    description: "",
    items: [
        initialItem
    ]
}

export default function ProcurementUI() {
    const [orderData, setOrderData] = useState(initialValues)
    const { user } = useUser();


    // const sendRequest = async () => {
    //     try {
    //         await prisma.ProcurementRequest.create({
    //             title: orderData.title,
    //             description: orderData.description,
    //             requesterId: user?.id,
    //             requester: user?.fullName,
    //             items: orderData.items,
    //         })
    //         return
    //     } catch (err) {
    //         console.log("Error: ", err.message)
    //     }
    // }

    const handleChange = (e) => {
        // setOrderData({
        //     ...orderData,
        //     [e.target.name]: e.target.value
        // })
        // console.log(
        //     "name:", e.target.name
        // )
        // console.log(
        //     "value:", e.target.value
        // )
        // console.log(
        //     "current state", orderData
        // )
        const updatedState = {
            ...orderData,
            [e.target.name]: e.target.value
        }
        // console.log("updated state", updatedState)
        setOrderData(updatedState)

    }

    const onItemChange = (e, index) => {
        const currentItem = orderData.items[index]
        // console.log("editing item", currentItem)

        // console.log(
        //     "name:", e.target.name
        // )
        // console.log(
        //     "value:", e.target.value
        // )

        const updatedItem = {
            ...currentItem,
            [e.target.name]: e.target.value
        }

        // console.log(
        //     "updated item", updatedItem
        // )

        const updatedOrderItems = orderData.items.map((item, idx) => idx === index ? updatedItem : item)
        // console.log("updated order items", updatedOrderItems)
        setOrderData({
            ...orderData,
            items: updatedOrderItems
        })
    }

    const deleteItem = (index) => {
        const updatedOrderItems = orderData.items.filter((item, idx) => index !== idx)
        setOrderData({
            ...orderData,
            items: updatedOrderItems
        })
    }

    const addNewItem = () => {
        const updatedOrderItems = [
            
            initialItem,
            ...orderData.items,
        ]
        setOrderData({
            ...orderData,
            items: updatedOrderItems
        })
    }

    const submitForm = async () => {

        const finalData = {
            title: orderData.title,
            description: orderData.description,
            requesterId: user.id,
            // requester: user.id,
            items: orderData.items,
        }
        // console.log(finalData)
        const { data, error } = await addRequest(finalData)

        if (error) {
            console.log(error);
        } else {
            console.log('Request added', data);
            setOrderData(initialValues)
        }
    };
    const requestTotalPrice = 0.00;
    // console.log(orderData)
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto p-6 max-w-4xl">
                {/* Form Header */}
                <div className="flex items-center mb-8 justify-between">
                    <Button
                        variant="ghost"
                        className="py-2 px-4 bg-blue-300 rounded-full"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        <Link href="/protected/dashboard/employee">Back to Requests</Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Procurement Request
                        </h1>
                        {/* <p className="text-gray-600 mt-2">
                            Create a new procurement request with detailed item specifications
                        </p> */}
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Request Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Request Information</CardTitle>
                            <CardDescription>
                                Provide basic details about your procurement request
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input id="title" placeholder="Enter request title" name="title" value={orderData.title} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Provide additional details about this procurement request"
                                    rows={3}
                                    name="description"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Procurement Items</CardTitle>
                                <CardDescription>
                                    Add items you need to procure with quantities and pricing
                                </CardDescription>
                            </div>
                            <Button size="sm" onClick={addNewItem}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Item
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Item 1 */}
                            {orderData.items.map((item, index) => {
                                return (
                                    <div className="space-y-4 p-4 border rounded-lg" key={index}>
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium">Item {orderData.items.length - index}</h4>
                                            <Button variant="outline" size="sm" onClick={() => deleteItem(index)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor={`item-name-${index}`}>Item Name *</Label>
                                                <Input id={`item-name-${index}`} placeholder="Enter item name" name="name" value={item.name} onChange={(e) => onItemChange(e, index)} required />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor={`item-quantity-${index}`}>Quantity *</Label>
                                                <Input
                                                    id={`item-quantity-${index}`}
                                                    type="number"
                                                    min="1"
                                                    placeholder="1"
                                                    value={item.quantity}
                                                    name="quantity"
                                                    onChange={(e) => onItemChange(e, index)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor={`item-description-${index}`}>Description</Label>
                                            <Textarea
                                                id={`item-description-${index}`}
                                                placeholder="Provide item specifications or additional details"
                                                rows={2}
                                                value={item.description}
                                                name="description"
                                                onChange={(e) => onItemChange(e, index)}
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor={`item-unit-price-${index}`}>Unit Price *</Label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        id={`item-unit-price-${index}`}
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="0.00"
                                                        className="pl-10"
                                                        value={item.unitPrice}
                                                        name="unitPrice"
                                                        onChange={(e) => onItemChange(e, index)}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Quantity</Label>
                                                <div className="flex items-center h-10 px-3 py-2 border border-input bg-muted rounded-md">
                                                    {item.quantity}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Total Price</Label>
                                                <div className="flex items-center h-10 px-3 py-2 border border-input bg-muted rounded-md font-medium">
                                                    {item.totalPrice = (item.quantity * item.unitPrice)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}

                            <Separator />

                            <div className="flex justify-between items-center text-lg font-semibold">
                                <span>Total Request Amount:</span>
                                <span className="text-2xl">
                                    {orderData.items.reduce((acc, item) => acc + item.totalPrice, 0)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4">
                        <Button variant="outline">Save as Draft</Button>
                        <Button className="cursor-pointer" onClick={submitForm}>Submit Request</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
