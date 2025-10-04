// Simple console logger for frontend (Winston doesn't work in browser)
class Logger {
  log(message: string, context?: string) {
    console.log(`[${context || "App"}] ${message}`);
  }

  error(message: string, trace?: string, context?: string) {
    console.error(
      `[${context || "App"}] ERROR: ${message}`,
      trace ? `\n${trace}` : ""
    );
  }

  warn(message: string, context?: string) {
    console.warn(`[${context || "App"}] WARN: ${message}`);
  }

  debug(message: string, context?: string) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(`[${context || "App"}] DEBUG: ${message}`);
    }
  }

  info(message: string, context?: string) {
    console.info(`[${context || "App"}] INFO: ${message}`);
  }
}

export const logger = new Logger();
