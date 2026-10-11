import { api, type QueryValue } from "@/lib/api";
import type {
  AdminStatistics,
  PageMeta,
  Payment,
  Property,
  RentalRequest,
  Review,
  User,
} from "@/lib/types";

export const queryKeys = {
  properties: (params: Record<string, QueryValue>) =>
    ["properties", params] as const,
  property: (id: string) => ["property", id] as const,
  categories: ["categories"] as const,
  reviews: (propertyId: string) => ["reviews", propertyId] as const,
  myRequests: (page: number) => ["rentals", "me", page] as const,
  myPayments: (page: number) => ["payments", "me", page] as const,
  landlordProperties: (page: number) => ["landlord", "properties", page] as const,
  landlordRequests: (page: number) => ["landlord", "requests", page] as const,
  adminStatistics: ["admin", "statistics"] as const,
  adminUsers: (page: number) => ["admin", "users", page] as const,
  adminProperties: (page: number) => ["admin", "properties", page] as const,
  adminRentals: (page: number) => ["admin", "rentals", page] as const,
};

export interface PropertyParams {
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
  category?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
}

export async function fetchProperties(params: PropertyParams) {
  const res = await api.get<Property[]>("/api/properties", {
    query: { ...params },
    auth: false,
  });
  return { items: res.data, meta: res.meta as PageMeta };
}

export async function fetchProperty(id: string) {
  const res = await api.get<Property>(`/api/properties/${id}`, { auth: false });
  return res.data;
}

export async function fetchCategories() {
  const res = await api.get<string[]>("/api/categories", { auth: false });
  return res.data;
}

export async function fetchPropertyReviews(propertyId: string, page = 1) {
  const res = await api.get<Review[]>(`/api/reviews/property/${propertyId}`, {
    query: { page, limit: 5 },
    auth: false,
  });
  return { items: res.data, meta: res.meta as PageMeta };
}

export async function fetchMyRequests(page = 1) {
  const res = await api.get<RentalRequest[]>("/api/rentals", {
    query: { page, limit: 8 },
  });
  return { items: res.data, meta: res.meta as PageMeta };
}

export async function fetchMyPayments(page = 1) {
  const res = await api.get<Payment[]>("/api/payments", {
    query: { page, limit: 8 },
  });
  return { items: res.data, meta: res.meta as PageMeta };
}

export async function fetchLandlordProperties(page = 1) {
  const res = await api.get<Property[]>("/api/landlord/properties", {
    query: { page, limit: 8 },
  });
  return { items: res.data, meta: res.meta as PageMeta };
}

export async function fetchLandlordRequests(page = 1) {
  const res = await api.get<RentalRequest[]>("/api/landlord/requests", {
    query: { page, limit: 10 },
  });
  return { items: res.data, meta: res.meta as PageMeta };
}

export async function fetchAdminStatistics() {
  const res = await api.get<AdminStatistics>("/api/admin/statistics");
  return res.data;
}

export async function fetchAdminUsers(page = 1) {
  const res = await api.get<User[]>("/api/admin/users", {
    query: { page, limit: 10 },
  });
  return { items: res.data, meta: res.meta as PageMeta };
}

export async function fetchAdminProperties(page = 1) {
  const res = await api.get<Property[]>("/api/admin/properties", {
    query: { page, limit: 10 },
  });
  return { items: res.data, meta: res.meta as PageMeta };
}

export async function fetchAdminRentals(page = 1) {
  const res = await api.get<RentalRequest[]>("/api/admin/rentals", {
    query: { page, limit: 10 },
  });
  return { items: res.data, meta: res.meta as PageMeta };
}
