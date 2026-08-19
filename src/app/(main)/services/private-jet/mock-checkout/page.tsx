"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Button from "@/components/ui/Button";

function MockCheckoutContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams?.get("bookingId");
  const [processing, setProcessing] = useState(false);

  const simulatePayment = async () => {
    setProcessing(true);
    // Simulate API call to complete payment
    setTimeout(() => {
      // Direct update for mock purposes since we don't have paystack webhooks active
      fetch("/api/jets/bookings/mock-pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId })
      }).then(() => {
        window.location.href = "/account/bookings?status=success";
      });
    }, 2000);
  };

  return (
    <div className="bg-obsidian-light border border-border/30 p-12 max-w-md mx-auto text-center space-y-8 mt-24">
      <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-gold text-2xl font-serif">₦</span>
      </div>
      <h1 className="font-serif text-3xl text-off-white">Mock Checkout</h1>
      <p className="text-muted font-sans text-sm">
        PAYSTACK_SECRET_KEY is not configured in the environment. Click below to simulate a successful payment.
      </p>
      
      <div className="pt-8 border-t border-border/30">
        <Button onClick={simulatePayment} disabled={processing || !bookingId} className="w-full">
          {processing ? "Processing Payment..." : "Simulate Successful Payment"}
        </Button>
      </div>
    </div>
  );
}

export default function MockCheckoutPage() {
  return (
    <div className="container mx-auto px-6 py-24 min-h-[60vh] flex items-center justify-center">
      <Suspense fallback={<div className="text-gold uppercase tracking-widest text-sm">Loading Checkout...</div>}>
        <MockCheckoutContent />
      </Suspense>
    </div>
  );
}
