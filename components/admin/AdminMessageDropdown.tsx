"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/lib/stores/useNotifications";
import { User } from "@/types/admin";

export const AdminMessageDropdown = () => {
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();
  const { notifications, markAsRead } = useNotifications();
  const unreadMessages = notifications.filter(n => n.type === 'message' && !n.read);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/get-all-users');
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <MessageSquare className="h-5 w-5 text-zinc-400" />
          {unreadMessages.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#f059da] rounded-full flex items-center justify-center text-[10px] text-white">
              {unreadMessages.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-[#0a0a0a] border-zinc-800">
        <DropdownMenuLabel className="text-zinc-400">Select User to Message</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-800" />
        <div className="max-h-[300px] overflow-y-auto">
          {users.map((user) => (
            <DropdownMenuItem
              key={user.id}
              className="p-3 text-sm text-zinc-200 focus:bg-[#f059da]/10 focus:text-white cursor-pointer"
              onClick={() => router.push(`/admin/messages/${user.id}`)}
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[#f059da]/10" />
                <div>
                  <p className="font-medium">{user.name || user.email}</p>
                  {user.name && <p className="text-xs text-zinc-400">{user.email}</p>}
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 