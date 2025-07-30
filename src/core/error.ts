import type { AppContext } from "./types"
import type { StatusCode } from "@/tools/http/status"

import { env } from "./data"
import { http } from "@/tools/http/status"

function newApiError(status: StatusCode, message: string) {
  return Response.json({
    status,
    message,
  }, {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

function notFoundError() {
  return newApiError(
    http.StatusNotFound,
    "The requested resource was not found.",
  )
}

function internalServerError(ctx: AppContext, error: Error) {
  if (env.NODE_ENV === "development") {
    console.error(error)
  }

  ctx.var.logger.error(error.name, {
    scope: "global",
    status: "server_error",
  })

  return newApiError(
    http.StatusInternalServerError,
    "Something went wrong while processing your request.",
  )
}

export { internalServerError, notFoundError }
