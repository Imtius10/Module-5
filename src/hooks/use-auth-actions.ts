"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { saveTokens, dashboardPathForRole, toSessionUser } from "@/lib/session";
import { useAuth } from "@/store/auth";
import type { Role, User } from "@/lib/types";

interface LoginPayload {
  accessToken: string;
  refreshToken: string;
}

export function useAuthActions() {
  const router = useRouter();
  const setUser = useAuth((state) => state.setUser);
  const signOut = useAuth((state) => state.signOut);

  const login = useCallback(
    async (email: string, password: string): Promise<User> => {
      const res = await api.post<LoginPayload>(
        "/api/auth/login",
        { email, password },
        { auth: false }
      );
      saveTokens(res.data.accessToken, res.data.refreshToken);

      const me = await api.get<User>("/api/auth/me");
      const sessionUser = toSessionUser(me.data);
      setUser(sessionUser);
      return me.data;
    },
    [setUser]
  );

  const register = useCallback(
    async (input: {
      name: string;
      email: string;
      password: string;
      role: Exclude<Role, "ADMIN">;
    }): Promise<User> => {
      await api.post("/api/auth/register", input, { auth: false });
      // API returns the user without tokens -> sign in straight away
      return login(input.email, input.password);
    },
    [login]
  );

  const finishAuth = useCallback(
    (user: User, next?: string | null) => {
      const target =
        next && next.startsWith("/") && !next.startsWith("//")
          ? next
          : dashboardPathForRole(user.role);
      router.replace(target);
      router.refresh();
    },
    [router]
  );

  return { login, register, finishAuth, signOut, router };
}

export { ApiError };
