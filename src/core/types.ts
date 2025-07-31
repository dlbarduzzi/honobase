import type { Context, Hono } from "hono"

import type { Log } from "./log"

import type { AuthModel } from "./auth-model"
import type { UserModel } from "./user-model"

type AppEnv = {
  Variables: {
    logger: Log
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
