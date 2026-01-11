"use client";

import React, { useState } from "react";
import Button from "@components/button/Button";
import logger from "@utils/logger";
import validateConfigFormat from "@utils/validate-config-format";
import env from "@config/env";

export default function SaveButton({
  editableConfig,
  setEditMode,
  setMessages,
}) {
  const [loading, setLoading] = useState(false);

  const toLegacyArrayOfOne = (v) => {
    if (Array.isArray(v)) return v;
    if (v && typeof v === "object" && Object.keys(v).length > 0) return [v];
    return [{}];
  };

  const serializeForBackend = (cfg) => {
    // Convert gcal_dic and page_property back to legacy array-of-one format
    const out = { ...cfg };
    if ("gcal_dic" in out) out.gcal_dic = toLegacyArrayOfOne(out.gcal_dic);
    if ("page_property" in out)
      out.page_property = toLegacyArrayOfOne(out.page_property);
    return out;
  };

  const handleSaveClick = async () => {
    if (loading) return;
    setLoading(true);

    // 1) Build the payload you will POST
    const payload = serializeForBackend(editableConfig);
    logger.info("Payload to save:", payload);

    // 2) Validate WITHOUT mutation
    const errors = validateConfigFormat(payload);
    logger.debug("Validation result:", errors);

    if (errors.length > 0) {
      alert("Validation failed:\n\n" + errors.join("\n"));
      setLoading(false);
      return;
    }

    try {
      const baseUrl = env.API_BASE_URL;
      if (!baseUrl) {
        alert("Demo mode: saving is disabled.");
        return;
      }
      const res = await fetch(`${baseUrl}/integrations/notion/service/config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessages("Configuration saved successfully");
        setEditMode(false);
        localStorage.setItem("notionConfig", JSON.stringify(payload));
      } else {
        const { message } = await res
          .json()
          .catch(() => ({ message: "Unknown error" }));
        alert("Save failed: " + message);
      }
    } catch (err) {
      logger.error("Save failed:", err);
      alert("Unexpected network error during save");
    } finally {
      setTimeout(() => setLoading(false), 3000);
    }
  };

  return (
    <Button
      text={loading ? "Saving..." : "Save"}
      onClick={handleSaveClick}
      disabled={loading}
    />
  );
}
