"use client";
import { useEffect, useState } from "react";
import MarkdownRenderer from "@components/markdown/MarkdownRenderer";

export const metadata = {
  title: "Privacy Policy — NOTICA",
  description: "Privacy Policy for NOTICA",
};

// use static generation for FAQ page
export const revalidate = false; // or：export const dynamic = "force-static";

export default function PrivacyPage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch("/markdown/PRIVACY.md")
      .then((res) => res.text())
      .then((text) => {
        if (mounted) setContent(text);
      })
      .catch(() => {
        if (mounted) setContent("Failed to load privacy policy.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <MarkdownRenderer content={content} />
      )}
    </div>
  );
}
