export type Role = "TENANT" | "LANDLORD" | "ADMIN";
export type UserStatus = "ACTIVE" | "BLOCKED";
export type RentalStatus = "PENDING" | "APPROVED" | "REJECTED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED";

/** Derived status shown in the UI (adds ACTIVE after payment). */
export type UiRentalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  activeStatus: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LandlordRef {
  id: string;
  name: string;
  email: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  category: string;
  imageUrl?: string | null;
  isAvailable?: boolean;
  landlordId: string;
  createdAt: string;
  updatedAt: string;
  landlord?: LandlordRef;
}

export interface RentalRequest {
  id: string;
  propertyId: string;
  tenantId: string;
  message?: string | null;
  status: RentalStatus;
  createdAt: string;
  updatedAt: string;
  property?: Property;
  tenant?: LandlordRef;
  payment?: Payment | null;
}

export interface PaymentReference {
  id: string;
  propertyId: string;
  tenantId: string;
  status: RentalStatus;
  property?: {
    id: string;
    title: string;
    location: string;
    price: number;
  } | null;
}

export interface Payment {
  id: string;
  rentalRequestId: string;
  tenantId: string;
  amount: number;
  transactionId?: string | null;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  rentalRequest?: PaymentReference | null;
}

export interface Review {
  id: string;
  rentalRequestId: string;
  propertyId: string;
  tenantId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  updatedAt: string;
  tenant?: LandlordRef;
  property?: Property;
}

export interface AdminStatistics {
  users: { total: number; landlords: number; tenants: number };
  properties: { total: number };
  rentalRequests: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
}

export interface ApiEnvelope<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: PageMeta;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}
