import { index, remove } from "../actions"

export async function MembershipList() {
  const memberships = await index()

  return (
    <div>
      <ul>
        {memberships.map((membership) => (
          <li key={membership.id}>
            {membership.user?.first_name} {membership.user?.last_name}
            <form noValidate>
              <input type="hidden" name="id" value={membership.id} />
              <button type="submit" formAction={remove}>
                Remove
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  )
}
