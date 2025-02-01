import { signOut } from "@/features/user/actions/user-actions"

export function SignoutButton() {
  return (
    <button className="w-full" formAction={signOut}>
      Sign out
    </button>
  )
}
