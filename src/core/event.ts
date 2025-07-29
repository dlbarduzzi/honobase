import type { AppContext } from "./types"

import { newInternalServerError, newNotFoundError } from "@/tools/router/error"

function notFoundError(ctx: AppContext) {
  const resp = newNotFoundError("", "")
  return ctx.json(resp, resp.status)
}

function internalServerError(ctx: AppContext, err: Error) {
  ctx.var.logger.error(err.message, {
    cause: err.cause,
    stack: err.stack,
  })
  const resp = newInternalServerError("", undefined)
  return ctx.json(resp, resp.status)
}

export { internalServerError, notFoundError }
