"use client";

import { UserButton } from "@/components/auth/UserButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Menu,
  Search,
  Bell,
  MessageSquare,
  Plus,
  Settings,
  LogOut
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";
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
import Link from "next/link";
import { useTransition } from "react";
import { logout } from "@/actions/logout";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isPending, startTransition] = useTransition();

  const handleLogout = async () => {
    startTransition(async () => {
      try {
        await logout();
      } catch (error) {
        console.error("Failed to logout:", error);
      }
    });
  };

  // Calculate unread messages count
  const unreadMessages = notifications.filter(
    n => n.type === 'message' && !n.read
  );

  return (
    <div className="fixed top-0 right-0 left-0 md:left-72 h-16 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#f059da]/10">
      <div className="flex items-center justify-between h-full px-4 gap-4 max-w-[2000px] mx-auto">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5 text-zinc-400" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 bg-[#0a0a0a]">
            <Sidebar />
          </SheetContent>
        </Sheet>
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search anything..."
              className="w-full pl-10 bg-zinc-900/50 border-zinc-800 focus:ring-[#f059da]/50 text-zinc-200 placeholder:text-zinc-500"
            />
          </div>
        </div>
        {/* Right Side Menu Items */}
        <div className="flex items-center gap-3">
          {/* New Button */}
          <Button
            size="sm"
            className="hidden md:flex bg-gradient-to-r from-[#f059da] to-[#f059da]/80 hover:to-[#f059da] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            <a href="/messages">New</a>
          </Button>
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-zinc-400" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#f059da] rounded-full flex items-center justify-center text-[10px] text-white">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-[#0a0a0a] border-zinc-800">
              <div className="flex items-center justify-between p-2">
                <DropdownMenuLabel className="text-zinc-400">Notifications</DropdownMenuLabel>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs text-zinc-400 hover:text-white"
                  >
                    Mark all as read
                  </Button>
                )}
              </div>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`p-3 text-sm ${
                        notification.read ? 'text-zinc-400' : 'text-zinc-200'
                      } focus:bg-[#f059da]/10 focus:text-white cursor-pointer`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex flex-col gap-1">
                        <p>{notification.content}</p>
                        <span className="text-xs text-zinc-500">
                          {new Date(notification.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="p-4 text-center text-zinc-500 text-sm">
                    No notifications
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Messages */}
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
              <div className="flex items-center justify-between p-2">
                <DropdownMenuLabel className="text-zinc-400">Messages</DropdownMenuLabel>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs text-zinc-400 hover:text-white"
                  >
                    Mark all as read
                  </Button>
                )}
              </div>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <div className="max-h-[300px] overflow-y-auto">
                {unreadMessages.length > 0 ? (
                  unreadMessages.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="p-3 text-sm text-zinc-200 focus:bg-[#f059da]/10 focus:text-white cursor-pointer"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between">
                          <span className="font-medium">
                            {notification.senderName || 'Unknown User'}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {new Date(notification.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-zinc-300">{notification.content}</p>
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="p-4 text-center text-zinc-500 text-sm">
                    No unread messages
                  </div>
                )}
              </div>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <div className="p-2">
                <Button
                  onClick={() => router.push('/messages')}
                  className="w-full bg-[#f059da]/10 hover:bg-[#f059da]/20 text-[#f059da]"
                >
                  View All Messages
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Settings */}
          <Button variant="ghost" size="icon">
            <Link href="/settings">            
            <Settings className="h-5 w-5 text-zinc-400" />
            </Link>
          </Button>
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <UserButton />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#0a0a0a] border-zinc-800">
              <DropdownMenuItem 
                onClick={handleLogout}
                disabled={isPending}
                className={cn(
                  "text-zinc-300 focus:bg-[#f059da]/10 focus:text-white cursor-pointer",
                  isPending && "opacity-50 cursor-not-allowed"
                )}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {isPending ? "Logging out..." : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;