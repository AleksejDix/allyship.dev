import { signOut } from "@/features/user/actions/user-actions"

export function SignoutButton() {
  return (
    <form>
      <button formAction={signOut}>Sign out</button>
    </form>
  )
}
