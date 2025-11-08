import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, title, items } = body;

    if (!id || !title || !items || items.length === 0) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const updatedRequest = await prisma.procurementRequest.update({
      where: { id: body.id },
      data: {
        title: body.title,
        description: body.description,
        items:
          body.items.map((i) => ({
            name: i.name,
            description: i.description,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            totalPrice: i.totalPrice,
          })),
      },
      include: {
        ProcurementItems: true,       // <-- works only if `items` is a relation
        requester: true,   // <-- also must be a relation
      },
    });


    return NextResponse.json({ success: true, data: updatedRequest });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
