import type { UserSchema } from "@/db/schemas"
import type { JWTVerifyResult, JWTPayload } from "jose"

import z from "zod"

import { jwtVerify } from "jose"
import { JWTExpired } from "jose/errors"

import { env } from "./env"
import { jwt } from "./security"
import { newApp } from "./app"
import { logSafeError } from "./log"
import { registerSchema } from "./auth-schema"

import {
  internalServerError,
  invalidRequestError,
  invalidPayloadError,
  unprocessableEntityError,
  unauthorized,
} from "./error"

import { http } from "@/tools/http/status"
import { toSentence } from "@/tools/inflector"
import { sendEmailVerification } from "@/mails/email-verification"

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

  const { email, password } = parsed.data

  try {
    user = await ctx.var.models.auth.createUser(email, password)
  }
  catch (error) {
    logSafeError({
      error,
      status: "AUTH_REGISTER_ERROR",
      message: "db query to create user failed",
    })
    return internalServerError()
  }

  const token = await jwt(env.JWT_AUTH_SECRET).sign({ email: user.email }, 900)
  sendEmailVerification(user.email, token)

  const status = http.StatusCreated

  return ctx.json(
    {
      user,
      status,
      message: toSentence("Please check your email to verify account"),
    },
    status,
  )
})

app.get("/email-verification", async ctx => {
  const token = ctx.req.query("token")
  if (!token) {
    return unauthorized("Missing token")
  }

  let jwt: JWTVerifyResult<JWTPayload>

  try {
    jwt = await jwtVerify(
      token,
      new TextEncoder().encode(env.JWT_AUTH_SECRET),
      {
        algorithms: ["HS256"],
      },
    )
  }
  catch (error) {
    if (error instanceof JWTExpired) {
      return unauthorized("Token expired")
    }
    else {
      return unauthorized("Invalid token")
    }
  }

  const schema = z.object({ email: z.email() })
  const parsed = schema.safeParse(jwt.payload)

  if (!parsed.success) {
    return unauthorized("Invalid JWT payload")
  }

  let user: UserSchema | undefined
  const { email } = parsed.data

  try {
    user = await ctx.var.models.user.findUserByEmail(email)
  }
  catch (error) {
    logSafeError({
      error,
      status: "AUTH_VERIFY_EMAIL_ERROR",
      message: "db query to find user by email failed",
    })
    return internalServerError()
  }

  if (user == null) {
    return unprocessableEntityError("User with this email was not found")
  }

  try {
    const [updatedUser] = await ctx.var.models.user.updateUserByEmail(email)

    if (updatedUser == null) {
      throw new Error("updated user returned null value")
    }

    user = updatedUser
  }
  catch (error) {
    logSafeError({
      error,
      status: "AUTH_VERIFY_EMAIL_ERROR",
      message: "db query to update user by email failed",
    })
    return internalServerError()
  }

  const status = http.StatusOk

  return ctx.json(
    {
      user,
      status,
      message: "Email verified successfully! Please login.",
    },
    status,
  )
})

export const authRoutes = app
