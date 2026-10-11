import Cookies from "js-cookie";
import type { Role, SessionUser } from "@/lib/types";

export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";
export const SESSION_USER_KEY = "rn_user";

const ONE_DAY = { expires: 1, sameSite: "lax" as const };

export function getAccessToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return Cookies.get(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return Cookies.get(REFRESH_TOKEN_KEY);
}

export function saveTokens(accessToken: string, refreshToken?: string) {
  Cookies.set(ACCESS_TOKEN_KEY, accessToken, ONE_DAY);
  if (refreshToken) {
    Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { expires: 7, sameSite: "lax" });
  }
}

export function saveSessionUser(user: SessionUser) {
  Cookies.set(SESSION_USER_KEY, JSON.stringify(user), { expires: 7, sameSite: "lax" });
}

export function readSessionUser(): SessionUser | null {
  if (typeof window === "undefined") return null;
  const raw = Cookies.get(SESSION_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
  Cookies.remove(SESSION_USER_KEY);
}

/** Payload we store client-side right after login/register. */
export function toSessionUser(user: {
  id: string;
  name: string;
  email: string;
  role: Role;
}): SessionUser {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export function dashboardPathForRole(role: Role): string {
  switch (role) {
    case "LANDLORD":
      return "/dashboard/landlord";
    case "ADMIN":
      return "/dashboard/admin";
    default:
      return "/dashboard/tenant";
  }
}
