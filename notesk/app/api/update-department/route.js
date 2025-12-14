import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { department } = await request.json();

    if (!department) {
      return NextResponse.json({ error: "Department is required" }, { status: 400 });
    }

    // Update the user's department in the database
    const updatedProfile = await prisma.profile.update({
      where: { email: user.email },
      data: { department },
    });

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error("Error updating department:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
