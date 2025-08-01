import type { UserSchema } from "@/db/schemas"

import z from "zod"

import { newApp } from "./app"
import { logSafeError } from "./log"
import { registerSchema } from "./auth-schema"

import {
  internalServerError,
  invalidRequestError,
  invalidPayloadError,
  unprocessableEntityError,
} from "./error"

import { hashPassword } from "@/tools/crypto/password"

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

    logSafeError({
      error,
      status: "AUTH_REGISTER_ERROR",
      message: "json parse request body failed",
    })

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
    logSafeError({
      error,
      status: "AUTH_REGISTER_ERROR",
      message: "db query to find user by email failed",
    })
    return internalServerError()
  }

  if (user != null) {
    return unprocessableEntityError("This email is already registered")
  }

  const hash = await hashPassword(parsed.data.password)
  console.warn({ hash })

  return ctx.json({ registered: true }, 201)
})

export const authRoutes = app
