import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ hasActiveSubscription: false });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { subscription: true },
    });

    const hasActiveSubscription = user?.subscription?.status === 'ACTIVE';

    return NextResponse.json({ hasActiveSubscription });
  } catch (error) {
    return NextResponse.json({ hasActiveSubscription: false });
  }
} 