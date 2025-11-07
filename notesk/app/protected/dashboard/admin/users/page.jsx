// --- Supabase Server Component Imports (for session context) ---
// Replaced: import { currentUser } from "@clerk/nextjs/server";
import createClient from "@/lib/supabase/client";
import { cookies } from "next/headers";
// ---------------------------------------------------------------

import { DashboardHeader } from "@/components/users-header/users-header";
import RoleDropdown from "@/components/users-roles/RoleDropdown";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useSWR, { mutate } from "swr";
import { ViewIcon } from "lucide-react";


function formatDateToDayMonthYear(date) {
    const options = { day: "numeric", month: "long", year: "numeric" }
    return new Date(date).toLocaleDateString("en-US", options)
}

// Updated to use 'userId' (Supabase UID) instead of 'clerkId'
const onRoleChange = async (userId, newRole) => { 
    "use server"
    try {
    // checking for the user to update the role
    // Now querying by 'id', which should hold the Supabase UID
    const user = await prisma.User.update({
        where: { id: userId }, 
        data: {
            role: newRole
        }
    })

    return user;

} catch (error){
    console.log(error.message)
    return null;

}}

export default async function TableDemo() {
    // Initialization for Supabase context in case we need the current user later,
    // though not strictly required for this component's current logic.
    const cookieStore = cookies();
    const supabase = createClient({ cookies: () => cookieStore });
    // const { data: { user: authUser } } = await supabase.auth.getUser();


    let users = await prisma.profile.findMany();
    const allRoles = ["EMPLOYEE", "STOREKEEPER", "DEPARTMENT_HEAD", "LOGISTICS_OFFICER", "INVENTORY_ASSET_MANAGER", "FINANCE_OFFICER", "SUPPLIER", "ADMIN"]

    return (
        <main>
            <DashboardHeader></DashboardHeader>
            <section className="py-4 px-2 bg-gray-50">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell>
                                <p className="font-medium">ID</p>
                            </TableCell>
                            <TableCell>
                                <p className="font-medium">FirstName</p>
                            </TableCell>
                            <TableCell>
                                <p className="font-medium">LastName</p>
                            </TableCell>
                            <TableCell>
                                <p className="font-medium">EmailAddress</p>
                            </TableCell>
                            <TableCell>
                                <p className="font-medium">Role</p>
                            </TableCell>
                            <TableCell className="font-medium">Department</TableCell>
                            <TableCell>
                                <p className="font-medium">CreatedAt</p>
                            </TableCell>
                            <TableCell>
                                <p className="font-medium">Actions</p>
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => {
                            return (
                                <TableRow key={user.id}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.firstName}</TableCell>
                                    <TableCell>{user.lastName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        {/* Roles Drop-Down */}
                                    <RoleDropdown handleClick={ async (role) => {
                                        "use server"
                                        // Changed from user.clerkId to user.id
                                        onRoleChange(user.id, role)
                                    }} currentRole={user.role} allRoles={allRoles} />
                                    </TableCell>
                                    <TableCell>{user.department}</TableCell>
                                    <TableCell>{formatDateToDayMonthYear(user.createdAt)}</TableCell>
                                    <TableCell>
                                        <ViewIcon />
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </section>
        </main>
    );
}
