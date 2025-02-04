import { Metadata } from "next"
import { UserResetPasswordForEmail } from "@/features/user/components/user-reset-password-for-email"

export const generateMetadata = (): Metadata => {
  return {
    title: "Reset Your Password | Allyship.dev", // Overrides the default title
    description:
      "Forgot your password? Enter your email address to reset your password and regain access to Allyship.dev's accessibility courses, QA services, and tools.",
  }
}

export default function LoginPage() {
  return (
    <div className="container max-w-md py-6">
      <UserResetPasswordForEmail />
    </div>
  )
}
