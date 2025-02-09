import { UserRole, SubscriptionStatus } from '@prisma/client';

export interface Subscription {
  status: SubscriptionStatus;
  type: 'Premium' | 'Basic';
  priceId: string;
}

export interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  name: string;
  email: string;
  role: UserRole;
  status: string;
  subscription: Subscription;
}

// Re-export Prisma's SubscriptionStatus
export { SubscriptionStatus } from '@prisma/client';