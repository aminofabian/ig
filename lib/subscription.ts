import { prisma } from '@/lib/prisma';

export async function checkSubscriptionAccess() {
  try {
    // Check system settings first
    const systemSettings = await prisma.systemSettings.findFirst();
    if (systemSettings?.disableSubscriptionPopup) {
      return { hasAccess: true };
    }

    return { hasAccess: false };
  } catch (error) {
    console.error('Error checking subscription access:', error);
    return { hasAccess: false };
  }
}
