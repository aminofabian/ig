import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { checkSubscriptionAccess } from "@/lib/subscription";

export async function GET() {
  try {
    // Check global subscription access first
    const { hasAccess } = await checkSubscriptionAccess();
    if (hasAccess) {
      return NextResponse.json({ hasActiveSubscription: true });
    }

    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ hasActiveSubscription: false });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        subscription: true
      }
    });

    const hasActiveSubscription = user?.subscription?.status === 'ACTIVE';

    return NextResponse.json({ hasActiveSubscription });
  } catch (error) {
    console.error('Subscription check error:', error);
    return NextResponse.json({ hasActiveSubscription: false });
  }
}