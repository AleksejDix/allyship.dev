import Link from "next/link"

export const LinkRecoverPassword = () => {
  return (
    <Link
      href="/auth/recover-password"
      className="underline underline-offset-4 "
    >
      Recover Password
    </Link>
  )
}
