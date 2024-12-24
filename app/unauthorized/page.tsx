// app/unauthorized/page.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldX } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950">
      <Card className="w-[380px] p-6 bg-gradient-to-br from-zinc-900/80 via-zinc-900/50 to-zinc-900/30 border-zinc-800/50 relative overflow-hidden backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-100px,#f059da15,transparent)] pointer-events-none" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:16px] pointer-events-none" />
        <div className="relative flex flex-col items-center space-y-6 text-center">
          {/* Icon */}
          <div className="rounded-full bg-[#f059da]/10 p-3">
            <ShieldX className="w-8 h-8 text-[#f059da]" />
          </div>
          
          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-zinc-500">
              Access Denied
            </h1>
            <p className="text-zinc-400">
              You don&apos;t have permission to access the admin page.
            </p>
          </div>
          
          {/* Divider */}
          <div className="w-full border-t border-zinc-800/50" />
          
          {/* Actions */}
          <div className="space-y-3 w-full">
            <Button 
              className="w-full bg-[#f059da] hover:bg-[#f059da]/90"
              onClick={() => signIn()}
            >
              Sign In as Admin
            </Button>
            <Link href="/" className="block">
              <Button 
                variant="outline" 
                className="w-full bg-zinc-800/50 hover:bg-zinc-800 border-zinc-700"
              >
                Return Home
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}