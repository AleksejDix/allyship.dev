import { type LogLevel } from "@prisma/client"

type LogContext = Record<string, unknown>

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: LogContext
  error?: {
    message: string
    stack?: string
  }
}

export function logError(message: string, context?: LogContext) {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: "ERROR",
    message,
    context,
  }

  // In development, log to console
  if (process.env.NODE_ENV === "development") {
    console.error(entry)
  }

  // TODO: In production, we could send this to a proper logging service
  // For now, we'll just console.log in production too
  console.error(entry)
}

export function logInfo(message: string, context?: LogContext) {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: "INFO",
    message,
    context,
  }

  if (process.env.NODE_ENV === "development") {
    console.log(entry)
  }

  // TODO: In production, we could send this to a proper logging service
  console.log(entry)
}

export function logWarning(message: string, context?: LogContext) {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: "WARN",
    message,
    context,
  }

  if (process.env.NODE_ENV === "development") {
    console.warn(entry)
  }

  // TODO: In production, we could send this to a proper logging service
  console.warn(entry)
}

export function logDebug(message: string, context?: LogContext) {
  // Only log debug in development
  if (process.env.NODE_ENV !== "development") {
    return
  }

  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: "DEBUG",
    message,
    context,
  }

  console.debug(entry)
}
