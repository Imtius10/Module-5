import Link from "next/link";
import { Quote, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden bg-brand-gradient p-10 text-white lg:flex lg:flex-col">
        <div className="pointer-events-none absolute -left-24 -top-24 size-96 rounded-full bg-white/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-16 size-96 rounded-black/20 blur-3xl" />

        <Link href="/" className="relative z-10 inline-flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
            <Sparkles className="size-4" />
          </span>
          <span className="text-lg font-semibold">
            Rent<span className="opacity-80">Nest</span>
          </span>
        </Link>

        <div className="relative z-10 mt-auto max-w-md">
          <Quote className="size-8 opacity-70" />
          <p className="mt-4 text-2xl font-medium leading-snug">
            “I listed my flat on Monday and had an approved, paid tenant by
            Thursday.”
          </p>
          <p className="mt-4 text-sm text-white/80">
            — Imtius A., landlord in Banani
          </p>

          <div className="mt-10 grid gap-3">
            {[
              { icon: ShieldCheck, text: "JWT protected dashboards per role" },
              { icon: Wallet, text: "Stripe Checkout for rent payments" },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm backdrop-blur"
              >
                <item.icon className="size-4 shrink-0" />
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Form panel */}
      <div className="relative flex flex-col">
        <div className="flex items-center justify-between px-4 pt-4 sm:px-8">
          <Logo />
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden text-sm text-muted-foreground transition-colors hover:text-primary sm:block"
            >
              Back to site
            </Link>
            <ThemeToggle />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
