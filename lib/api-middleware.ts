import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { checkSubscriptionAccess } from './subscription';

export async function withSubscriptionCheck(handler: Function) {
  return async (request: Request) => {
    try {
      const { hasAccess } = await checkSubscriptionAccess();
      
      // If subscription popups are disabled globally, allow access
      if (hasAccess) {
        return handler(request);
      }

      // Otherwise check user's subscription
      const session = await auth();
      if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Check if user has active subscription
      const response = await fetch('/api/subscription-check');
      if (!response.ok) {
        throw new Error('Failed to check subscription');
      }

      const { hasActiveSubscription } = await response.json();
      if (!hasActiveSubscription) {
        return NextResponse.json(
          { error: 'Subscription required' },
          { status: 403 }
        );
      }

      return handler(request);
    } catch (error) {
      console.error('API middleware error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}
