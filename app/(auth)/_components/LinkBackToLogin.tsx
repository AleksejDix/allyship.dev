import Link from "next/link"

export const LinkBackToLogin = () => {
  return (
    <Link href="/auth/login" className="underline underline-offset-4">
      Back to Login
    </Link>
  )
}
