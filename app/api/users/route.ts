import db from '@/lib/db';
import { auth } from '@/auth';
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  const session = await auth();
  
  if (!session || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const users = await db.user.findMany({
      include: {
        subscription: true
      }
    })
    return NextResponse.json(users)
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password, role } = await request.json();
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        emailVerified: new Date().toISOString(),
        subscription: {
          create: {
            status: 'INCOMPLETE',
            priceId: 'price_basic',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(),
            features: [],
            metadata: {}
          }
        }
      },
      include: {
        subscription: true
      }
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
} 