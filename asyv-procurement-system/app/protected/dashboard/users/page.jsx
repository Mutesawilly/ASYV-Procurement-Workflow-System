import { currentUser } from "@clerk/nextjs/server";
import { DashboardHeader } from "@/components/users-header/users-header";

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

function formatDateToDayMonthYear(date) {
  const options = { day: "numeric", month: "long", year: "numeric" }
  return new Date(date).toLocaleDateString("en-US", options)
}

export default async function TableDemo() {
    const users = await prisma.User.findMany();

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
                            <TableCell>
                                <p className="font-medium">CreatedAt</p>
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => {
                            return(
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.firstName}</TableCell>
                                <TableCell>{user.lastName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <p className="bg-blue-300 rounded-full text-center py-1">
                                        Storekeeper
                                    </p>
                                </TableCell>
                                <TableCell>{formatDateToDayMonthYear(user.createdAt)}</TableCell>
                            </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </section>
        </main>
    );
}
