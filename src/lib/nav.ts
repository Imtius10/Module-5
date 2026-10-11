import {
  Building2,
  CreditCard,
  FileText,
  Gauge,
  Home,
  Inbox,
  ListChecks,
  MessageSquareText,
  PlusCircle,
  Users,
} from "lucide-react";
import type { Role } from "@/lib/types";

export interface NavItem {
  href: string;
  label: string;
  icon: typeof Gauge;
  /** exact match highlighting */
  exact?: boolean;
}

export const NAV_ITEMS: Record<Role, NavItem[]> = {
  TENANT: [
    { href: "/dashboard/tenant", label: "Overview", icon: Gauge, exact: true },
    { href: "/dashboard/tenant/requests", label: "My requests", icon: Inbox },
    { href: "/dashboard/tenant/payments", label: "Payments", icon: CreditCard },
    { href: "/dashboard/tenant/reviews", label: "My reviews", icon: MessageSquareText },
  ],
  LANDLORD: [
    { href: "/dashboard/landlord", label: "Overview", icon: Gauge, exact: true },
    {
      href: "/dashboard/landlord/properties",
      label: "My properties",
      icon: Building2,
    },
    {
      href: "/dashboard/landlord/properties/new",
      label: "Add listing",
      icon: PlusCircle,
    },
    {
      href: "/dashboard/landlord/requests",
      label: "Requests",
      icon: ListChecks,
    },
  ],
  ADMIN: [
    { href: "/dashboard/admin", label: "Overview", icon: Gauge, exact: true },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    { href: "/dashboard/admin/properties", label: "Properties", icon: Home },
    { href: "/dashboard/admin/rentals", label: "Rentals", icon: FileText },
  ],
};

export const ROLE_LABEL: Record<Role, string> = {
  TENANT: "Tenant",
  LANDLORD: "Landlord",
  ADMIN: "Administrator",
};
