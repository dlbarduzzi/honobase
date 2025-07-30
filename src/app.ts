import { authRoutes } from "@/core/auth-api"
import { bootstrap, newApp } from "@/core/app"

const app = newApp()
bootstrap(app)

app.route("/api/v1/auth", authRoutes)

export { app }
