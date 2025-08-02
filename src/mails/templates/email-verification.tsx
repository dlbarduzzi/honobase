import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"

import { APP_NAME } from "@/core/config"

type EmailVerificationProps = {
  username: string
  verificationURL: string
}

export function EmailVerification({
  username,
  verificationURL,
}: EmailVerificationProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="m-auto bg-white px-2 font-sans">
          <Preview>Account Verification</Preview>
          <Container
            className="mx-auto my-[40px] max-w-[465px] rounded
              border border-solid border-gray-200 p-[20px]"
          >
            <Section className="mt-[32px]">
              <Container style={{
                width: "40px",
                height: "40px",
                backgroundColor: "black",
                borderRadius: "100%",
              }}
              />
            </Section>
            <Heading
              className="mx-0 my-[30px] p-0 text-center text-[24px]
                font-normal text-black"
            >
              Welcome to
              {" "}
              <strong>{APP_NAME}</strong>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello
              {" "}
              <span className="font-semibold">{username}</span>
              ,
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Thank you for joining
              {" "}
              {APP_NAME}
              !
              {" "}
              To activate your account, please click the verification link below:
            </Text>
            <Section className="my-[32px]">
              <Button
                href={verificationURL}
                className="rounded bg-[#000000] px-5 py-3 text-center text-[14px]
                  font-semibold text-white no-underline"
              >
                Verify my account
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              or copy and paste this URL into your browser:
              {" "}
              <Link
                href={verificationURL}
                className="text-[12px] text-blue-600 no-underline"
              >
                {verificationURL}
              </Link>
            </Text>
            <Hr
              className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]"
            />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              This invitation was intended for
              {" "}
              <span className="text-black">{username}</span>
              . If you were not expecting
              this invitation, you can ignore this email. If you are concerned about
              your account's safety, please reply to this email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
