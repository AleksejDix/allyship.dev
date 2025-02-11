import { PageHeader } from "@/features/domain/components/page-header"
import { getDomainsWithLatestScreenshots } from "@/features/domains/actions"
import { DomainsList } from "@/features/domains/components/domains-list"
import { HeaderActions } from "@/features/domains/components/header-actions"

type DomainsPageProps = {
  params: { space_id: string }
}

export default async function DomainsPage({ params }: DomainsPageProps) {
  const { space_id } = params
  const domains = await getDomainsWithLatestScreenshots(space_id)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Space"
        description="A space to manage your projects and domains"
      >
        <HeaderActions spaceId={space_id} />
      </PageHeader>

      <DomainsList domains={domains ?? []} spaceId={space_id} />
    </div>
  )
}
