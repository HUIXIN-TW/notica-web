"use client";
import logger from "@utils/logger";
import { pollLastSyncLog } from "@utils/polling-user-last-sync-log";
import { useState } from "react";
import Button from "@components/button/Button";
import { useAuth } from "@auth/AuthContext";

const SyncButton = ({ text, onSync, disabled }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  async function triggerSync() {
    logger.debug("[SyncButton] onClick fired", { loading, disabled });
    if (!user) {
      alert("Please log in to sync.");
      return;
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      alert("Demo mode: sync is disabled.");
      return;
    }

    const syncPromise = (async () => {
      if (loading) return;
      setLoading(true);
      try {
        const enqueueAtMs = Date.now();
        const res = await fetch(`${baseUrl}/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const triggerResult = await res.json().catch(() => ({}));
        if (!res.ok) {
          const msg = triggerResult.message || JSON.stringify(triggerResult);
          let userMsg = msg;

          if (
            msg.includes("Insufficient Permission") ||
            msg.includes("insufficientPermissions") ||
            msg.includes("insufficient authentication scopes")
          ) {
            userMsg =
              "Insufficient permission.\nGo to Settings → reconnect Google Calendar.\nRemember to click **Select all** when authorizing.";
          }

          alert(userMsg);
          logger.error("Sync failed", triggerResult);
          return { type: "error", message: userMsg, raw: triggerResult };
        }

        logger.debug("[SyncButton] sync enqueued", triggerResult);
        return await pollLastSyncLog({
          triggerTimeMs: enqueueAtMs,
        });
      } catch (err) {
        logger.error("Sync error", err);
        return { type: "error", message: err.message };
      } finally {
        setTimeout(() => setLoading(false), 3000);
      }
    })();

    if (onSync) onSync(syncPromise);

    return syncPromise;
  }

  return (
    <Button
      type="button"
      text={text || "Sync Calendar"}
      onClick={triggerSync}
      disabled={loading || disabled}
    />
  );
};

export default SyncButton;
