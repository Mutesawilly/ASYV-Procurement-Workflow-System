"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const departments = [
  { id: "IT", name: "Information Technology", description: "Handles all IT-related procurement and support." },
  { id: "HR", name: "Human Resources", description: "Manages employee relations and administrative needs." },
  { id: "FINANCE", name: "Finance", description: "Oversees financial operations and budgeting." },
  { id: "MARKETING", name: "Marketing", description: "Drives promotional activities and brand management." },
  { id: "OPERATIONS", name: "Operations", description: "Manages day-to-day business operations." },
  { id: "SALES", name: "Sales", description: "Handles sales and customer acquisition." },
];

export default function DepartmentSelection() {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSelectDepartment = async () => {
    if (!selectedDepartment) return;

    setLoading(true);
    try {
      const response = await fetch("/api/update-department", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ department: selectedDepartment }),
      });

      if (response.ok) {
        router.push("/protected/dashboard/employee");
      } else {
        alert("Failed to update department. Please try again.");
      }
    } catch (error) {
      console.error("Error updating department:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Your Department</h1>
        <p className="text-gray-600">Please choose the department you belong to before accessing the dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <Card
            key={dept.id}
            className={`cursor-pointer transition-all ${
              selectedDepartment === dept.id
                ? "ring-2 ring-blue-500 bg-blue-50"
                : "hover:shadow-lg"
            }`}
            onClick={() => setSelectedDepartment(dept.id)}
          >
            <CardHeader>
              <CardTitle className="text-lg">{dept.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{dept.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-8">
        <Button
          onClick={handleSelectDepartment}
          disabled={!selectedDepartment || loading}
          className="px-8 py-2"
        >
          {loading ? "Updating..." : "Confirm Selection"}
        </Button>
      </div>
    </div>
  );
}
