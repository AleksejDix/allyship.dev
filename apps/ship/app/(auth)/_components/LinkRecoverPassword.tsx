import { RouterLink } from "@/components/RouterLink"

export const LinkRecoverPassword = () => {
  return (
    <RouterLink
      href="/auth/recover-password"
      className="underline underline-offset-4"
    >
      Recover Password
    </RouterLink>
  )
}
