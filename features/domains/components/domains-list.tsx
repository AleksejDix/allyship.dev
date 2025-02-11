"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { EmptyState } from "@/components/empty"

import type { DomainWithScreenshots } from "../actions"
import { AddDomainDialog } from "./add-domain-dialog"

interface DomainsListProps {
  domains: DomainWithScreenshots[]
  spaceId: string
}

export function DomainsList({ domains, spaceId }: DomainsListProps) {
  const [emptyStateOpen, setEmptyStateOpen] = useState(false)

  return (
    <div className="container">
      {domains.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.map((domain) => (
            <Link
              key={domain.id}
              href={`/spaces/${spaceId}/${domain.id}`}
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
          <AddDomainDialog
            spaceId={spaceId}
            open={emptyStateOpen}
            onOpenChange={setEmptyStateOpen}
            trigger={<Button>Add your first domain</Button>}
          />
        </EmptyState>
      )}
    </div>
  )
}
