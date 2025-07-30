import { newApp } from "./app"

const app = newApp()

app.get("/session", async ctx => {
  const result = await ctx.var.models.auth.findUserSession("token-123")
  return ctx.json({ session: null, result }, 200)
})

export const authRoutes = app
