import { CircleCheck, CircleX } from 'lucide-react'

import { generateMetadata } from '@/lib/metadata'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'
import { Separator } from '@workspace/ui/components/separator'
import { Loader } from '@/components/loader'
import { PageHeader } from '@/components/page-header'

export const metadata = generateMetadata({
  title: 'Brand Guidelines',
  description: 'Brand assets, guidelines, and resources for Allyship.dev',
  path: '/brand',
})

export default function BrandPage() {
  return (
    <main>
      <PageHeader
        heading="Brand Guidelines"
        description="Official brand assets and usage guidelines for Allyship.dev"
      />
      <Separator className="my-8" />

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Logo</CardTitle>
            <CardDescription>
              Our primary logo and usage guidelines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-8">
              <div className="aspect-square grid place-content-center max-w-44 border overflow-hidden rounded-lg">
                <Loader size={64} />
              </div>
              <svg
                viewBox="0 0 48 48"
                className="w-[128px] h-[128px]"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <foreignObject x="0" y="0" width="48" height="48">
                  <div className="aspect-square grid place-content-center w-[48px] h-[48px] overflow-hidden">
                    <Loader size={24} />
                  </div>
                </foreignObject>
              </svg>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
            <CardDescription>
              Assets optimized for social media platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">LinkedIn Banner</h3>
              <div
                className="w-full max-w-[1128px] h-[191px] bg-black flex flex-col justify-center items-center rounded-lg"
                role="img"
                aria-label="LinkedIn banner preview showing accessibility status indicators"
              >
                <div className="mx-auto inline-flex gap-4 p-4">
                  <CircleX aria-hidden="true" className="text-red-400" />
                  <CircleX aria-hidden="true" className="text-red-400" />
                  <CircleX aria-hidden="true" className="text-red-400" />
                  <CircleX aria-hidden="true" className="text-red-400" />
                  <CircleCheck aria-hidden="true" className="text-green-400" />
                  <CircleCheck aria-hidden="true" className="text-green-400" />
                  <CircleCheck aria-hidden="true" className="text-green-400" />
                </div>
                <div>
                  <p className="text-muted-foreground max-w-xs text-center">
                    AI-Based Web Accessibility
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
