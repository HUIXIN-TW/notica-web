"use client";

import { useEffect, useState } from "react";
import MarkdownRenderer from "@components/markdown/MarkdownRenderer";

export default function MarkdownFetch({
  src,
  loadingText = "Loading...",
  errorText = "Failed to load content.",
}) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch(src)
      .then((res) => res.text())
      .then((text) => {
        if (mounted) setContent(text);
      })
      .catch(() => {
        if (mounted) setContent("");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [src]);

  if (loading) return <div>{loadingText}</div>;
  if (!content) return <div>{errorText}</div>;

  return <MarkdownRenderer content={content} />;
}
