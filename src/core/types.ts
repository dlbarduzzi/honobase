import type { Hono } from "hono"
import type { Logger } from "winston"

type AppEnv = {
  Variables: {
    logger: Logger
  }
}

type App = Hono<AppEnv>

export {
  type App,
  type AppEnv,
}
