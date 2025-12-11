"use client";

export const formatTimestamp = (ts) => {
  if (!ts) return "—";
  const value =
    typeof ts === "string" ? ts.trim() : typeof ts === "number" ? ts : null;
  if (value === null || value === "") return "—";

  const asNumber = Number(value);
  const date =
    Number.isFinite(asNumber) && value !== ""
      ? new Date(asNumber)
      : new Date(ts);
  if (Number.isNaN(date.getTime())) {
    return typeof ts === "string" ? ts : "—";
  }
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export default formatTimestamp;
