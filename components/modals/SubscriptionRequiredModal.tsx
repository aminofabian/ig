'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface SubscriptionRequiredModalProps {
  isOpen: boolean;
}

export default function SubscriptionRequiredModal({ isOpen }: SubscriptionRequiredModalProps) {
  const router = useRouter();

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center text-white">Subscription Required</DialogTitle>
          <DialogDescription className="text-center text-gray-300">
            Your subscription is inactive. Please subscribe to continue using our services.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-gray-300 text-center">
            Access to the dashboard requires an active subscription.
          </p>
          <div className="flex justify-center">
            <Button
              onClick={() => router.push('https://igleadgen.com/pricing')}
              className="bg-[#f059da] hover:bg-[#d441bf] text-white"
            >
              View Pricing Plans
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 