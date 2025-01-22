import { signout } from "@/app/(auth)/_actions"

export function SignoutButton() {
  return (
    <form>
      <button formAction={signout}>Sign out</button>
    </form>
  )
}
