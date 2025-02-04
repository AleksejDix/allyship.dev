import { Metadata } from "next"
import { UserLoginForm } from "@/features/user/components/user-login-form"

export const generateMetadata = (): Metadata => {
  return {
    title: "Log in to Your QA & Accessibility Dashboard", // Overrides the default title
    description:
      "Securely log in to Allyship.dev to access comprehensive courses, professional QA services, and advanced tools for accessibility audits and end-to-end testing.",
  }
}

export default function LoginPage() {
  return (
    <div className="container max-w-md py-6">
      <UserLoginForm />
    </div>
  )
}
