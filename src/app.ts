import { bootstrap, newApp } from "@/core/app"

const app = newApp()
bootstrap(app)

app.get("/test", ctx => {
  return ctx.text("Hello, there!")
})

export { app }
