import env from "@config/env";

const isProd = env.APP_ENV.toLowerCase() === "production";

// helpers
export function maskValue(value, visible = 4) {
  if (typeof value !== "string" || !value) return value;
  if (value.length <= visible) return "*".repeat(value.length);
  return `${value.slice(0, visible)}${"*".repeat(Math.max(4, value.length - visible))}`;
}

// sinks
const noop = () => {};
const sinks = isProd
  ? { debug: noop, info: noop, warn: noop, error: noop, sensitive: noop }
  : {
      debug: (...args) => {
        console.debug("[DEBUG]", ...args);
      },
      info: (...args) => {
        console.info("[INFO]", ...args);
      },
      warn: (...args) => {
        console.warn("[WARN]", ...args);
      },
      error: (...args) => {
        console.error("[ERROR]", ...args);
      },
      sensitive: (...args) => {
        console.log("[SENSITIVE]", ...args);
      },
    };

export default sinks;
export const isProdRuntime = isProd;
