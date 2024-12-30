"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSession } from 'next-auth/react';
import { useChat } from '@/lib/contexts/ChatContext';
import { User } from '@/types/admin';

interface AdminMessageFormProps {
  user: User;
  onClose: () => void;
}

export const AdminMessageForm = ({ user, onClose }: AdminMessageFormProps) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { data: session } = useSession();
  const { loadMessages } = useChat();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSending(true);
    try {
      await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: user.id,
          content: message,
        }),
      });

      setMessage('');
      toast.success('Message sent');
      onClose();
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={`Message ${user.name || user.email}...`}
        className="min-h-[100px] bg-zinc-900/50 border-zinc-800 focus:ring-[#f059da]/10"
      />
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          className="text-zinc-400"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSending || !message.trim()}
          className="bg-[#f059da] hover:bg-[#f059da]/90"
        >
          Send Message
        </Button>
      </div>
    </form>
  );
}; 