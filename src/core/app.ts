import type { App, AppEnv } from "./types"

import { Hono } from "hono"
import { requestId } from "hono/request-id"

import { logger } from "@/tools/logger"

function newApp() {
  return new Hono<AppEnv>({ strict: false })
}

function bootstrap(app: App) {
  app.use("*", requestId())

  app.use("*", async (ctx, next) => {
    ctx.set("logger", logger)
    await next()
  })
}

export { bootstrap, newApp }
