// import { Domain } from "@prisma/client"

import { ScanIndex } from "@/features/scans/components/scan-index"

import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"

type Params = {
  page_id: string
}

export default async function Page({ params }: { params: Params }) {
  const { page_id } = params

  const page = await prisma.page.findUnique({
    where: {
      id: page_id,
    },
    include: {
      domain: true,
      scans: true,
    },
  })

  if (!page) {
    return <div>Page not found</div>
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Page</h1>
        <div className="flex gap-2"></div>
      </div>

      <Card className="border-zinc-800">
        <CardContent className="p-0">
          <div className="grid grid-cols-2 gap-6">
            {/* Preview Section */}
            <div className="p-6">
              <div className="rounded overflow-hidden border border-zinc-800">
                {/* Replace with your actual preview image */}
                <div className="aspect-video bg-zinc-900 flex items-center justify-center">
                  <span className="text-zinc-500">Page Preview</span>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-sm font-medium text-zinc-400 mb-2">
                  Domain
                </h2>
                <a
                  href={`https://${page.domain.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base hover:underline text-blue-500"
                >
                  {page.domain.name}
                </a>
              </div>

              <div>
                <h2 className="text-sm font-medium text-zinc-400 mb-2">
                  Full Path
                </h2>
                <div className="flex gap-2">
                  <a
                    href={`https://${page.domain.name}${page.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base hover:underline text-blue-500"
                  >
                    {page.name}
                  </a>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-medium text-zinc-400 mb-2">
                  Status
                </h2>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span>Ready</span>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-medium text-zinc-400 mb-2">
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

      <ScanIndex scans={page.scans} />
    </div>
  )
}
