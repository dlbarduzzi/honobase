import type { AppContext } from "./types"
import type { MiddlewareHandler } from "hono"

import { DrizzleQueryError } from "drizzle-orm"

import { logger } from "@/tools/logger"
import { getIpAddress } from "./request"

const loggerMiddleware: MiddlewareHandler = async (ctx, next) => {
  const startTime = performance.now()
  await next()

  const endTime = performance.now()
  const duration = Math.round(endTime - startTime)

  const request = ctx.req
  const headers = request.header()

  logger.info("request details", {
    id: ctx.get("requestId"),
    status: ctx.res.status,
    path: request.path,
    method: request.method,
    referer: headers.referer ?? "",
    ipAddress: getIpAddress(request.raw) ?? "",
    userAgent: headers["user-agent"] ?? "",
    duration,
  })
}

function logSafeError(ctx: AppContext, error: unknown, message: string) {
  const safeError = {
    cause: undefined as unknown,
    stack: undefined as unknown,
    message,
  }

  switch (true) {
    case error instanceof DrizzleQueryError:
      safeError.cause = error.cause
      break
    case error instanceof Error:
      safeError.cause = error.cause
      safeError.stack = error.stack
      break
  }

  ctx.var.logger.error(safeError.message, {
    cause: safeError.cause,
    stack: safeError.stack,
  })
}

export { loggerMiddleware, logSafeError }
