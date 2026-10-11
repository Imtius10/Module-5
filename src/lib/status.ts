import type { RentalStatus, UiRentalStatus, PaymentStatus } from "@/lib/types";

/**
 * The API models requests as PENDING | APPROVED | REJECTED.
 * Once an approved request is paid we surface it as ACTIVE in the UI
 * (rent has started), which is what the assignment's status legend asks for.
 */
export function toUiStatus(
  status: RentalStatus,
  payment?: { status: PaymentStatus } | null
): UiRentalStatus {
  if (status === "APPROVED" && payment?.status === "PAID") return "ACTIVE";
  return status;
}

export const STATUS_STYLES: Record<
  UiRentalStatus | "COMPLETED" | "PAID" | "PENDING_PAYMENT" | "CANCELLED" | "FAILED",
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className:
      "bg-amber-100 text-amber-800 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30",
  },
  APPROVED: {
    label: "Approved",
    className:
      "bg-blue-100 text-blue-800 ring-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:ring-blue-500/30",
  },
  REJECTED: {
    label: "Rejected",
    className:
      "bg-red-100 text-red-700 ring-red-200 dark:bg-red-500/15 dark:text-red-300 dark:ring-red-500/30",
  },
  ACTIVE: {
    label: "Active",
    className:
      "bg-emerald-100 text-emerald-800 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30",
  },
  COMPLETED: {
    label: "Completed",
    className:
      "bg-gray-100 text-gray-700 ring-gray-200 dark:bg-white/10 dark:text-gray-300 dark:ring-white/15",
  },
  PAID: {
    label: "Paid",
    className:
      "bg-emerald-100 text-emerald-800 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30",
  },
  PENDING_PAYMENT: {
    label: "Awaiting payment",
    className:
      "bg-blue-100 text-blue-800 ring-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:ring-blue-500/30",
  },
  CANCELLED: {
    label: "Cancelled",
    className:
      "bg-gray-100 text-gray-600 ring-gray-200 dark:bg-white/10 dark:text-gray-400 dark:ring-white/15",
  },
  FAILED: {
    label: "Failed",
    className:
      "bg-red-100 text-red-700 ring-red-200 dark:bg-red-500/15 dark:text-red-300 dark:ring-red-500/30",
  },
};
