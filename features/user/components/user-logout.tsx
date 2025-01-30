import { signout } from "@/features/user/actions/user-actions"

export function SignoutButton() {
  return (
    <form>
      <button formAction={signout}>Sign out</button>
    </form>
  )
}
