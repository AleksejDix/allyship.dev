import { Metadata } from "next"
import { UserSignupForm } from "@/features/user/components/user-signup-form"

export const generateMetadata = (): Metadata => {
  return {
    title: "Sign up for Allyship.dev | Join Us Today", // Overrides the default title
    description:
      "Create your free account on Allyship.dev to access comprehensive accessibility courses, professional QA services, and advanced tools for end-to-end testing.",
  }
}

export default function LoginPage() {
  return (
    <div className="container max-w-md py-6">
      <UserSignupForm />
    </div>
  )
}
