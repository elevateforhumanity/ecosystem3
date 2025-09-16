import { loadEnv } from "./env";
import { log, setLogLevel } from "./logger";

setLogLevel("debug");
const env = loadEnv();

log.info("App starting");
if (env.VITE_API_BASE_URL) {
  log.debug("API Base:", env.VITE_API_BASE_URL);
}

console.log("Hello, world!");