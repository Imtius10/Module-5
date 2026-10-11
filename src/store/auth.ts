import { create } from "zustand";
import { api, errorMessage } from "@/lib/api";
import {
  clearSession,
  getAccessToken,
  readSessionUser,
  saveSessionUser,
  toSessionUser,
} from "@/lib/session";
import type { SessionUser, User } from "@/lib/types";

export type AuthStatus = "loading" | "authed" | "guest";

interface AuthState {
  user: SessionUser | null;
  status: AuthStatus;
  /** error message from the last bootstrap attempt (e.g. blocked account) */
  notice: string | null;
  bootstrap: () => Promise<void>;
  setUser: (user: SessionUser) => void;
  signOut: () => Promise<void>;
  resetNotice: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: typeof window === "undefined" ? null : readSessionUser(),
  status: typeof window === "undefined" ? "loading" : "loading",
  notice: null,

  bootstrap: async () => {
    const hasSession = Boolean(getAccessToken() || readSessionUser());
    if (!hasSession) {
      set({ status: "guest", user: null });
      return;
    }

    // Show the cached identity instantly, then verify it with the API.
    const cached = readSessionUser();
    if (cached) set({ user: cached, status: "loading" });

    try {
      const res = await api.get<User>("/api/auth/me");
      const me = res.data;
      if (me.activeStatus === "BLOCKED") {
        clearSession();
        set({
          user: null,
          status: "guest",
          notice: "Your account has been blocked by the admin.",
        });
        return;
      }
      const sessionUser = toSessionUser(me);
      saveSessionUser(sessionUser);
      set({ user: sessionUser, status: "authed", notice: null });
    } catch (error) {
      clearSession();
      set({
        user: null,
        status: "guest",
        notice:
          errorMessage(error) === "Your session has expired. Please sign in again."
            ? null
            : errorMessage(error),
      });
    }
  },

  setUser: (user) => {
    saveSessionUser(user);
    set({ user, status: "authed", notice: null });
  },

  signOut: async () => {
    try {
      await api.post("/api/auth/logout", undefined, { auth: false });
    } catch {
      // logging out locally is enough even if the API call fails
    }
    clearSession();
    set({ user: null, status: "guest", notice: null });
  },

  resetNotice: () => set({ notice: null }),
}));
