import type { JSX } from "react"

import { Resend } from "resend"

import { env } from "@/core/env"
import { delay } from "@/core/lib"

const resend = new Resend(env.RESEND_API_KEY)

type EmailParams = {
  from: string
  recipients: string[]
  subject: string
  template: JSX.Element
}

async function sendEmail({
  from,
  recipients,
  subject,
  template,
}: EmailParams) {
  return await resend.emails.send({
    from,
    to: recipients,
    subject,
    react: template,
  })
}

async function sendEmailWithRetries(params: EmailParams) {
  let attempt = 1
  const maxAttempts = 3

  while (attempt <= maxAttempts) {
    const result = await sendEmail(params)

    if (attempt >= maxAttempts) {
      return result
    }

    if (result.error) {
      attempt++
      await delay(2000)
      continue
    }

    return result
  }
}

export { sendEmail, sendEmailWithRetries }
