import z from "zod"

import { newApp } from "./app"
import { registerSchema } from "./auth-schema"

import {
  internalServerError,
  invalidRequestError,
  invalidPayloadError,
} from "./error"

const app = newApp()

app.post("/register", async ctx => {
  let input: unknown

  try {
    input = await ctx.req.json()
  }
  catch (error) {
    if (error instanceof SyntaxError) {
      return invalidRequestError()
    }

    if (error instanceof Error) {
      ctx.var.logger.error(error.message, { cause: error.cause, stack: error.stack })
    }

    return internalServerError()
  }

  const parsed = registerSchema.safeParse(input)

  if (!parsed.success) {
    return invalidPayloadError(z.treeifyError(parsed.error).properties)
  }

  return ctx.json({ registered: true }, 201)
})

export const authRoutes = app
