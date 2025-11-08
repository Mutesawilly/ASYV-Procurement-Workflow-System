import { prisma } from "@/lib/prisma";
import EditRequestForm from "@/components/procurement/EditRequestForm";

export default async function EditRequestPage({ params }) {
  const request = await prisma.ProcurementRequest.findUnique({
    where: { id: params.id },
    // include: { items: true }, // fetch items as well
  });

  if (!request) {
    return <p className="text-red-500">Request not found.</p>;
  }

  return <EditRequestForm request={request} />;
}
