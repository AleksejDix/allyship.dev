import { notFound } from "next/navigation"
import { getUserSpaces } from "@/features/userSpace/actions"
import { UserSpaceIndex } from "@/features/userSpace/components/user-space-index"

export default async function Page() {
  const { data } = await getUserSpaces()

  if (!data) {
    notFound()
  }

  return <UserSpaceIndex spaces={data} />
}
