/**
 * Production-safe logging utility
 * Only logs in development mode - nothing visible in production DevTools
 */
const isDev = import.meta.env.DEV;

const logger = {
  /**
   * Log debug information (only in development)
   */
  log: (...args) => {
    if (isDev) {
      console.log('[DEV]', ...args);
    }
  },

  /**
   * Log warnings (only in development)
   */
  warn: (...args) => {
    if (isDev) {
      console.warn('[DEV]', ...args);
    }
  },

  /**
   * Log errors (only in development)
   * In production, errors are silenced from DevTools
   */
  error: (...args) => {
    if (isDev) {
      console.error('[DEV]', ...args);
    }
    // In production: Consider sending to error tracking service like Sentry
  },

  /**
   * Log info (only in development)
   */
  info: (...args) => {
    if (isDev) {
      console.info('[DEV]', ...args);
    }
  }
};

export default logger;
