'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { pusherClient } from '@/lib/pusher';

interface Message {
  id: string;
  content: string;
  fromId: string;
}

export default function MessagePage() {
  const { data: session } = useSession();
  const params = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = async () => {
    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newMessage,
          recipientId: params.userId,
        }),
      });

      if (response.ok) {
        setNewMessage('');
        // Message will be added via Pusher real-time update
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    // Subscribe to Pusher channel for real-time updates
    const channel = pusherClient.subscribe(`chat-${params.userId}`);
    channel.bind('new-message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      pusherClient.unsubscribe(`chat-${params.userId}`);
    };
  }, [params.userId]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.fromId === session?.user?.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] rounded-lg p-3 ${
              message.fromId === session?.user?.id ? 'bg-[#f059da] text-white' : 'bg-zinc-800 text-white'
            }`}>
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-zinc-800 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-zinc-800 text-white rounded-lg px-4 py-2"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="bg-[#f059da] text-white px-4 py-2 rounded-lg hover:bg-[#f059da]/90"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
} 