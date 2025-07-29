import { describe, expect, it } from "vitest"
import { newApiError, newInternalServerError, newNotFoundError } from "./error"

describe("api error", () => {
  it("should return message from status code", () => {
    const resp = newApiError(400, "", "")
    expect(resp.data).toBeUndefined()
    expect(resp.status).toBe(400)
    expect(resp.message).toBe("Bad Request.")
  })
})

describe("not found error", () => {
  it("should return default message", () => {
    const resp = newNotFoundError("", "")
    expect(resp.data).toBeUndefined()
    expect(resp.status).toBe(404)
    expect(resp.message).toBe("The requested resource was not found.")
  })
  it("should return custom message", () => {
    const resp = newNotFoundError("Resource not found.", "")
    expect(resp.data).toBeUndefined()
    expect(resp.status).toBe(404)
    expect(resp.message).toBe("Resource not found.")
  })
  it("should return data string in object", () => {
    const resp = newNotFoundError("", "Hello, world.")
    expect(resp.status).toBe(404)
    expect(resp.data).toBe("Hello, world.")
  })
})

describe("internal server error", () => {
  it("should return default message", () => {
    const resp = newInternalServerError("", "")
    expect(resp.data).toBeUndefined()
    expect(resp.status).toBe(500)
    expect(resp.message).toBe("Something went wrong while processing your request.")
  })
  it("should return custom message", () => {
    const resp = newInternalServerError("Server error.", "")
    expect(resp.data).toBeUndefined()
    expect(resp.status).toBe(500)
    expect(resp.message).toBe("Server error.")
  })
  it("should return data string in object", () => {
    const resp = newInternalServerError("", "Hello, world.")
    expect(resp.status).toBe(500)
    expect(resp.data).toBe("Hello, world.")
  })
})
