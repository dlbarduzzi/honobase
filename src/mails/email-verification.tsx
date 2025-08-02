import { env } from "@/core/env"
import { log } from "@/core/log"

import { APP_NAME } from "@/core/config"

import { sendEmailWithRetries } from "./base"
import { EmailVerification } from "./templates/email-verification"

async function sendEmailVerification(email: string, token: string) {
  const url = new URL("/api/v1/auth/email-verification", env.APP_URL)
  url.searchParams.append("token", token)

  const username = email.split("@")[0] ?? email
  const verificationURL = url.toString()

  const result = await sendEmailWithRetries({
    from: `${APP_NAME} <${env.APP_EMAIL_ONBOARDING}>`,
    recipients: [email],
    subject: "Confirm you email address",
    template: EmailVerification({ username, verificationURL }),
  })

  if (!result) return

  if (result.error) {
    log.error("EMAIL_VERIFICATION_ERROR", "send email verification failed", {
      error: { ...result.error },
      email,
    })
  }
  else {
    log.info("EMAIL_VERIFICATION_SUCCESS", "email verification sent successfully", {
      data: { ...result.data },
      email,
    })
  }
}

export { sendEmailVerification }
