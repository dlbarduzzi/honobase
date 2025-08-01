import type { StatusCode } from "@/tools/http/status"

import { env } from "./env"

import { http } from "@/tools/http/status"
import { toSentence } from "@/tools/inflector"

function newApiError(status: StatusCode, message: string, rawError?: unknown) {
  return Response.json({
    status,
    message,
    details: rawError,
  }, {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

function badRequestError(message: string) {
  message = message.trim()

  if (message === "") {
    message = http.StatusText(http.StatusBadRequest)
  }

  return newApiError(http.StatusBadRequest, toSentence(message))
}

function notFoundError() {
  return newApiError(
    http.StatusNotFound,
    toSentence("The requested resource was not found"),
  )
}

function unprocessableEntityError(message: string) {
  message = message.trim()

  if (message === "") {
    message = http.StatusText(http.StatusUnprocessableEntity)
  }

  return newApiError(http.StatusUnprocessableEntity, toSentence(message))
}

function internalServerError() {
  return newApiError(
    http.StatusInternalServerError,
    toSentence("Something went wrong while processing your request"),
  )
}

function invalidRequestError() {
  return badRequestError("Invalid JSON request")
}

function invalidPayloadError<T>(error: T) {
  return newApiError(
    http.StatusBadRequest,
    toSentence("Invalid JSON payload"),
    error,
  )
}

// safeError avoids Logging Full Stack Traces from Uncaught Errors.
//
// Logging full stack traces for uncaught errors can introduce security risks,
// particularly if the error involves sensitive operations such as database
// interactions. Unhandled exceptions may expose confidential information including
// user data, credentials, tokens, or other internal system details.
//
// To mitigate this, use this helper check to control error visibility:
// During development, enable stack traces to aid debugging.
// In production, only enable stack traces temporarily and purposefully when
// troubleshooting specific issues. Always disable them immediately after diagnosis
// to prevent potential data leakage.
function safeError(error: unknown, message?: string) {
  message = message?.trim() ?? ""

  if (message === "") {
    message = "uncaught exception"
  }

  const err: { cause?: unknown, stack?: unknown, message: string } = {
    cause: undefined,
    stack: undefined,
    message,
  }

  if (!(error instanceof Error)) {
    return err
  }

  let errorMessage = error.message.trim()

  if (errorMessage !== "") {
    errorMessage = ` - ${errorMessage}`
  }

  if (env.NODE_ENV === "development" || env.IS_LOG_STACK_ALLOWED) {
    err.cause = error.cause
    err.stack = error.stack
    err.message = `${message}${errorMessage}`
  }

  return err
}

export {
  badRequestError,
  internalServerError,
  invalidPayloadError,
  invalidRequestError,
  notFoundError,
  safeError,
  unprocessableEntityError,
}
