import type { App, AppEnv } from "./types"

import { Hono } from "hono"
import { requestId } from "hono/request-id"

import { db } from "@/db/connect"
import { logger } from "@/tools/logger"

import { loggerMiddleware } from "./logger"
import { internalServerError, notFoundError } from "./error"

import { AuthModel } from "./auth-model"

function newApp() {
  return new Hono<AppEnv>({ strict: false })
}

function bootstrap(app: App) {
  app.use("*", requestId())

  app.use("*", async (ctx, next) => {
    ctx.set("logger", logger)
    ctx.set("models", { auth: new AuthModel(db) })
    await next()
  })

  app.use("*", loggerMiddleware)

  app.notFound(() => {
    return notFoundError()
  })

  app.onError((err, ctx) => {
    return internalServerError(ctx, err)
  })
}

export { bootstrap, newApp }
