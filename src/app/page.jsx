"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { isEmbedded } from "@utils/embed-context";
import SignInButton from "@components/button/SignInButton";
import { useAuth } from "@auth/AuthContext";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (isEmbedded()) {
      router.replace("/embedded/profile");
    }
  }, [router]);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/profile");
    }
  }, [loading, user, router]);

  return (
    <div className={styles.home}>
      <h2>Welcome to NOTICA!</h2>
      <div className={styles.detail}>
        <p>
          We use the Google Calendar API to sync selected calendars with Notion.
          By continuing, you agree to our{" "}
          <Link href="/privacy">Privacy Policy</Link> and{" "}
          <Link href="/terms">Terms of Service</Link>.
        </p>

        <p>
          Open source:{" "}
          <a
            href="https://github.com/HUIXIN-TW/NotionSyncGCal"
            target="_blank"
            rel="noopener noreferrer"
          >
            NotionSyncGCal
          </a>
        </p>
        <br />
        <br />
      </div>
      {!user && !loading && <SignInButton />}
    </div>
  );
}
