import type { DB } from "@/db/connect"

class AuthModel {
  private readonly db: DB

  constructor(db: DB) {
    this.db = db
  }
}

export { AuthModel }
