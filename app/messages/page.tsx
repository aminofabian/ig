"use client";

import { MessageForm } from "@/components/messages/MessageForm";
import { UserMessageListener } from "@/components/messages/UserMessageListener";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { NotificationListener } from "@/components/shared/NotificationListener";

interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [selectedAdminId, setSelectedAdminId] = useState<string>("");

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch('/api/admin/get-all');
        const data = await response.json();
        setAdmins(data.admins);
      } catch (error) {
        console.error('Failed to fetch admins:', error);
      }
    };
    
    fetchAdmins();
  }, []);

  if (!admins.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <NotificationListener />
      <UserMessageListener />
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-zinc-900/50 p-4 rounded-lg">
          <label className="block text-sm font-medium mb-2 text-white">Select Admin to Message</label>
          <select 
            value={selectedAdminId}
            onChange={(e) => setSelectedAdminId(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-slate-100"
          >
            <option value="">Choose an admin...</option>
            {admins.map((admin) => (
              <option key={admin.id} value={admin.id}>
                {admin.firstName} {admin.lastName} ({admin.email})
              </option>
            ))}
          </select>
        </div>
        
        {selectedAdminId && <MessageForm recipientId={selectedAdminId} />}
      </div>
    </div>
  );
} 