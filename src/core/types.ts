import type { Logger } from "winston"
import type { Context, Hono } from "hono"

import type { AuthModel } from "./auth-model"

type AppEnv = {
  Variables: {
    logger: Logger
    models: {
      auth: AuthModel
    }
  }
}

type App = Hono<AppEnv>
type AppContext = Context<AppEnv>

export {
  type App,
  type AppContext,
  type AppEnv,
}
