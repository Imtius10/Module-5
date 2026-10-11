"use client";

import Link from "next/link";
import { ArrowLeft, CreditCard, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentCancelPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <Card className="mx-auto max-w-lg">
        <CardContent className="space-y-5 p-8 text-center">
          <XCircle className="mx-auto size-12 text-muted-foreground" />
          <h1 className="text-2xl font-semibold">Payment cancelled</h1>
          <p className="text-sm text-muted-foreground">
            No money was taken. Your rental request is still approved and
            waiting — you can pick up checkout whenever you&apos;re ready.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/dashboard/tenant/requests">
                <CreditCard className="size-4" /> Back to requests
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/properties">
                <ArrowLeft className="size-4" /> Keep browsing
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
