import type { AppContext } from "./types"

import { newNotFoundError } from "@/tools/router/error"

function notFoundError(ctx: AppContext, message: string, rawError: unknown) {
  const resp = newNotFoundError(message, rawError)
  return ctx.json(resp, resp.status)
}

export { notFoundError }
