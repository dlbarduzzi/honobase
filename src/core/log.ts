import type { MiddlewareHandler } from "hono"

import { safeError } from "./error"
import { logger } from "@/tools/logger"

type Status =
  | "REQUEST_DETAILS"
  | "EMAIL_VERIFICATION_SUCCESS"

type StatusError =
  | "GLOBAL_ERROR"
  | "AUTH_REGISTER_ERROR"
  | "AUTH_VERIFY_EMAIL_ERROR"
  | "EMAIL_VERIFICATION_ERROR"

type Options = { [key: string]: unknown }

const log = {
  debug: (status: Status, message: string, opts?: Options) => {
    logger.debug(message, { status, ...opts })
  },
  info: (status: Status, message: string, opts?: Options) => {
    logger.info(message, { status, ...opts })
  },
  warn: (status: Status, message: string, opts?: Options) => {
    logger.warn(message, { status, ...opts })
  },
  error: (status: StatusError, message: string, opts?: Options) => {
    logger.error(message, { status, ...opts })
  },
}

const logRequest: MiddlewareHandler = async (ctx, next) => {
  const startTime = performance.now()
  await next()

  const endTime = performance.now()

  const duration = `${Math.round(endTime - startTime)}ms`
  const requestId = ctx.get("requestId")

  const { status } = ctx.res
  const { path, method } = ctx.req

  log.info("REQUEST_DETAILS", "request details", {
    request: { id: requestId, path, method, status, duration },
  })
}

function logSafeError({ error, status, message }: {
  error: unknown
  status: StatusError
  message: string
}) {
  const err = safeError(error, message)
  log.error(status, err.message, { cause: err.cause, stack: err.stack })
}

type Log = typeof log

export { log, type Log, logRequest, logSafeError }
