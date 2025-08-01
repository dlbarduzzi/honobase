import type { DB } from "@/db/connect"

import { passwords, users } from "@/db/schemas"

import { lowercase } from "@/tools/strings"
import { hashPassword } from "@/tools/crypto/password"

class AuthModel {
  private readonly db: DB

  constructor(db: DB) {
    this.db = db
  }

  public async createUser(email: string, password: string) {
    return await this.db.transaction(async tx => {
      const [user] = await tx
        .insert(users)
        .values({ email: lowercase(email), isEmailVerified: false })
        .returning()

      if (user == null) {
        return tx.rollback()
      }

      const hash = await hashPassword(password)

      const [passwordId] = await tx
        .insert(passwords)
        .values({ hash, userId: user.id })
        .returning({ id: passwords.id })

      if (passwordId == null) {
        return tx.rollback()
      }

      return user
    })
  }
}

export { AuthModel }
