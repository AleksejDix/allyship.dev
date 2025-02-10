import { PageHeader } from "@/features/domain/components/page-header"
import { getDomainsBySpaceId } from "@/features/domains/actions"
import { DomainsCreate } from "@/features/domains/components/domains-create"
import { DomainsIndex } from "@/features/domains/components/domains-index"
import { Globe, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { EmptyState } from "@/components/empty"

type DomainsPageProps = {
  params: { space_id: string }
}

export default async function DomainsPage({ params }: DomainsPageProps) {
  const { space_id } = await params

  const domains = await getDomainsBySpaceId(space_id)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Space Domains"
        description="Manage domains in your space"
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="secondary">
              <Plus aria-hidden="true" />
              Add Domain
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Domain</DialogTitle>
              <DialogDescription>
                Add a new domain to your space. You can add multiple domains to
                manage them all in one place.
              </DialogDescription>
            </DialogHeader>
            <DomainsCreate spaceId={space_id} />
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="container">
        {domains.length > 0 ? (
          <DomainsIndex spaceId={space_id} domains={domains} />
        ) : (
          <EmptyState
            icon={Globe}
            title="No domains found"
            description="Get started by adding a domain to your space. You can add multiple domains to manage them all in one place."
          >
            <Dialog>
              <DialogTrigger asChild>
                <Button>Add your first domain</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Domain</DialogTitle>
                  <DialogDescription>
                    Add a new domain to your space. You can add multiple domains
                    to manage them all in one place.
                  </DialogDescription>
                </DialogHeader>
                <DomainsCreate spaceId={space_id} />
              </DialogContent>
            </Dialog>
          </EmptyState>
        )}
      </div>
    </div>
  )
}
