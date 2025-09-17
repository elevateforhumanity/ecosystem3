export type LogLevel = "debug" | "info" | "warn" | "error";

let current: LogLevel = "info";
const order: LogLevel[] = ["debug", "info", "warn", "error"];

export function setLogLevel(level: LogLevel) {
  current = level;
}

function enabled(level: LogLevel) {
  return order.indexOf(level) >= order.indexOf(current);
}

export const log = {
  debug: (...a: unknown[]) => enabled("debug") && console.debug("[debug]", ...a),
  info: (...a: unknown[]) => enabled("info") && console.log("[info]", ...a),
  warn: (...a: unknown[]) => enabled("warn") && console.warn("[warn]", ...a),
  error: (...a: unknown[]) => enabled("error") && console.error("[error]", ...a)
};