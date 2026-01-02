"use client";

import { createContext, useContext, useMemo } from "react";
import { useBackendSession } from "@hooks/useBackendSession";

const AuthContext = createContext({
  user: null,
  loading: true,
  error: null,
  login: () => {},
  logout: () => {},
  refresh: () => {},
});

export function AuthProvider({ children }) {
  const { user, status, error, refresh } = useBackendSession();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const login = () => {
    if (!baseUrl) return;
    const callbackUrl = window.location.origin;
    const qs = new URLSearchParams({ callbackUrl }).toString();
    window.location.href = `${baseUrl}/auth/login?${qs}`;
  };

  const logout = () => {
    if (!baseUrl) return;
    const callbackUrl = window.location.origin;
    const qs = new URLSearchParams({ callbackUrl }).toString();
    window.location.href = `${baseUrl}/auth/logout?${qs}`;
  };

  const value = useMemo(
    () => ({
      user,
      loading: status === "loading" || status === "idle",
      error,
      login,
      logout,
      refresh,
    }),
    [user, status, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
