"use client";

// Imports for external dependencies like "next/link" and custom server actions
// are replaced with standard components/mock functions for compatibility.
// import Link from "next/link"; // Replaced with standard <a> tag
// import { useState, useEffect } from 'react';
// Assuming 'createClient' is a function that initializes and returns the Supabase client
// and 'prisma' is your initialized Prisma Client instance.
import { createClient } from "@/lib/supabase/client";
import { prisma } from "@/lib/prisma"; // Adjust this path as needed

import { Button } from "@/components/ui/button";
import addRequest from "@/app/actions/addRequest";
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
import { Plus, ArrowLeft, Trash2, Send, DollarSign } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";

const useSupabaseAuth = () => {
    const [authData, setAuthData] = useState({ supabaseUser: null });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const supabase = createClient();

        const fetchUserData = async () => {
            setIsLoading(true);
            setError(null);

            const {
                data: { user: supabaseUser },
                error: authError,
            } = await supabase.auth.getUser();

            if (authError) {
                console.error("Supabase Auth Error:", authError);
                setError(authError.message);
                setAuthData({ supabaseUser: null, dbProfile: null });
                setIsLoading(false);
                return;
            }

            setAuthData({ supabaseUser: supabaseUser });
            setIsLoading(false);
        };

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
                    fetchUserData();
                }
            }
        );

        fetchUserData();

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);

    return {
        user: authData.supabaseUser ?? null,
        isLoading,
    };
};
// ---------------------------------------------

const initialItem = {
    name: "",
    description: "",
    quantity: 1,
    unitPrice: 1.0,
    totalPrice: 1.0,
};

const initialValues = {
    title: "",
    description: "",
    items: [initialItem],
};

