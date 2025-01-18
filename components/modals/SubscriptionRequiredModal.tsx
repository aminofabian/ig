'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LockIcon } from "lucide-react";

interface SubscriptionRequiredModalProps {
  isOpen: boolean;
}

export default function SubscriptionRequiredModal({ isOpen }: SubscriptionRequiredModalProps) {
  const router = useRouter();

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
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
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => router.push('https://igleadgen.com/pricing')}
              className="w-full bg-[#f059da] hover:bg-[#d441bf] text-white py-5 rounded-lg font-semibold transition-all duration-200 shadow-[0_0_15px_rgba(240,89,218,0.3)] hover:shadow-[0_0_25px_rgba(240,89,218,0.5)]"
            >
              View Premium Plans
            </Button>
            <p className="text-xs text-center text-gray-500">
              Cancel anytime. 7-day money-back guarantee.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 