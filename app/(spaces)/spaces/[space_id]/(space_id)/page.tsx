import Image from "next/image"
import Link from "next/link"
import { PageHeader } from "@/features/domain/components/page-header"
import { getDomainsWithLatestScreenshots } from "@/features/domains/actions"
import { DomainsCreate } from "@/features/domains/components/domains-create"
import { Globe, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
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
  const domains = await getDomainsWithLatestScreenshots(space_id)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Space"
        description="A space to manage your projects and domains"
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
        {domains && domains.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domains.map((domain) => (
              <Link
                key={domain.id}
                href={`/spaces/${space_id}/${domain.id}`}
                className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg hover:no-underline"
              >
                <Card className="overflow-hidden h-full transition-colors hover:bg-muted/50">
                  <div className="aspect-video relative bg-muted">
                    {domain.latestScreenshots ? (
                      <Image
                        src={
                          domain.latestScreenshots.light ||
                          domain.latestScreenshots.dark ||
                          ""
                        }
                        alt={`Screenshot of ${domain.name}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Globe className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <h3 className="font-medium truncate">{domain.name}</h3>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
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
