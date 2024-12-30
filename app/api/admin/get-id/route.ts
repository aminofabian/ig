import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const admin = await db.user.findFirst({
      where: {
        role: "ADMIN",
      },
      select: {
        id: true,
      },
    });

    if (!admin) {
      return new NextResponse("Admin not found", { status: 404 });
    }

    return NextResponse.json({ adminId: admin.id });
  } catch (error) {
    console.error("[ADMIN_GET_ID]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 