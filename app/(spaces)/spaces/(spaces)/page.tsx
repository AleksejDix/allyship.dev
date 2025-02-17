import { notFound } from "next/navigation"
import { getUserSpaces } from "@/features/userSpace/actions"
import { UserSpaceIndex } from "@/features/userSpace/components"

export default async function Page() {
  const { spaces, error } = await getUserSpaces()

  if (error?.code === "not_found") {
    notFound()
  }

  return <UserSpaceIndex spaces={spaces} error={error} />
}
