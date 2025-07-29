import type { Logger } from "winston"
import type { Context, Hono } from "hono"

type AppEnv = {
  Variables: {
    logger: Logger
  }
}

type App = Hono<AppEnv>
type AppContext = Context<AppEnv>

export {
  type App,
  type AppContext,
  type AppEnv,
}
