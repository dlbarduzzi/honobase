import type { App, AppEnv } from "./types"

import { Hono } from "hono"
import { requestId } from "hono/request-id"

import { db } from "@/db/connect"

import { log, logRequest } from "./log"
import { internalServerError, notFoundError, safeError } from "./error"

import { AuthModel } from "./auth-model"
import { UserModel } from "./user-model"

function newApp() {
  return new Hono<AppEnv>({ strict: false })
}

function bootstrap(app: App) {
  app.use("*", requestId())

  app.use("*", async (ctx, next) => {
    ctx.set("logger", log)

    ctx.set("models", {
      auth: new AuthModel(db),
      user: new UserModel(db),
    })

    await next()
  })

  app.use("*", logRequest)

  app.notFound(() => {
    return notFoundError()
  })

  app.onError((err, ctx) => {
    const { message, cause, stack } = safeError(err)

    ctx.var.logger.error("GLOBAL_ERROR", message, {
      cause,
      stack,
    })

    return internalServerError()
  })
}

export { bootstrap, newApp }
