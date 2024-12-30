"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSession } from 'next-auth/react';
import { useChat } from '@/lib/contexts/ChatContext';

interface MessageFormProps {
  recipientId: string;
}

export const MessageForm = ({ recipientId }: MessageFormProps) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { data: session } = useSession();
  const { messages, loadMessages } = useChat();

  useEffect(() => {
    if (recipientId) {
      loadMessages(recipientId);
    }
  }, [recipientId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSending(true);
    try {
      await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId,
          content: message,
        }),
      });

      setMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.fromId === session?.user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                msg.fromId === session?.user?.id
                  ? 'bg-[#f059da]/10 text-white'
                  : 'bg-zinc-800 text-zinc-100'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <div className="flex justify-between items-center mt-1 text-xs text-zinc-500">
                <span>{msg.senderName}</span>
                <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-800">
        <div className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-zinc-900/50 border-zinc-800 focus:ring-[#f059da]/10 text-slate-100"
          />
          <Button
            type="submit"
            disabled={isSending || !message.trim()}
            className="bg-[#f059da] hover:bg-[#f059da]/90"
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}; 