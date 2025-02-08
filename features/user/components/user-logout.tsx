import { signOut } from "@/features/user/actions/user-actions"

export function SignoutButton() {
  return (
    <form noValidate>
      <button className="w-full text-left" formAction={signOut}>
        Sign out
      </button>
    </form>
  )
}
