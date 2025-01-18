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
      const protectedRoutes = ['/', '/dashboard', '/analytics', '/profile'];
      const isProtectedRoute = protectedRoutes.some(route => 
        pathname === route || pathname.startsWith(route + '/')
      );

      if (isProtectedRoute && pathname !== '/login') {
        const response = await fetch('/api/subscription-check');
        const data = await response.json();

        if (!data.hasActiveSubscription) {
          const params = new URLSearchParams();
          params.set('from', pathname);
          params.set('subscription_required', 'true');
          router.push(`/login?${params.toString()}`);
        }
      }
    };

    checkSubscription();
  }, [pathname, router]);

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