export default function ProcurementUI() {
    const [orderData, setOrderData] = useState(initialValues);
    const { user, isLoading } = useSupabaseAuth(); // Use 'profile' here
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    // ... (All handler functions: requestTotalPrice, handleChange, onItemChange, deleteItem, addNewItem)

    // Calculate total request price whenever items change
    const requestTotalPrice = orderData.items
        .reduce((acc, item) => {
            const quantity = parseFloat(item.quantity) || 0;
            const unitPrice = parseFloat(item.unitPrice) || 0;
            item.totalPrice = quantity * unitPrice;
            return acc + quantity * unitPrice;
        }, 0)
        .toFixed(2);

    const handleChange = (e) => {
        setOrderData({
            ...orderData,
            [e.target.name]: e.target.value,
        });
    };

    const onItemChange = (e, index) => {
        const value =
            e.target.name === "quantity" || e.target.name === "unitPrice"
                ? parseFloat(e.target.value) ||
                (e.target.name === "quantity" ? 1 : 0.01)
                : e.target.value;

        const updatedOrderItems = orderData.items.map((item, idx) => {
            if (idx === index) {
                const updatedItem = {
                    ...item,
                    [e.target.name]: value,
                };
                const quantity = parseFloat(updatedItem.quantity) || 0;
                const unitPrice = parseFloat(updatedItem.unitPrice) || 0;
                updatedItem.totalPrice = quantity * unitPrice;
                return updatedItem;
            }
            return item;
        });

        setOrderData({ ...orderData, items: updatedOrderItems });
    };

    const deleteItem = (index) => {
        if (orderData.items.length === 1) {
            setOrderData(initialValues);
            return;
        }
        const updatedOrderItems = orderData.items.filter(
            (item, idx) => index !== idx
        );
        setOrderData({ ...orderData, items: updatedOrderItems });
    };

    const addNewItem = () => {
        setOrderData({
            ...orderData,
            items: [initialItem, ...orderData.items],
        });
    };

    const submitForm = async () => {
        if (!user || !user.id || isLoading) {
            setSubmitStatus("error");
            console.error("User not authenticated or ID missing.");
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);

        const isValid =
            orderData.title.trim() !== "" &&
            orderData.items.every(
                (item) =>
                    item.name.trim() !== "" &&
                    parseFloat(item.quantity) > 0 &&
                    parseFloat(item.unitPrice) > 0
            );

        if (!isValid) {
            setSubmitStatus("error_validation");
            setIsSubmitting(false);
            return;
        }

        const finalData = {
            title: orderData.title,
            description: orderData.description,
            // requester: { connect: { id: user.id } },
            items: orderData.items.map((item) => ({
                ...item,
                quantity: parseFloat(item.quantity),
                unitPrice: parseFloat(item.unitPrice),
                totalPrice: parseFloat(item.totalPrice),
            })),
        };

        const { error } = await addRequest(finalData);

        if (error) {
            console.error("Request submission error:", error);
            setSubmitStatus("error");
        } else {
            setOrderData(initialValues);
            setSubmitStatus("success");
        }
        setIsSubmitting(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="p-8 bg-white rounded-lg shadow-xl">
                    <p className="text-xl font-medium text-blue-600">
                        Loading user session...
                    </p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="p-8 bg-white rounded-lg shadow-xl text-center">
                    <h2 className="text-2xl font-bold text-red-600">
                        Authentication Required
                    </h2>
                    <p className="mt-2 text-gray-600">
                        Please log in to submit a procurement request.
                    </p>
                    {/* Using standard <a> tag instead of <Link> */}
                    <a href="/login">
                        <Button className="mt-4 bg-blue-500 hover:bg-blue-600">
                            Go to Login
                        </Button>
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto p-6 max-w-4xl">
                {/* Form Header */}
                <div className="flex items-center mb-8 justify-between">
                    {/* Using standard <a> tag instead of <Link> */}
                    <a href="/protected/dashboard/employee">
                        <Button
                            variant="ghost"
                            className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition duration-150 shadow-md"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Requests
                        </Button>
                    </a>
                    <div className="text-right">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-800">
                            Procurement Request
                        </h1>
                        <main className="text-sm text-gray-500 mt-1">
                            Requester:{" "}
                            <Badge className="bg-blue-200 text-blue-800 hover:bg-blue-200">
                                {user.full_name || user.id}
                            </Badge>
                        </main>
                    </div>
                </div>

                {/* Status Messages */}
                {submitStatus === "success" && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg shadow-md transition-opacity duration-300">
                        <p className="font-medium">
                            Success! Your procurement request has been submitted.
                        </p>
                    </div>
                )}
                {submitStatus === "error" && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md transition-opacity duration-300">
                        <p className="font-medium">
                            Error submitting request. A network or database issue occurred.
                        </p>
                    </div>
                )}
                {submitStatus === "error_validation" && (
                    <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg shadow-md transition-opacity duration-300">
                        <p className="font-medium">
                            Please ensure the **Request Title** is filled and all **Items**
                            have a name, quantity (0$), and unit price (0$).
                        </p>
                    </div>
                )}

                <div className="space-y-8">
                    {/* Request Information */}
                    <Card className="shadow-lg rounded-xl">
                        <CardHeader>
                            <CardTitle>Request Information</CardTitle>
                            <CardDescription>
                                Provide basic details about your procurement request.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    placeholder="Enter request title (e.g., Office Hardware Upgrade)"
                                    name="title"
                                    value={orderData.title}
                                    onChange={handleChange}
                                    required
                                    className="focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Justification/Description *</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Provide detailed justification for this procurement request"
                                    rows={3}
                                    name="description"
                                    value={orderData.description}
                                    onChange={handleChange}
                                    required
                                    className="focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Procurement Items */}
                    <Card className="shadow-lg rounded-xl">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Procurement Items</CardTitle>
                                <CardDescription>
                                    Add items you need to procure with estimated quantities and
                                    pricing.
                                </CardDescription>
                            </div>
                            <Button
                                size="sm"
                                onClick={addNewItem}
                                className="bg-green-500 hover:bg-green-600 text-white transition duration-150 rounded-full shadow-md"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Item
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {orderData.items.map((item, index) => {
                                // Calculate total price locally for display
                                const displayTotalPrice = (
                                    parseFloat(item.quantity) * parseFloat(item.unitPrice)
                                ).toFixed(2);

                                return (
                                    <div
                                        className="space-y-4 p-4 border border-gray-200 rounded-xl bg-white shadow-sm transition duration-300 hover:border-blue-300"
                                        key={index}
                                    >
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold text-lg text-blue-700">
                                                Item {orderData.items.length - index}
                                            </h4>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => deleteItem(index)}
                                                disabled={orderData.items.length === 1}
                                                className="rounded-full"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor={`item-name-${index}`}>Item Name *</Label>
                                            <Input
                                                id={`item-name-${index}`}
                                                placeholder="e.g., Ergonomic Chair"
                                                name="name"
                                                value={item.name}
                                                onChange={(e) => onItemChange(e, index)}
                                                required
                                                className="focus:ring-blue-400 rounded-lg"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor={`item-quantity-${index}`}>
                                                    Quantity *
                                                </Label>
                                                <Input
                                                    id={`item-quantity-${index}`}
                                                    type="number"
                                                    min="1"
                                                    placeholder="1"
                                                    value={item.quantity}
                                                    name="quantity"
                                                    onChange={(e) => onItemChange(e, index)}
                                                    required
                                                    className="focus:ring-blue-400 rounded-lg"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor={`item-unit-price-${index}`}>
                                                    Unit Price (Est.) *
                                                </Label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        id={`item-unit-price-${index}`}
                                                        type="number"
                                                        step="0.01"
                                                        min="0.01"
                                                        placeholder="0.00"
                                                        className="pl-10 focus:ring-blue-400 rounded-lg"
                                                        // Ensure value is displayed with fixed precision
                                                        value={parseFloat(item.unitPrice).toFixed(2)}
                                                        name="unitPrice"
                                                        onChange={(e) => onItemChange(e, index)}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Total Price</Label>
                                                <div className="flex items-center h-10 px-3 py-2 border border-blue-200 bg-blue-50 text-blue-700 rounded-lg font-bold">
                                                    ${displayTotalPrice}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor={`item-description-${index}`}>
                                                Item Specifications/Details
                                            </Label>
                                            <Textarea
                                                id={`item-description-${index}`}
                                                placeholder="Provide brand, model number, link, or specific requirements"
                                                rows={2}
                                                value={item.description}
                                                name="description"
                                                onChange={(e) => onItemChange(e, index)}
                                                className="focus:ring-blue-400 rounded-lg"
                                            />
                                        </div>
                                    </div>
                                );
                            })}

                            <Separator className="my-6 bg-gray-300" />

                            <div className="flex justify-between items-center text-lg font-semibold bg-blue-100 p-4 rounded-xl border border-blue-300">
                                <span className="text-xl text-gray-700">
                                    Estimated Total Request Amount:
                                </span>
                                <span className="text-3xl font-extrabold text-blue-600">
                                    ${requestTotalPrice}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4">
                        <Button
                            className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white transition duration-150 shadow-xl rounded-full px-6 py-3"
                            onClick={submitForm}
                            // Disable if submitting, no user, or total price/title invalid
                            disabled={
                                isSubmitting ||
                                !user ||
                                parseFloat(requestTotalPrice) <= 0 ||
                                !orderData.title.trim()
                            }
                        >
                            {isSubmitting ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4 mr-2" />
                                    Submit Request
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
