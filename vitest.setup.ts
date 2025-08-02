/* eslint-disable node/no-process-env */
process.env.LOG_LEVEL = "silent"
process.env.APP_URL = "http://localhost:3000"
process.env.APP_PORT = "3000"
process.env.DATABASE_URL = "postgresql://test_user:test_pass@localhost:5432/test_db"
process.env.IS_LOG_STACK_ALLOWED = "false"
process.env.RESEND_API_KEY = "test-api-key"
process.env.APP_EMAIL_ONBOARDING = "test@email.com"
/* eslint-enable node/no-process-env */
