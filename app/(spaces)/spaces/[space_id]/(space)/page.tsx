import { getDomainsBySpaceId } from "@/features/domains/actions"
// import { DomainsCreate } from "@/features/domains/components/domains-create"
import { DomainsIndex } from "@/features/domains/components/domains-index"
import { Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/empty"

type DomainsPageProps = {
  params: { space_id: string }
}

export default async function DomainsPage({ params }: DomainsPageProps) {
  const { space_id } = await params

  const domains = await getDomainsBySpaceId(space_id)

  return (
    <>
      {/* <DomainsCreate spaceId={space_id} /> */}
      <div className="py-6 container">
        <div>
          <h1 className="text-3xl">Space Domains</h1>
        </div>
      </div>
      <main tabIndex={-1} aria-label="Space Domains" className="container">
        {domains.length > 0 ? (
          <DomainsIndex spaceId={space_id} domains={domains} />
        ) : (
          <EmptyState
            icon={Globe}
            title="No domains found"
            description="Get started by adding a domain to your space. You can add multiple domains to manage them all in one place."
          >
            <Button>Add your first domain</Button>
          </EmptyState>
        )}
      </main>
    </>
  )
}
