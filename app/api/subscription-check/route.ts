import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Check system settings first
    const systemSettings = await prisma.systemSettings.findFirst();
    if (systemSettings?.disableSubscriptionPopup) {
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