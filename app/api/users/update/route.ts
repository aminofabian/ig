import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: Request) {
  try {
    // Get session with error handling
    let session;
    try {
      session = await auth();
    } catch (authError) {
      console.error('Authentication error:', authError);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }

    // Check if session exists and user is authenticated
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Check if user is an admin
    if (session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (jsonError) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { userId, role, subscriptionStatus } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Update user data
    const updateData: any = {};
    if (role) {
      updateData.role = role;
    }
    if (subscriptionStatus) {
      // First check if user has an existing subscription
      const existingSubscription = await prisma.subscription.findUnique({
        where: { userId }
      });

      if (existingSubscription) {
        // Update existing subscription
        updateData.subscription = {
          update: {
            status: subscriptionStatus
          }
        };
      } else {
        // Create new subscription
        updateData.subscription = {
          create: {
            status: subscriptionStatus,
            priceId: 'default', // You might want to adjust this based on your needs
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            features: {} // Add default features as needed
          }
        };
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: { subscription: true }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 