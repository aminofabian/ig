'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import SubscriptionRequiredModal from '@/components/modals/SubscriptionRequiredModal';

function SubscriptionCheck() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const subscriptionRequired = searchParams.get('subscription_required') === 'true';

  useEffect(() => {
    const checkSubscription = async () => {
      // Paths that should bypass subscription check
      const publicPaths = ['/login', '/register', '/auth', '/pricing'];
      
      // If current path is public, skip subscription check
      if (publicPaths.some(path => pathname.startsWith(path))) {
        return;
      }

      try {
        const response = await fetch('/api/subscription-check');
        if (!response.ok) throw new Error('Failed to check subscription');
        
        const data = await response.json();

        if (!data.hasActiveSubscription) {
          // Show modal instead of redirecting
          const currentUrl = new URL(window.location.href);
          currentUrl.searchParams.set('subscription_required', 'true');
          window.history.replaceState({}, '', currentUrl.toString());
        }
      } catch (error) {
        console.error('Subscription check failed:', error);
      }
    };

    checkSubscription();
  }, [pathname]);

  return <SubscriptionRequiredModal isOpen={subscriptionRequired} />;
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Suspense fallback={null}>
        <SubscriptionCheck />
      </Suspense>
    </>
  );
} 