"use client";

import { useCallback, useEffect, useState } from "react";

export function useBackendSession() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      setUser(null);
      setStatus("unauthenticated");
      return;
    }

    setStatus("loading");
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/user/me`, {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) {
        setUser(null);
        setStatus("unauthenticated");
        return;
      }
      const data = await res.json();
      setUser(data || null);
      setStatus("authenticated");
    } catch (err) {
      setError(err?.message || "Failed to load session");
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { user, status, error, refresh: load };
}
