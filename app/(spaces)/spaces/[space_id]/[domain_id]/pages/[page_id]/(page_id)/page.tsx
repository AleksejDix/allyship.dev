// import { Domain } from "@prisma/client"

import { PageHeader } from "@/features/domain/components/page-header"
import { ThemeAwareScreenshots } from "@/features/domain/components/theme-aware-screenshots"
import { ScanIndex } from "@/features/scans/components/scan-index"

import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"

type Params = {
  page_id: string
  space_id: string
  domain_id: string
}

export default async function Page({ params }: { params: Params }) {
  const { page_id } = params

  const page = await prisma.page.findUnique({
    where: {
      id: page_id,
    },
    include: {
      domain: true,
      scans: {
        orderBy: {
          created_at: "desc",
        },
        take: 10,
      },
    },
  })

  if (!page) {
    throw new Error("Page not found")
  }

  const latestScan = page.scans[0]

  return (
    <>
      <PageHeader
        title={`${page.domain.name}${page.name}`}
        description={`Manage page for ${page.name}`}
      />

      <div className="container py-6 space-y-6">
        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-2 gap-6">
              {/* Preview Section */}
              <div className="p-6">
                <div className="rounded overflow-hidden border border-border">
                  {latestScan?.screenshot_light ||
                  latestScan?.screenshot_dark ? (
                    <ThemeAwareScreenshots
                      lightScreenshot={latestScan.screenshot_light || ""}
                      darkScreenshot={latestScan.screenshot_dark || ""}
                      alt={`Latest scan of ${page.name}`}
                    />
                  ) : (
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">
                        No scan preview available
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Details Section */}
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-sm font-medium text-muted-foreground mb-2">
                    Domain
                  </h2>
                  <a
                    href={`https://${page.domain.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base hover:underline"
                  >
                    {page.domain.name}
                  </a>
                </div>

                <div>
                  <h2 className="text-sm font-medium text-muted-foreground mb-2">
                    Full Path
                  </h2>
                  <div className="flex gap-2">
                    <a
                      href={`https://${page.domain.name}${page.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base hover:underline"
                    >
                      {page.name}
                    </a>
                  </div>
                </div>

                <div>
                  <h2 className="text-sm font-medium text-muted-foreground mb-2">
                    Status
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span>Ready</span>
                  </div>
                </div>

                <div>
                  <h2 className="text-sm font-medium text-muted-foreground mb-2">
                    Monitoring
                  </h2>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      <span>off</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <ScanIndex scans={page.scans} />
        </div>
      </div>
    </>
  )
}
