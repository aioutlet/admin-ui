/**
 * Frontend Logger Utility
 * Provides structured logging for troubleshooting
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private enableConsoleLog = true;
  private verboseLogging = false; // Can be enabled via localStorage

  constructor() {
    // Check if verbose logging is enabled via localStorage
    if (typeof window !== 'undefined') {
      this.verboseLogging = localStorage.getItem('debug_logging') === 'true';
      
      // Show helpful message in development
      if (this.isDevelopment && !this.verboseLogging) {
        console.log(
          '%c💡 Tip: Enable verbose logging with: %clogger.setVerbose(true)',
          'color: #2563eb',
          'color: #059669; font-weight: bold'
        );
      }
    }
  }

  /**
   * Enable or disable verbose logging at runtime
   */
  setVerbose(enabled: boolean): void {
    this.verboseLogging = enabled;
    if (typeof window !== 'undefined') {
      if (enabled) {
        localStorage.setItem('debug_logging', 'true');
        console.log('🔍 Verbose logging enabled. Set to false with: logger.setVerbose(false)');
      } else {
        localStorage.removeItem('debug_logging');
        console.log('✅ Verbose logging disabled.');
      }
    }
  }

  /**
   * Format log message with timestamp and context
   */
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level}] ${message}${contextStr}`;
  }

  /**
   * Get appropriate console method for log level
   */
  private getConsoleMethod(level: LogLevel): (...args: any[]) => void {
    switch (level) {
      case LogLevel.ERROR:
        return console.error;
      case LogLevel.WARN:
        return console.warn;
      case LogLevel.INFO:
        return console.info;
      case LogLevel.DEBUG:
      default:
        return console.log;
    }
  }

  /**
   * Generic log method
   */
  private log(level: LogLevel, message: string, context?: LogContext): void {
    if (!this.enableConsoleLog) {
      return;
    }

    // Only log errors and warnings by default
    // Other levels require verbose mode or development environment
    const shouldLog =
      level === LogLevel.ERROR ||
      level === LogLevel.WARN ||
      this.verboseLogging ||
      (this.isDevelopment && level === LogLevel.INFO);

    if (!shouldLog) {
      return;
    }

    const consoleMethod = this.getConsoleMethod(level);

    // Simplified output - only show full context if verbose
    if (this.verboseLogging) {
      const formattedMessage = this.formatMessage(level, message, context);
      consoleMethod(formattedMessage);
      if (context) {
        consoleMethod('Full context:', context);
      }
    } else {
      // Concise output for normal mode
      consoleMethod(`[${level}] ${message}`);
      if (context && level === LogLevel.ERROR) {
        // Only show minimal context for errors
        const { issue, statusCode, errorMessage } = context;
        if (issue || statusCode || errorMessage) {
          consoleMethod({ issue, statusCode, errorMessage });
        }
      }
    }

    // In production, send errors to logging service
    if (!this.isDevelopment && level === LogLevel.ERROR) {
      this.sendToLoggingService(level, message, context);
    }
  }

  /**
   * Send logs to external logging service (implement as needed)
   */
  private sendToLoggingService(level: LogLevel, message: string, context?: LogContext): void {
    // TODO: Implement external logging service integration (e.g., Sentry, LogRocket, etc.)
    // Example:
    // Sentry.captureMessage(message, {
    //   level: level.toLowerCase() as SeverityLevel,
    //   extra: context,
    // });
  }

  /**
   * Debug level logging
   */
  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Info level logging
   */
  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Warning level logging
   */
  warn(message: string, context?: LogContext): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Error level logging
   */
  error(message: string, context?: LogContext): void {
    this.log(LogLevel.ERROR, message, context);
  }

  /**
   * Log API errors with detailed information
   */
  apiError(endpoint: string, error: any, requestData?: any): void {
    const context: LogContext = {
      endpoint,
      requestData,
      errorType: error.name || 'Unknown',
      errorMessage: error.message,
    };

    // Network errors
    if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
      context.networkError = true;
      context.errorDetails = 'Network connection failed or timed out';

      if (error.config?.baseURL) {
        context.targetUrl = `${error.config.baseURL}${endpoint}`;
      }
    }

    // HTTP errors
    if (error.response) {
      context.statusCode = error.response.status;
      context.statusText = error.response.statusText;
      context.responseData = error.response.data;
      context.headers = error.response.headers;
    }

    // Request configuration
    if (error.config) {
      context.method = error.config.method?.toUpperCase();
      context.timeout = error.config.timeout;
      context.baseURL = error.config.baseURL;
    }

    this.error(`API Request Failed: ${endpoint}`, context);
  }

  /**
   * Log authentication errors with specific troubleshooting info
   */
  authError(action: string, error: any, additionalInfo?: any): void {
    const context: LogContext = {
      action,
      additionalInfo,
    };

    // Check if BFF is reachable
    if (error.code === 'ERR_NETWORK' || !error.response) {
      context.issue = 'BFF_UNREACHABLE';
      context.possibleCauses = [
        'BFF service is not running',
        'Incorrect BFF URL configuration',
        'Network connectivity issues',
        'CORS policy blocking request',
      ];
      context.troubleshooting = [
        'Check if BFF is running on the configured port',
        'Verify REACT_APP_BFF_API_URL environment variable',
        'Check browser network tab for failed requests',
        'Check browser console for CORS errors',
      ];
    } else if (error.response?.status === 401) {
      context.issue = 'AUTHENTICATION_FAILED';
      context.possibleCauses = ['Invalid credentials', 'User account is inactive', 'Auth service is not responding'];
    } else if (error.response?.status === 502 || error.response?.status === 503) {
      context.issue = 'BACKEND_SERVICE_DOWN';
      context.possibleCauses = ['Auth service is not running', 'BFF cannot connect to auth service'];
    } else if (error.response?.status === 500) {
      context.issue = 'INTERNAL_SERVER_ERROR';
      context.serverError = error.response?.data;
    }

    this.error(`Authentication Error: ${action}`, context);
  }

  /**
   * Log navigation/routing events
   */
  navigation(from: string, to: string, reason?: string): void {
    this.info('Navigation', { from, to, reason });
  }

  /**
   * Log user actions for debugging
   */
  userAction(action: string, details?: any): void {
    this.debug('User Action', { action, details });
  }

  /**
   * Log performance metrics
   */
  performance(metric: string, duration: number, context?: LogContext): void {
    this.info(`Performance: ${metric}`, { duration, ...context });
  }
}

// Export singleton instance
export const logger = new Logger();

export default logger;
