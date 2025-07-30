import type { Logger } from "winston"
import type { Context, Hono } from "hono"

import type { AuthModel } from "./auth-model"
import type { UserModel } from "./user-model"

type AppEnv = {
  Variables: {
    logger: Logger
    models: {
      auth: AuthModel
      user: UserModel
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
