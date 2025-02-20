import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const settings = await prisma.systemSettings.findFirst();
    return NextResponse.json(settings || {});
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { disableSubscriptionPopup } = body;

    if (typeof disableSubscriptionPopup !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    try {
      // Try to update existing settings
      const settings = await prisma.systemSettings.update({
        where: { id: 'default' },
        data: { disableSubscriptionPopup }
      });
      return NextResponse.json(settings);
    } catch (error) {
      // If settings don't exist, create them
      const settings = await prisma.systemSettings.create({
        data: {
          id: 'default',
          disableSubscriptionPopup
        }
      });
      return NextResponse.json(settings);
    }
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
