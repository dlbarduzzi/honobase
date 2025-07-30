import type { DB } from "@/db/connect"
import type { SessionSchema, UserSchema } from "@/db/schemas"

import { eq } from "drizzle-orm"
import { sessions } from "@/db/schemas"

class AuthModel {
  private readonly db: DB

  constructor(db: DB) {
    this.db = db
  }

  public async findUserSession(token: string): Promise<{
    user: UserSchema
    session: SessionSchema
  } | null> {
    const result = await this.db.query.sessions.findFirst({
      where: eq(sessions.token, token),
      with: { user: true },
    })

    if (!result) {
      return null
    }

    const { user, ...session } = result

    if (!user) {
      return null
    }

    return { user, session }
  }
}

export { AuthModel }
