import type { StatusCode } from "@/tools/http/status"

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

export {
  badRequestError,
  internalServerError,
  invalidPayloadError,
  invalidRequestError,
  notFoundError,
  unprocessableEntityError,
}
