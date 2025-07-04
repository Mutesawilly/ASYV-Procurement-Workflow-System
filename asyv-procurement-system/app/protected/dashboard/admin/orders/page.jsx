import { currentUser } from "@clerk/nextjs/server";
import { DashboardHeader } from "@/components/ui/dashboard/orders-dashboard-header";
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
import { SendToBack, ViewIcon } from "lucide-react";
import ProcurementViewDialog from "@/components/order-preview/preview-dialog";
import { View } from "lucide-react";


function formatDateToDayMonthYear(date) {
    const options = { day: "numeric", month: "long", year: "numeric" }
    return new Date(date).toLocaleDateString("en-US", options)
}

const onRoleChange = async (clerkId, newRole) => {
    "use server"
    try {
        // checking for the user to update the role
        const user = await prisma.User.update({
            where: { clerkId },
            data: {
                role: newRole
            }
        })

        return user;

    } catch (error) {
        console.log(error.message)
        return null;

    }
}

export default async function Orders() {
    const procurementsRequests = await prisma.ProcurementRequest.findMany();
    const triggerBtn = (
        <Button variant="outline" className={"px-4 py-2 rounded-full bg-gray-400"}>
            View Request
        </Button>
    )

    return (
        <main>
            <DashboardHeader></DashboardHeader>
            <section className="py-4 px-2 bg-gray-50 h-full overflow-y-auto scrollbar-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell>
                                <p className="font-medium">Title</p>
                            </TableCell>
                            <TableCell>
                                <p className="font-medium">Description</p>
                            </TableCell>
                            <TableCell>
                                <p className="font-medium">Status</p>
                            </TableCell>
                            <TableCell>
                                <p className="font-medium">No Items</p>
                            </TableCell>
                            <TableCell>
                                <p className="font-medium">CreatedAt</p>
                            </TableCell>
                            <TableCell>
                                <p className="font-medium">Actions</p>
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            procurementsRequests.map((request, index) => (
                                <TableRow key={index}>
                                    <TableCell>{request.title}</TableCell>
                                    <TableCell>{request.description}</TableCell>
                                    <TableCell><p className="px-4 rounded-full bg-violet-300 w-fit">{request.status}</p></TableCell>
                                    <TableCell>{request.items.length}</TableCell>
                                    <TableCell>{request.createdAt.toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <ProcurementViewDialog triggerButton={triggerBtn} requestData={request} />
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </section>
        </main>
    );
}
