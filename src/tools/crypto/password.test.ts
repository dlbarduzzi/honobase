import { describe, it, expect, beforeAll } from "vitest"
import { hashPassword, verifyPassword } from "./password"

describe.sequential("password hashing and verification", async () => {
  let hash = ""
  const password = "testPassword"

  // Need this to prevent timing issue while hashing and then verifying password.
  beforeAll(async () => {
    hash = await hashPassword(password)
  })

  it("should hash and verify valid password", async () => {
    expect(hash).toMatch(/^[a-f0-9]{32}:[a-f0-9]+$/)

    const isValid = await verifyPassword(hash, password)
    expect(isValid).toBe(true)
  })

  it("should fail verification with incorrect password", async () => {
    const newPassword = "newPassword"
    const isValid = await verifyPassword(hash, newPassword)
    expect(isValid).toBe(false)
  })

  it("should return false on malformed hash (missing colon)", async () => {
    const isValid = await verifyPassword("notavalidhash", "irrelevant")
    expect(isValid).toBe(false)
  })

  it("should generate different hashes for the same password", async () => {
    const hash = await hashPassword("repeatable")
    const newHash = await hashPassword("repeatable")
    expect(hash).not.toEqual(newHash)
  })
})
