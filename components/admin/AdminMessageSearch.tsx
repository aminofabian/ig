'use client';

import { useState } from 'react';
import { User } from '@prisma/client';
import { Search } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function AdminMessageSearch() {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  const searchUsers = async (search: string) => {
    if (search.length < 2) return;
    
    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(search)}`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleSelectUser = (userId: string) => {
    setOpen(false);
    router.push(`/messages?userId=${userId}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-start">
          <Search className="mr-2 h-4 w-4" />
          Select User to Message
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput 
            placeholder="Search users..." 
            onValueChange={searchUsers}
          />
          <CommandEmpty>No users found.</CommandEmpty>
          <CommandGroup>
            {users.map((user) => (
              <CommandItem
                key={user.id}
                onSelect={() => handleSelectUser(user.id)}
              >
                {(user.firstName && user.lastName) 
                  ? `${user.firstName} ${user.lastName}` 
                  : user.email}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 