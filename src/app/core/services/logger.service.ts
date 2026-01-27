import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * Logger service that only logs in development mode
 * Prevents console.log pollution in production
 */
@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private isDev = !environment.production;

  log(...args: any[]): void {
    if (this.isDev) {
      console.log('[LOG]', ...args);
    }
  }

  info(...args: any[]): void {
    if (this.isDev) {
      console.info('[INFO]', ...args);
    }
  }

  warn(...args: any[]): void {
    if (this.isDev) {
      console.warn('[WARN]', ...args);
    }
  }

  error(...args: any[]): void {
    // Always log errors, but with less detail in production
    if (this.isDev) {
      console.error('[ERROR]', ...args);
    } else {
      // In production, log only the message, not the full stack
      const message = args[0] instanceof Error ? args[0].message : args[0];
      console.error('[ERROR]', message);
    }
  }

  debug(...args: any[]): void {
    if (this.isDev) {
      console.debug('[DEBUG]', ...args);
    }
  }

  /**
   * Log HTTP errors in a standardized format
   */
  httpError(context: string, error: any): void {
    if (this.isDev) {
      console.error(`[HTTP ERROR] ${context}:`, {
        status: error.status,
        statusText: error.statusText,
        error: error.error,
        message: error.message
      });
    }
  }
}

