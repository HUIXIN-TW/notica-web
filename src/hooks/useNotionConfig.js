"use client";

import { useCallback, useEffect, useState } from "react";
import logger from "@utils/logger";

export function useNotionConfig() {
  const [editableConfig, setEditableConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadConfig = useCallback(async () => {
    try {
      if (loading) return;
      setLoading(true);
      setError(null);
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!baseUrl) {
        try {
          const res = await fetch("/templates/notion_config.json");
          const data = await res.json();
          setEditableConfig(data);
          setError("Demo mode: showing example configuration.");
        } catch (err) {
          setEditableConfig(null);
          setError("Demo mode: config is unavailable.");
        }
        return;
      }
      const res = await fetch(`${baseUrl}/integrations/notion/service/config`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        logger.error("[useNotionConfig] fetch failed", res.statusText);
        setError(`Failed to load config (${res.status})`);
        return;
      }

      const data = await res.json();

      logger.info("[useNotionConfig] fetched config", data.config);
      setEditableConfig(data.config);
      try {
        localStorage.setItem("notionConfig", JSON.stringify(data.config));
      } catch (e) {
        logger.warn(
          "[useNotionConfig] failed to cache config to localStorage",
          e,
        );
      }
    } catch (err) {
      logger.error("[useNotionConfig] unexpected error", err);
      setError("Unexpected error occurred");
    } finally {
      setTimeout(() => setLoading(false), 3000);
    }
  }, [loading]);

  useEffect(() => {
    try {
      const cached = localStorage.getItem("notionConfig");
      if (cached) {
        const parsed = JSON.parse(cached);
        setEditableConfig(parsed);
      }
    } catch (e) {
      logger.warn("[useNotionConfig] failed to read cache", e);
    }

    loadConfig();
  }, [loadConfig]);

  return {
    editableConfig,
    setEditableConfig,
    loading,
    error,
    reload: loadConfig,
  };
}
