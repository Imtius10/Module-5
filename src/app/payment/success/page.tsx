"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowRight,
  BadgeCheck,
  CircleAlert,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api, errorMessage } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import type { Payment } from "@/lib/types";

interface VerifyResponse {
  payment: Payment;
}

function SuccessContent() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const verifiedRef = useRef(false);
  const [confirmed, setConfirmed] = useState<VerifyResponse | null>(null);

  const verify = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post<VerifyResponse>("/api/payments/verify", {
        sessionId: id,
      });
      return res.data;
    },
    onSuccess: (data) => {
      setConfirmed(data);
      toast.success("Payment confirmed — your rental is active!");
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  useEffect(() => {
    if (!sessionId || verifiedRef.current) return;
    verifiedRef.current = true;
    verify.mutate(sessionId);
  }, [sessionId, verify]);

  if (!sessionId) {
    return (
      <Card className="mx-auto max-w-lg">
        <CardContent className="space-y-4 p-8 text-center">
          <CircleAlert className="mx-auto size-10 text-amber-500" />
          <h1 className="text-xl font-semibold">Missing session id</h1>
          <p className="text-sm text-muted-foreground">
            We couldn&apos;t find a Stripe session to verify. If you completed a
            payment, it will still appear in your payment history.
          </p>
          <Button asChild>
            <Link href="/dashboard/tenant/payments">Open payment history</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (verify.isPending || !confirmed && verify.isIdle) {
    return (
      <Card className="mx-auto max-w-lg">
        <CardContent className="space-y-4 p-8 text-center">
          <RefreshCcw className="mx-auto size-10 animate-spin text-primary" />
          <h1 className="text-xl font-semibold">Confirming your payment…</h1>
          <p className="text-sm text-muted-foreground">
            Checking the transaction with Stripe — hang tight.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (verify.isError) {
    return (
      <Card className="mx-auto max-w-lg">
        <CardContent className="space-y-4 p-8 text-center">
          <CircleAlert className="mx-auto size-10 text-red-500" />
          <h1 className="text-xl font-semibold">We couldn&apos;t verify it</h1>
          <p className="text-sm text-muted-foreground">
            {errorMessage(verify.error)}
          </p>
          <div className="flex justify-center gap-3">
            <Button onClick={() => verify.mutate(sessionId)}>
              <RefreshCcw className="size-4" /> Try again
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/tenant/payments">Payment history</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const payment = confirmed?.payment;

  return (
    <Card className="mx-auto max-w-lg overflow-hidden">
      <div className="bg-brand-gradient px-8 py-10 text-center text-white">
        <BadgeCheck className="mx-auto size-12" />
        <h1 className="mt-4 text-2xl font-semibold">Payment successful!</h1>
        <p className="mt-1 text-sm text-white/80">
          Your rental request is now active.
        </p>
      </div>
      <CardContent className="space-y-5 p-6">
        {payment && (
          <dl className="divide-y divide-border/70 text-sm">
            <div className="flex justify-between py-2.5">
              <dt className="text-muted-foreground">Amount</dt>
              <dd className="font-medium tabular-nums">
                {formatPrice(payment.amount)}
              </dd>
            </div>
            <div className="flex justify-between py-2.5">
              <dt className="text-muted-foreground">Transaction ID</dt>
              <dd className="max-w-48 truncate font-mono text-xs">
                {payment.transactionId ?? payment.id}
              </dd>
            </div>
            <div className="flex justify-between py-2.5">
              <dt className="text-muted-foreground">Status</dt>
              <dd className="font-medium text-emerald-600 dark:text-emerald-400">
                {payment.status}
              </dd>
            </div>
          </dl>
        )}

        <div className="flex flex-col gap-2.5 sm:flex-row">
          <Button asChild className="flex-1">
            <Link href="/dashboard/tenant">
              Go to dashboard <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/dashboard/tenant/payments">View payments</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <Suspense
        fallback={
          <p className="text-center text-sm text-muted-foreground">
            Loading…
          </p>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
