import { getDomainsBySpaceId } from "@/features/domains/actions"
import { DomainsCreate } from "@/features/domains/components/domains-create"
import { DomainsIndex } from "@/features/domains/components/domains-index"

type DomainsPageProps = {
  params: { space_id: string }
}

export default async function DomainsPage({ params }: DomainsPageProps) {
  const { space_id } = await params

  const domains = await getDomainsBySpaceId(space_id)

  return (
    <>
      <DomainsCreate spaceId={space_id} />
      <DomainsIndex spaceId={space_id} domains={domains} />
    </>
  )
}
