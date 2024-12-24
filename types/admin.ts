// types/admin.ts
import type { UserRole } from '@prisma/client';
import { SubscriptionStatus } from '@prisma/client';

// Export both the enum and its type
export { SubscriptionStatus };
export type { UserRole };

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: string;
  subscription: {
    status: SubscriptionStatus;
    type: string;
  };
}

export interface UsersTableProps {
  users: User[];
  onEmailUser: (user: User) => void;
  onMessageUser: (user: User) => void;
  onManageSubscription: (user: User) => void;
  onUpdateRole: (userId: string, role: UserRole) => Promise<void>;
  onUpdateSubscription: (userId: string, subscriptionStatus: SubscriptionStatus) => Promise<void>;
}
