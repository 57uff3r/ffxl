import type { Environment } from './types.js';

/**
 * Detects the current runtime environment
 */
export function detectEnvironment(): Environment {
  // Check if running in browser
  if (
    typeof globalThis !== 'undefined' &&
    'window' in globalThis &&
    'document' in globalThis
  ) {
    return 'browser';
  }

  // Check if running in Node.js
  if (typeof process !== 'undefined' && process.versions?.node) {
    return 'node';
  }

  // Default to node for server-side environments (Deno, Bun, etc.)
  return 'node';
}

/**
 * Returns true if running in development mode
 */
export function isDevelopment(): boolean {
  // Check Node.js environment
  if (typeof process !== 'undefined' && process.env) {
    const nodeEnv = process.env.NODE_ENV;
    if (nodeEnv === 'development' || nodeEnv === 'dev') {
      return true;
    }
  }

  // Check browser environment
  if (
    typeof globalThis !== 'undefined' &&
    'window' in globalThis &&
    (globalThis as any).window?.__DEV__
  ) {
    return true;
  }

  return false;
}

/**
 * Logger that outputs to the appropriate channel based on environment
 */
export class Logger {
  private static env: Environment = detectEnvironment();
  private static isDev: boolean = isDevelopment();

  /**
   * Logs an informational message in development mode
   */
  static info(message: string, ...args: any[]): void {
    if (!this.isDev) return;

    const prefix = '[ffxl]';

    if (this.env === 'browser') {
      console.info(`${prefix} ${message}`, ...args);
    } else {
      // Node.js - write to stdout
      process.stdout.write(`${prefix} ${message}\n`);
      if (args.length > 0) {
        console.log(...args);
      }
    }
  }

  /**
   * Logs a warning message
   */
  static warn(message: string, ...args: any[]): void {
    if (!this.isDev) return;

    const prefix = '[ffxl]';

    if (this.env === 'browser') {
      console.warn(`${prefix} ${message}`, ...args);
    } else {
      // Node.js - write to stderr
      process.stderr.write(`${prefix} WARNING: ${message}\n`);
      if (args.length > 0) {
        console.warn(...args);
      }
    }
  }

  /**
   * Logs an error message
   */
  static error(message: string, ...args: any[]): void {
    const prefix = '[ffxl]';

    if (this.env === 'browser') {
      console.error(`${prefix} ${message}`, ...args);
    } else {
      // Node.js - write to stderr
      process.stderr.write(`${prefix} ERROR: ${message}\n`);
      if (args.length > 0) {
        console.error(...args);
      }
    }
  }
}
