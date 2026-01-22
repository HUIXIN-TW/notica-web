"use client";
import logger from "@utils/logger";
import { useState } from "react";
import Button from "@components/button/Button";
import { openAuthWindow } from "@utils/embed-context";
import env from "@config/env";

const ConnectNotionButton = ({ className, style, text }) => {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    const baseUrl = env.API_BASE_URL;
    if (!baseUrl) {
      alert("Demo mode: Notion connection is disabled.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${baseUrl}/integrations/notion/auth-url`, {
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        alert(
          "Failed to get auth URL: " + (data.error || JSON.stringify(data)),
        );
        return;
      }
      if (!openAuthWindow(data.url)) {
        window.location.href = data.url;
      }
    } catch (err) {
      logger.error("Refresh Notion failed", err);
      alert("Error fetching auth URL: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      className={className}
      style={style}
      text={loading ? "Refreshing..." : text || "Connect Notion Account"}
      onClick={handleClick}
      disabled={loading}
    />
  );
};

export default ConnectNotionButton;
