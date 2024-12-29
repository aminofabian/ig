'use server';

import db from "@/lib/db";
import { auth } from "@/auth";

export async function updateSettingsAction(data: {
  firstName?: string;
  lastName?: string;
  email?: string;
  bio?: string;
}) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    const updatedUser = await db.user.update({
      where: {
        id: session.user.id
      },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        bio: data.bio,
      }
    });

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error('Error updating settings:', error);
    throw new Error('Failed to update settings');
  }
} 