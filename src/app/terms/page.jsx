"use client";
import { useEffect, useState } from "react";
import MarkdownRenderer from "@components/markdown/MarkdownRenderer";

export const metadata = {
  title: "Terms of Service — NOTICA",
  description: "Terms of Service for NOTICA",
};

// use static generation for FAQ page
export const revalidate = false; // or：export const dynamic = "force-static";

export default function TermsPage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch("/markdown/TERMS.md")
      .then((res) => res.text())
      .then((text) => {
        if (mounted) setContent(text);
      })
      .catch(() => {
        if (mounted) setContent("Failed to load terms of service.");
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
