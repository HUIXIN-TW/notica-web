"use client";

import { useEffect, useState } from "react";
import SyncButton from "@components/button/SyncButton";
import NavigateButton from "@components/button/NavigateButton";
import useSyncHandler from "@hooks/useSyncHandler";
import { useCountdown } from "@hooks/useCountdown";
import { useElapsedTime } from "@hooks/useElapsedTime";
import config from "@config/rate-limit";
import styles from "./profile.module.css";
import { isProdRuntime as isProd } from "@utils/logger";
import { isNotionMobileApp } from "@utils/embed-context";
import { useAuth } from "@auth/AuthContext";

export default function EmbedSyncPage() {
  const { user, loading } = useAuth();
  const [isNotionMobile, setIsNotionMobile] = useState(false);

  useEffect(() => {
    const notionMobile = isNotionMobileApp();
    setIsNotionMobile(notionMobile);
    if (notionMobile && typeof window !== "undefined") {
      setFallbackUrl(window.location.href);
    }
  }, []);

  const SYNC_USER_MIN_MS = config.SYNC_USER_MIN_MS ?? 10 * 60_000;
  const { startCountdown, isCountingDown, formattedRemaining } =
    useCountdown("cooldown:sync");

  const { syncResult, isSyncing, syncStartedAt, handleSync } = useSyncHandler({
    userUuid: user?.uuid,
    cooldownMs: SYNC_USER_MIN_MS,
    startCountdown,
  });

  const elapsedSec = useElapsedTime(syncStartedAt);

  const syncButtonText =
    isSyncing && syncStartedAt
      ? `Syncing... (${elapsedSec}s)`
      : isCountingDown
        ? `You can sync again in ${formattedRemaining}`
        : `Sync Calendar`;

  if (isNotionMobile) {
    return (
      <div className={styles.card}>
        <h1 className={styles.title}>Notica Sync</h1>
        <p className={styles.description}>
          Interactive embeds are not supported in the Notion mobile app. Please
          open this page in your mobile browser to continue.
        </p>
        <NavigateButton path="/profile" text="Open in browser" />
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>Notica Sync</h1>
      {loading && <p className={styles.description}>Loading…</p>}
      {!loading && !user && (
        <p className={styles.description}>Please sign in to sync.</p>
      )}
      {user && (
        <>
          <p className={styles.description}>
            Signed in as <strong>{user.email}</strong>. Trigger a manual sync
            whenever you update your Notion tasks.
          </p>
          <SyncButton
            text={syncButtonText}
            onSync={handleSync}
            disabled={isSyncing || (isCountingDown && isProd)}
          />
        </>
      )}
      {syncResult && (
        <>
          <div className={styles.divider} />
          <div className={styles.status}>
            Last Status: <strong>{syncResult?.type ?? "-"}</strong>
          </div>
          <div className={styles.result_message}>
            {syncResult?.message
              ? syncResult?.type === "sync_success"
                ? `Last sync at ${syncResult?.message?.trigger_time || "-"}`
                : syncResult?.message
              : "-"}
          </div>
        </>
      )}
    </div>
  );
}
