import { notFound } from "next/navigation"
import { getSpaces } from "@/features/space/actions"
import { SpaceIndex } from "@/features/space/components/space-index"

export default async function Page() {
  const { data } = await getSpaces()

  if (!data || data.length === 0) {
    notFound()
  }

  return <SpaceIndex spaces={data} />
}
