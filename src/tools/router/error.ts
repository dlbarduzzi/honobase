import type { StatusCode } from "@/tools/http/status"

import { http } from "@/tools/http/status"
import { toSentence } from "@/tools/inflector"

type ApiError = {
  data: unknown
  status: StatusCode
  message: string
}

function newApiError(status: StatusCode, message: string, rawError: unknown): ApiError {
  if (message === "") {
    message = http.StatusText(status)
  }

  let data: unknown

  if (typeof rawError === "string") {
    data = rawError.trim()
    data = rawError === "" ? undefined : rawError
  }

  return {
    data,
    status,
    message: toSentence(message),
  }
}

function newNotFoundError(message: string, rawError: unknown): ApiError {
  if (message === "") {
    message = "The requested resource was not found."
  }
  return newApiError(http.StatusNotFound, message, rawError)
}

function newInternalServerError(message: string, rawError: unknown): ApiError {
  if (message === "") {
    message = "Something went wrong while processing your request."
  }
  return newApiError(http.StatusInternalServerError, message, rawError)
}

export { newApiError, newInternalServerError, newNotFoundError }
