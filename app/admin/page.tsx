'use client';

import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { 
  Users, BarChart3, Settings, FileText, Bell, 
  Shield, Search, Filter, Download, Upload, 
  Mail, MessageSquare, X, Ban 
} from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  status: string;
  subscription: {
    status: string;
    type: string;
  };
}

const demoUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
    subscription: {
      status: 'active',
      type: 'Premium'
    }
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    status: "Active",
    subscription: {
      status: 'active',
      type: 'Basic'
    }
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "User",
    status: "Inactive",
    subscription: {
      status: 'cancelled',
      type: 'Basic'
    }
  }
];

const AdminPage = () => {
  const [users, setUsers] = useState<User[]>(demoUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [emailContent, setEmailContent] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  
  const { data: session, status } = useSession();
  
  useEffect(() => {
    // Redirect if not admin
    if (status === "unauthenticated" || (session?.user && session.user.role !== "ADMIN")) {
      redirect("/unauthorized");
    }
  }, [session, status]);
  
  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#f059da]"></div>
      </div>
    );
  }
  
  const handleSendEmail = async () => {
    if (!selectedUser) return;
    // TODO: Implement email sending functionality
    console.log("Sending email to:", selectedUser.email, emailContent);
    setEmailContent("");
    setIsEmailModalOpen(false);
  };
  
  const handleSendMessage = async () => {
    if (!selectedUser) return;
    // TODO: Implement message sending functionality
    console.log("Sending message to:", selectedUser.email, messageContent);
    setMessageContent("");
    setIsMessageModalOpen(false);
  };
  
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-black text-white">
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
    {/* Enhanced Header with better gradient and glow effect */}
    <div className="flex flex-col gap-4 bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 p-6 md:p-8 rounded-xl border border-zinc-800/50 relative overflow-hidden shadow-2xl backdrop-blur-sm">
    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 animate-gradient-x" />
    <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 to-transparent" />
    
    {/* Header content with improved typography */}
    <div className="relative">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <div>
    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
    Admin Dashboard
    </h1>
    <p className="text-zinc-400 mt-2 text-sm md:text-base">
    Manage your application settings and monitor performance.
    </p>
    </div>
    
    {/* Enhanced buttons with better hover effects */}
    <div className="flex flex-wrap gap-3">
    <Button className="bg-zinc-800/50 hover:bg-zinc-700/50 text-white border border-zinc-700/50 shadow-lg hover:shadow-purple-500/20 transition-all duration-300 backdrop-blur-sm">
    <Download className="h-4 w-4 mr-2" />
    Export Data
    </Button>
    <Button className="bg-purple-600/80 hover:bg-purple-500 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
    <Upload className="h-4 w-4 mr-2" />
    Import Data
    </Button>
    </div>
    </div>
    </div>
    </div>
    
    {/* Enhanced Tabs with glass effect */}
    <Tabs defaultValue="overview" className="space-y-6">
    <TabsList className="bg-zinc-900/50 border border-zinc-800/50 p-1 rounded-lg shadow-lg overflow-x-auto flex whitespace-nowrap backdrop-blur-sm">
    <TabsTrigger value="overview" className="px-4 py-2 rounded-md data-[state=active]:bg-purple-600/80 data-[state=active]:text-white transition-all duration-300">
    <BarChart3 className="h-4 w-4 mr-2" />
    Overview
    </TabsTrigger>
    {/* ... other tab triggers with same styling ... */}
    </TabsList>
    
    <TabsContent value="overview">
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {/* Enhanced Stats Cards */}
    <Card className="p-6 bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800/50 shadow-lg hover:shadow-purple-500/10 transition-all duration-300 backdrop-blur-sm">
    <div className="flex items-start justify-between">
    <div>
    <h3 className="text-lg font-semibold mb-2 text-white">Total Users</h3>
    <p className="text-3xl font-bold text-purple-400">1,234</p>
    <p className="text-sm text-zinc-400 mt-1">
    <span className="text-emerald-400">↑ 12%</span> from last month
    </p>
    </div>
    <div className="p-3 bg-purple-500/10 rounded-lg">
    <Users className="h-6 w-6 text-purple-400" />
    </div>
    </div>
    </Card>
    {/* ... other stat cards ... */}
    </div>
    
    {/* Enhanced Activity Card */}
    <Card className="mt-6 p-6 bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800 shadow-lg">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
    <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
    <div className="flex flex-wrap gap-3">
    <div className="relative flex-1 md:flex-none">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
    <input 
    type="text" 
    placeholder="Search activities..." 
    className="w-full md:w-64 h-10 pl-9 pr-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-white placeholder-zinc-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 backdrop-blur-sm"
    />
    </div>
    <Button className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700">
    <Filter className="h-4 w-4 mr-2" />
    Filter
    </Button>
    </div>
    </div>
    
    {/* Activity Items */}
    <div className="space-y-4">
    {[1, 2, 3].map((item) => (
      <div key={item} className="flex items-center gap-4 p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-800 transition-all duration-200">
      <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
      <Users className="h-5 w-5 text-purple-400" />
      </div>
      <div>
      <h4 className="text-sm font-medium text-white">New user registered</h4>
      <p className="text-xs text-zinc-400">John Doe created a new account</p>
      </div>
      <span className="ml-auto text-xs text-zinc-500">2 min ago</span>
      </div>
    ))}
    </div>
    </Card>
    </TabsContent>
    
    {/* Users Tab Content */}
    <TabsContent value="users">
    <Card className="p-6 bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800 shadow-lg">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
    <h2 className="text-2xl font-bold text-white">User Management</h2>
    <div className="flex flex-wrap gap-3">
    <div className="relative flex-1 md:flex-none">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
    <input 
    type="text" 
    placeholder="Search users..." 
    className="w-full md:w-64 h-10 pl-9 pr-4 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
    />
    </div>
    <Button className="bg-purple-600 hover:bg-purple-500 text-white shadow-lg">
    Add User
    </Button>
    </div>
    </div>
    
    {/* Enhanced Table */}
    <div className="overflow-x-auto rounded-lg border border-zinc-800">
    <table className="w-full">
    <thead className="bg-zinc-900">
    <tr>
    <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">User</th>
    <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Role</th>
    <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Status</th>
    <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Actions</th>
    </tr>
    </thead>
    <tbody className="divide-y divide-zinc-800">
      {users.map((user) => (
        <tr key={user.id} className="hover:bg-zinc-800/50">
          <td className="py-3 px-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-400" />
                </div>
              </div>
              <div>
                <div className="font-medium text-white">
                  {user.name}
                </div>
                <div className="text-sm text-zinc-400">{user.email}</div>
              </div>
            </div>
          </td>
          <td className="py-3 px-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300">
              {user.role}
            </span>
          </td>
          <td className="py-3 px-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              user.status === 'Active' 
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            }`}>
              {user.status}
            </span>
          </td>
          <td className="py-3 px-4">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setSelectedUser(user);
                  setIsEmailModalOpen(true);
                }}
              >
                <Mail className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setSelectedUser(user);
                  setIsMessageModalOpen(true);
                }}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
              {/* Add more action buttons as needed */}
            </div>
          </td>
        </tr>
      ))}
    </tbody>
    </table>
    </div>
    </Card>
    </TabsContent>
    </Tabs>
    
    {/* Enhanced Modals */}
    <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
    <DialogContent className="bg-zinc-900 border-zinc-800 shadow-lg">
    <DialogHeader>
    <DialogTitle className="text-xl font-semibold text-white">
      Send Email to {selectedUser?.name}
    </DialogTitle>
    <DialogDescription className="text-zinc-400">
    Compose and send an email to {selectedUser?.email}
    </DialogDescription>
    </DialogHeader>
    <div className="space-y-4 mt-4">
    <Textarea
    placeholder="Write your email content here..."
    className="min-h-[200px] bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
    value={emailContent}
    onChange={(e) => setEmailContent(e.target.value)}
    />
    <div className="flex justify-end gap-3">
    <Button
    variant="outline"
    onClick={() => setIsEmailModalOpen(false)}
    className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
    >
    Cancel
    </Button>
    <Button
    onClick={handleSendEmail}
    className="bg-purple-600 hover:bg-purple-500 text-white"
    >
    Send Email
    </Button>
    </div>
    </div>
    </DialogContent>
    </Dialog>
    </div>
    </div>
  );
};

export default AdminPage;