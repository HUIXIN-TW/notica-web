"use client";

export const formatSyncLog = (
  log,
  { expanded = false, maxLength = 140 } = {},
) => {
  if (log === null || log === undefined) return "—";
  const truncate = (text, max = 140) =>
    text.length > max ? `${text.slice(0, max)}…` : text;

  const stringify = (value, spacing = 0) => {
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return JSON.stringify(parsed, null, spacing);
      } catch (err) {
        return value;
      }
    }
    if (typeof value === "object") return JSON.stringify(value, null, spacing);
    return String(value);
  };

  const formatted = stringify(log, expanded ? 2 : 0);
  return expanded ? formatted : truncate(formatted, maxLength);
};

export default formatSyncLog;
