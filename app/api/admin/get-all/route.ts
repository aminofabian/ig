import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const admins = await db.user.findMany({
      where: {
        role: "ADMIN",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    return NextResponse.json({ admins });
  } catch (error) {
    console.error("[ADMINS_GET_ALL]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 