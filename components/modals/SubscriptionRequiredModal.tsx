'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LockIcon } from "lucide-react";

interface SubscriptionRequiredModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SubscriptionRequiredModal({ isOpen, onOpenChange }: SubscriptionRequiredModalProps) {
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      // Remove the parameter from URL when closing
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete('subscription_required');
      window.history.replaceState({}, '', currentUrl.toString());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md border border-[#f059da]/20 bg-black/95">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-[#f059da]/10 text-[#f059da]">
            <LockIcon className="h-6 w-6" />
          </div>
        </div>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-white mb-2">
            Premium Access Required
          </DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            Unlock all features with our premium subscription
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-300">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#f059da]/20 flex items-center justify-center">
                <span className="text-[#f059da] text-sm">✓</span>
              </div>
              <span>Unlimited Instagram Profile Analysis</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#f059da]/20 flex items-center justify-center">
                <span className="text-[#f059da] text-sm">✓</span>
              </div>
              <span>Advanced Analytics Dashboard</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#f059da]/20 flex items-center justify-center">
                <span className="text-[#f059da] text-sm">✓</span>
              </div>
              <span>AI-Powered Growth Strategies</span>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <Button
              variant="secondary"
              onClick={() => {
                handleOpenChange(false);
                router.push('/pricing');
              }}
              className="bg-[#f059da] hover:bg-[#f059da]/90 text-white"
            >
              View Plans
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="border-[#f059da]/20 hover:bg-[#f059da]/10 text-white"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}