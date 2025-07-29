import type { App, AppEnv } from "./types"

import { Hono } from "hono"
import { requestId } from "hono/request-id"

import { logger } from "@/tools/logger"
import { notFoundError } from "./event"

function newApp() {
  return new Hono<AppEnv>({ strict: false })
}

function bootstrap(app: App) {
  app.use("*", requestId())

  app.use("*", async (ctx, next) => {
    ctx.set("logger", logger)
    await next()
  })

  app.notFound(ctx => {
    return notFoundError(ctx, "", "")
  })
}

export { bootstrap, newApp }
