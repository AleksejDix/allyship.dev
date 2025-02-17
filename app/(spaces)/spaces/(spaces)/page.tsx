import { notFound } from "next/navigation"
import { getSpaces } from "@/features/spaces/actions"
import { SpaceIndex } from "@/features/spaces/components/space-index"

export default async function Page() {
  const { data } = await getSpaces()

  if (!data || data.length === 0) {
    notFound()
  }

  return (
    <div className="container">
      <SpaceIndex spaces={data} />
    </div>
  )
}
