// types.ts or enums.ts
export enum SubscriptionStatus {
  ACTIVE = 'active',
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  CANCELED = 'canceled',
  PAST_DUE = 'past_due',
  UNPAID = 'unpaid',
  TRIALING = 'trialing',
  PAUSED = 'paused',
}


export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  subscription: { status: string; type: 'Premium' | 'Basic';
  };
}