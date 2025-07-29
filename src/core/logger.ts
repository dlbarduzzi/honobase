import type { MiddlewareHandler } from "hono"

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

export { loggerMiddleware }
