import type { UserSchema } from "@/db/schemas"

import z from "zod"

import { newApp } from "./app"
import { logSafeError } from "./logger"
import { registerSchema } from "./auth-schema"

import {
  internalServerError,
  invalidRequestError,
  invalidPayloadError,
  unprocessableEntityError,
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
      logSafeError(ctx, error, error.message)
    }

    return internalServerError()
  }

  const parsed = registerSchema.safeParse(input)

  if (!parsed.success) {
    return invalidPayloadError(z.treeifyError(parsed.error).properties)
  }

  let user: UserSchema | undefined

  try {
    user = await ctx.var.models.user.findUserByEmail(parsed.data.email)
  }
  catch (error) {
    logSafeError(ctx, error, "db query to find user by email failed")
    return internalServerError()
  }

  if (user != null) {
    return unprocessableEntityError("This email is already registered")
  }

  return ctx.json({ registered: true }, 201)
})

export const authRoutes = app
