"use client";

import { useState } from "react";
import { prisma } from "@/lib/prisma";
import {
    Calendar,
    Home,
    Inbox,
    Search,
    Settings,
    Users,
    BarChart3,
    ShoppingCart,
    Building2,
    GraduationCap,
    Heart,
    Briefcase,
    Utensils,
    Car,
} from "lucide-react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { addUserDepartment } from "@/app/actions/addUserDepart";
import { useRouter } from "next/navigation";

// Department items with different colors
const departments = [
    {
        title: "Administration",
        id: "administration",
        icon: Building2,
        color: "rounded-full text-blue-600 bg-blue-100",
    },
    {
        title: "School",
        id: "school",
        icon: GraduationCap,
        color: "rounded-full text-green-600 bg-green-100",
    },
    {
        title: "Clinic",
        id: "clinic",
        icon: Heart,
        color: "rounded-full text-red-600 bg-red-100",
    },
    {
        title: "Maintanance",
        id: "maintanance",
        icon: Briefcase,
        color: "rounded-full text-purple-600 bg-purple-100",
    },
    {
        title: "Kitchen",
        id: "kitchen",
        icon: Utensils,
        color: "rounded-full text-orange-600 bg-orange-100",
    },
    {
        title: "Logistics",
        id: "logistics",
        icon: Car,
        color: "rounded-full text-indigo-600 bg-indigo-100",
    },
];

const initialDepartment = { department: "Administration" }

export default function chooseDepartmentForm() {
    const [ submitted, setSubmitted ] = useState(false);
    const [ submittedData, setSubmittedData ] = useState(initialDepartment);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted", submittedData);
        await addUserDepartment(submittedData);
        // Hard redirect to dashboard
        // window.location.href = "/protected/dashboard/employee";
        router.push("/protected/dashboard/employee");
    };

    const handleChange = (e) => {
        try {
            const updatedData = {
                ...submittedData,
                department: e.target.value,
            };
            setSubmittedData(updatedData)
            // console.log("Value chosen", submittedData)
            // setSubmitted(true)

        } catch (error) {
            console.log("Error: ", error.message)
        }
    };

    if (!submitted) {
        return (
            <main>
                <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center p-4">
                    <Card className="w-full max-w-4xl border-0 shadow-lg">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl text-purple-900 font-bold">
                                Welcome back!
                            </CardTitle>
                            <CardDescription className="text-gray-600">
                                Please select your department to continue
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="flex flex-col items-stretch w-full justify-center space-y-6">
                            <form onSubmit={handleSubmit}>
                                <RadioGroup className="grid gap-4 grid-cols-3" onChange={handleChange}>
                                    {departments.map((dept, index) => (
                                        <div key={dept.id}>
                                            <RadioGroupItem
                                                value={dept.title}
                                                id={dept.id}
                                                className="peer hidden"
                                                onClick={handleChange}
                                            />
                                            <Label
                                                htmlFor={dept.id}
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-gray-200 bg-white p-4 hover:bg-purple-50 hover:border-purple-300 peer-data-[state=checked]:border-purple-600 [&:has([data-state=checked])]:border-purple-600 cursor-pointer transition-all"
                                            >
                                                <span className={`text-2xl mb-2 ${dept.color}`}>
                                                    <dept.icon />
                                                </span>
                                                <span className="font-medium">{dept.title}</span>
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </form>
                            <Button onClick={handleSubmit}>Submit</Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
        );
    }
}
