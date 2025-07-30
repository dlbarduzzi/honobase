import type { App, AppEnv } from "./types"

import { Hono } from "hono"
import { requestId } from "hono/request-id"

import { db } from "@/db/connect"
import { logger } from "@/tools/logger"

import { env } from "./data"
import { loggerMiddleware } from "./logger"
import { internalServerError, notFoundError } from "./error"

import { AuthModel } from "./auth-model"
import { UserModel } from "./user-model"

function newApp() {
  return new Hono<AppEnv>({ strict: false })
}

function bootstrap(app: App) {
  app.use("*", requestId())

  app.use("*", async (ctx, next) => {
    ctx.set("logger", logger)
    ctx.set("models", {
      auth: new AuthModel(db),
      user: new UserModel(db),
    })
    await next()
  })

  app.use("*", loggerMiddleware)

  app.notFound(() => {
    return notFoundError()
  })

  app.onError((err, ctx) => {
    if (env.NODE_ENV === "development") {
      console.error(err)
    }

    ctx.var.logger.error(err.name, {
      scope: "global",
      status: "server_error",
    })

    return internalServerError()
  })
}

export { bootstrap, newApp }
