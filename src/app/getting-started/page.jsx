"use client";

import styles from "./getting-started.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@components/button/Button";
import { useConnectionNotice } from "@hooks/useConnectionNotice";
import ConnectGCalButton from "@components/button/ConnectGCalButton";
import ConnectNotionButton from "@components/button/ConnectNotionButton";
import LinkToNotionTemplateButton from "@components/button/LinkToNotionTemplateButton";
import { useAuth } from "@auth/AuthContext";

const GettingStarted = () => {
  const router = useRouter();
  const { notice, noticeType } = useConnectionNotice();
  const { user, loading } = useAuth();

  const [googleStatus, setGoogleStatus] = useState(null);
  const [notionStatus, setNotionStatus] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setGoogleStatus(localStorage.getItem("googleStatus"));
      setNotionStatus(localStorage.getItem("notionStatus"));
    }
  }, []);

  const handleFinishSetup = () => {
    router.replace("/notion/config");
  };

  if (loading) return <div>Loading session...</div>;
  if (!user) return <div>Please sign in to get started.</div>;

  return (
    <>
      <h2>Let’s Get Your Sync Ready</h2>

      {notice && (
        <div
          className={
            noticeType === "success"
              ? styles.notice_success
              : styles.notice_error
          }
        >
          {notice}
        </div>
      )}

      <div className={styles.gettingstartedcard_container}>
        <ConnectGCalButton
          className="outline_btn"
          text={googleStatus || "Step 1: Connect Google Calendar Account"}
        />

        <ConnectNotionButton
          className="outline_btn"
          text={notionStatus || "Step 2: Connect Notion Database Account"}
        />

        <LinkToNotionTemplateButton
          className="outline_btn"
          text="Step 3: Open Notion Template to duplicate"
        />

        <Button
          className="outline_btn"
          text="Finish Connection Setup. Proceed to Settings"
          onClick={handleFinishSetup}
        />

        <br />
      </div>
    </>
  );
};

export default GettingStarted;
