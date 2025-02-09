"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { UserActions } from "./UserActions";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { User } from '@/types/admin';
import { UserRole } from '@prisma/client';
import { SubscriptionStatus } from '@prisma/client';
import { useState } from 'react';
import { Mail, MessageSquare, CreditCard } from "lucide-react";

interface UsersTableProps {
  users: User[];
  onEmailUser: (user: User) => void;
  onMessageUser: (user: User) => void;
  onManageSubscription: (user: User) => void;
  onUpdateRole: (userId: string, role: UserRole) => void;
  onUpdateSubscription: (userId: string, status: SubscriptionStatus) => void;
}

// Define available roles
const USER_ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  MODERATOR: 'MODERATOR'
} as const;

// Define available subscription statuses
const SUBSCRIPTION_STATUSES = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  CANCELLED: 'CANCELLED',
  INCOMPLETE: 'INCOMPLETE'
} as const;

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  onEmailUser,
  onMessageUser,
  onManageSubscription,
  onUpdateRole,
  onUpdateSubscription,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    await onUpdateRole(userId, newRole);
  };

  const handleSubscriptionChange = async (userId: string, newStatus: SubscriptionStatus) => {
    try {
      await onUpdateSubscription(userId, newStatus);
      // Optionally add a toast notification or other feedback
    } catch (error) {
      console.error('Error updating subscription:', error);
      // Handle error (e.g., show error toast)
    }
  };

  const filteredUsers = users
    .filter(user => {
      const searchLower = searchTerm.toLowerCase();
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      return (
        fullName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.role.toLowerCase().includes(searchLower) ||
        (user.subscription?.status || '').toLowerCase().includes(searchLower)
      );
    })
    .map(user => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown',
      email: user.email || '',
      role: user.role,
      status: user.subscription?.status || 'INACTIVE',
      subscription: {
        status: user.subscription?.status || 'INACTIVE',
        type: (user.subscription?.priceId?.includes('premium') ? 'Premium' : 'Basic') as 'Premium' | 'Basic',
        priceId: user.subscription?.priceId || 'price_basic'
      }
    }));

  return (
    <Card className="p-6 bg-black/40 border-white/20 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-white">User Management</h2>
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 h-10 pl-9 pr-4 rounded-lg bg-black/40 border border-white/20 focus:border-[#f059da] focus:ring-[#f059da]/10 transition-all text-white placeholder:text-white/50"
            />
          </div>
          <Button className="bg-[#f059da] hover:bg-[#f059da]/90">
            Search User
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-50">User</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-50">Role</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-50">Status</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-50">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#f059da]/10" />
                    <div>
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-white/70">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Select
                    value={user.role}
                    onValueChange={(value: UserRole) => handleRoleChange(user.id, value)}
                  >
                    <SelectTrigger className="w-32 bg-black/40 border-white/20 text-white">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/20">
                      {Object.values(USER_ROLES).map((role) => (
                        <SelectItem 
                          key={role} 
                          value={role}
                          className="text-white hover:bg-[#f059da]/10 focus:bg-[#f059da]/10 focus:text-white"
                        >
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="py-3 px-4">
                  <Select
                    value={user.status}
                    onValueChange={(value: SubscriptionStatus) => handleSubscriptionChange(user.id, value)}
                  >
                    <SelectTrigger className="w-32 bg-black/40 border-white/20 text-white">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/20">
                      {Object.values(SUBSCRIPTION_STATUSES).map((status) => (
                        <SelectItem 
                          key={status} 
                          value={status}
                          className={`text-white hover:bg-[#f059da]/10 focus:bg-[#f059da]/10 focus:text-white ${
                            status === 'ACTIVE' ? 'text-green-400' :
                            status === 'INACTIVE' ? 'text-red-400' :
                            'text-yellow-400'
                          }`}
                        >
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEmailUser(user)}
                      className="p-1.5 rounded-lg hover:bg-[#f059da]/10 text-white/80 hover:text-[#f059da] transition-all"
                      title="Send Email"
                    >
                      <Mail className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onMessageUser(user)}
                      className="p-1.5 rounded-lg hover:bg-[#f059da]/10 text-white/80 hover:text-[#f059da] transition-all"
                      title="Send Message"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onManageSubscription(user)}
                      className="p-1.5 rounded-lg hover:bg-[#f059da]/10 text-white/80 hover:text-[#f059da] transition-all"
                      title="Manage Subscription"
                    >
                      <CreditCard className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}