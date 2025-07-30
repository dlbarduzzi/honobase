import type { AppContext } from "./types"
import type { StatusCode } from "@/tools/http/status"

import { env } from "./data"
import { http } from "@/tools/http/status"

class ApiError extends Error {
  public log: string
  constructor(message: string, { log }: { log: string }) {
    super(message)
    this.log = log
  }
}

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

  if (error instanceof ApiError) {
    ctx.var.logger.error(error.log)
  }

  return newApiError(
    http.StatusInternalServerError,
    "Something went wrong while processing your request.",
  )
}

export { ApiError, internalServerError, notFoundError }
