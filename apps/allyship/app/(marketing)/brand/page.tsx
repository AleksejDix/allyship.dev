import { generateMetadata } from '@/lib/metadata'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@workspace/ui/components/tabs'
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
      <div className="my-8 h-[1px] w-full bg-border" />

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
              <div className="aspect-square grid place-content-center max-w-44 border overflow-hidden">
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
            <div className="space-y-8">
              <div className="grid gap-4" id="social-media-tabs">
                <h3 className="text-lg font-medium">Select Platform</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  <a
                    href="#facebook"
                    className="px-3 py-2 border rounded-md hover:bg-black/5 bg-black/10"
                  >
                    Facebook
                  </a>
                  <a
                    href="#instagram"
                    className="px-3 py-2 border rounded-md hover:bg-black/5"
                  >
                    Instagram
                  </a>
                  <a
                    href="#linkedin"
                    className="px-3 py-2 border rounded-md hover:bg-black/5"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="#twitter"
                    className="px-3 py-2 border rounded-md hover:bg-black/5"
                  >
                    Twitter (X)
                  </a>
                  <a
                    href="#youtube"
                    className="px-3 py-2 border rounded-md hover:bg-black/5"
                  >
                    YouTube
                  </a>
                  <a
                    href="#tiktok"
                    className="px-3 py-2 border rounded-md hover:bg-black/5"
                  >
                    TikTok
                  </a>
                  <a
                    href="#pinterest"
                    className="px-3 py-2 border rounded-md hover:bg-black/5"
                  >
                    Pinterest
                  </a>
                  <a
                    href="#snapchat"
                    className="px-3 py-2 border rounded-md hover:bg-black/5"
                  >
                    Snapchat
                  </a>
                </div>
              </div>

              {/* Facebook */}
              <div id="facebook" className="space-y-6 scroll-mt-20">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Facebook Assets</h3>
                  <p className="text-sm text-muted-foreground">
                    Standard assets for Facebook profiles and pages. All
                    dimensions are in pixels.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Profile Picture (720x720 px)
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      Minimum size: 180x180 px. Displays as a circle on
                      profiles.
                    </p>
                    <div className="overflow-x-auto pb-4">
                      <div className="w-[720px] h-[720px] bg-black/10 flex items-center justify-center border rounded-lg flex-shrink-0">
                        <Loader size={64} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Banner - High Resolution (1251x463 px)
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      Higher resolution version with approximately 2.7:1 aspect
                      ratio for better quality displays.
                    </p>
                    <div className="overflow-x-auto pb-4">
                      <div className="relative w-[1251px] h-[463px] bg-black/10 border rounded-lg flex-shrink-0">
                        {/* Safe zone outline */}
                        <div className="absolute top-[43px] left-[165px] w-[921px] h-[377px] border border-green-500 border-dashed flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-sm font-medium">Safe Zone</p>
                            <p className="text-xs">
                              Keep important content in this area
                            </p>
                          </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <Loader size={64} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Banner - Safe Zones Example (851x315 px)
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      Cyan lines mark areas not visible on mobile devices. Keep
                      important content in the center safe zone (820x360 px).
                    </p>
                    <div className="overflow-x-auto pb-4">
                      <div className="relative w-[851px] h-[315px] bg-black/10 border rounded-lg flex-shrink-0">
                        {/* Top mobile non-visible area */}
                        <div className="absolute top-0 left-0 w-full h-[24px] border border-cyan-500 border-b-0 bg-cyan-500/10"></div>

                        {/* Left mobile non-visible area */}
                        <div className="absolute top-[24px] left-0 w-[90px] h-[267px] border border-cyan-500 border-r-0 bg-cyan-500/10"></div>

                        {/* Right mobile non-visible area */}
                        <div className="absolute top-[24px] right-0 w-[90px] h-[267px] border border-cyan-500 border-l-0 bg-cyan-500/10"></div>

                        {/* Bottom mobile non-visible area */}
                        <div className="absolute bottom-0 left-0 w-full h-[24px] border border-cyan-500 border-t-0 bg-cyan-500/10"></div>

                        {/* Safe zone outline */}
                        <div className="absolute top-[24px] left-[90px] w-[671px] h-[267px] border border-green-500 border-dashed flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-sm font-medium">
                              Safe Zone (820x360 px)
                            </p>
                            <p className="text-xs">
                              Visible on both desktop and mobile
                            </p>
                          </div>
                        </div>

                        {/* Dimensions labels */}
                        <div className="absolute top-1 left-1 text-[10px] text-muted-foreground">
                          Desktop: 851x315 px
                        </div>
                        <div className="absolute bottom-1 left-1 text-[10px] text-muted-foreground">
                          Mobile: 640x360 px
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Banner - Desktop (820x312 px)
                    </h4>
                    <div className="overflow-x-auto pb-4">
                      <div className="w-[820px] h-[312px] bg-black/10 flex items-center justify-center border rounded-lg flex-shrink-0">
                        <Loader size={64} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Banner - Mobile (640x360 px)
                    </h4>
                    <div className="overflow-x-auto pb-4">
                      <div className="w-[640px] h-[360px] bg-black/10 flex items-center justify-center border rounded-lg flex-shrink-0">
                        <Loader size={64} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Event Photo (1336x700 px)
                    </h4>
                    <div className="overflow-x-auto pb-4">
                      <div className="w-[1336px] h-[700px] bg-black/10 flex items-center justify-center border rounded-lg flex-shrink-0">
                        <Loader size={64} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Group Photo (640x334 px)
                    </h4>
                    <div className="overflow-x-auto pb-4">
                      <div className="w-[640px] h-[334px] bg-black/10 flex items-center justify-center border rounded-lg flex-shrink-0">
                        <Loader size={64} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Post Image (1200x630 px)
                    </h4>
                    <div className="overflow-x-auto pb-4">
                      <div className="w-[1200px] h-[630px] bg-black/10 flex items-center justify-center border rounded-lg flex-shrink-0">
                        <Loader size={64} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instagram */}
              <div id="instagram" className="space-y-6 scroll-mt-20">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Instagram Assets</h3>
                  <p className="text-sm text-muted-foreground">
                    Standard assets for Instagram profiles and posts. All
                    dimensions are in pixels.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Profile Picture (720x720 px)
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      Minimum size: 160x160 px. Displays as a circle on
                      profiles.
                    </p>
                    <div className="overflow-x-auto pb-4">
                      <div className="w-[720px] h-[720px] bg-black/10 flex items-center justify-center border rounded-lg flex-shrink-0">
                        <Loader size={64} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Square Post (1200x1200 px)
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      Standard square post for feed.
                    </p>
                    <div className="overflow-x-auto pb-4">
                      <div className="w-[1200px] h-[1200px] bg-black/10 flex items-center justify-center border rounded-lg flex-shrink-0">
                        <Loader size={64} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Portrait Post (1080x1350 px)
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      Vertical post for increased feed visibility.
                    </p>
                    <div className="overflow-x-auto pb-4">
                      <div className="w-[1080px] h-[1350px] bg-black/10 flex items-center justify-center border rounded-lg flex-shrink-0">
                        <Loader size={64} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Stories (1080x1920 px)
                    </h4>
                    <div className="overflow-x-auto pb-4">
                      <div className="w-[1080px] h-[1920px] bg-black/10 flex items-center justify-center border rounded-lg flex-shrink-0">
                        <Loader size={64} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* LinkedIn */}
              <div id="linkedin" className="space-y-6 scroll-mt-20">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">LinkedIn Assets</h3>
                  <p className="text-sm text-muted-foreground">
                    Standard assets for LinkedIn profiles and pages. All
                    dimensions are in pixels.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Profile Picture (640x640 px)
                    </h4>
                    <div className="overflow-x-auto pb-4">
                      <div className="w-[640px] h-[640px] bg-black/10 flex items-center justify-center border rounded-lg flex-shrink-0">
                        <Loader size={64} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Company Banner (1128x191 px)
                    </h4>
                    <div className="overflow-x-auto pb-4">
                      <div className="w-[1128px] h-[191px] bg-black/10 flex items-center justify-center border rounded-lg flex-shrink-0">
                        <Loader size={64} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Personal Banner (792x198 px)
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      Will be cropped slightly at top and bottom on mobile.
                    </p>
                    <div className="overflow-x-auto pb-4">
                      <div className="w-[792px] h-[198px] bg-black/10 flex items-center justify-center border rounded-lg flex-shrink-0">
                        <Loader size={64} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Post Image (1200x1200 px)
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      Square post for feed. Minimum size: 640x640 px.
                    </p>
                    <div className="overflow-x-auto pb-4">
                      <div className="w-[1200px] h-[1200px] bg-black/10 flex items-center justify-center border rounded-lg flex-shrink-0">
                        <Loader size={64} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Twitter (X) */}
              <div id="twitter" className="space-y-6 scroll-mt-20">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Twitter (X) Assets</h3>
                  <p className="text-sm text-muted-foreground">
                    Standard assets for Twitter/X profiles. All dimensions are
                    in pixels.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Profile Picture (720x720 px)
                    </h4>
                    <div className="overflow-x-auto pb-4">
                      <div className="w-[720px] h-[720px] bg-black/10 flex items-center justify-center border rounded-lg flex-shrink-0">
                        <Loader size={64} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Banner (1500x500 px)
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      Latest recommended size. Minimum: 600x200 px.
                    </p>
                    <div className="overflow-x-auto pb-4">
                      <div className="w-[1500px] h-[500px] bg-black/10 flex items-center justify-center border rounded-lg flex-shrink-0">
                        <Loader size={64} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Post Image (1040x584 px)
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      Optimal size for feed posts. Minimum: 520x292 px.
                    </p>
                    <div className="overflow-x-auto pb-4">
                      <div className="w-[1040px] h-[584px] bg-black/10 flex items-center justify-center border rounded-lg flex-shrink-0">
                        <Loader size={64} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* YouTube */}
              <div id="youtube" className="space-y-6 scroll-mt-20">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">YouTube Assets</h3>
                  <p className="text-sm text-muted-foreground">
                    Standard assets for YouTube channels. All dimensions are in
                    pixels.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Profile Picture (800x800 px)
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      Displayed as a circle. Minimum: 98x98 px.
                    </p>
                    <div className="overflow-x-auto pb-4">
                      <div className="w-[800px] h-[800px] bg-black/10 flex items-center justify-center border rounded-lg flex-shrink-0">
                        <Loader size={64} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Banner (2048x1152 px)
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      Channel art must be less than 6MB in size.
                    </p>
                    <div className="overflow-x-auto pb-4">
                      <div className="w-[2048px] h-[1152px] bg-black/10 flex items-center justify-center border rounded-lg flex-shrink-0">
                        <Loader size={64} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Thumbnail (1280x720 px)
                    </h4>
                    <div className="overflow-x-auto pb-4">
                      <div className="w-[1280px] h-[720px] bg-black/10 flex items-center justify-center border rounded-lg flex-shrink-0">
                        <Loader size={64} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* TikTok */}
              <div id="tiktok" className="space-y-6 scroll-mt-20">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">TikTok Assets</h3>
                  <p className="text-sm text-muted-foreground">
                    Standard assets for TikTok profiles and content. All
                    dimensions are in pixels.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Profile Picture (720x720 px)
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      Minimum: 20x20 px. Will be displayed as a circle.
                    </p>
                    <div className="overflow-x-auto pb-4">
                      <div className="w-[720px] h-[720px] bg-black/10 flex items-center justify-center border rounded-lg flex-shrink-0">
                        <Loader size={64} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Video (1080x1920 px)
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      Standard TikTok video format. Max length: 60 seconds.
                    </p>
                    <div className="overflow-x-auto pb-4">
                      <div className="w-[1080px] h-[1920px] bg-black/10 flex items-center justify-center border rounded-lg flex-shrink-0">
                        <Loader size={64} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pinterest */}
              <div id="pinterest" className="space-y-6 scroll-mt-20">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Pinterest Assets</h3>
                  <p className="text-sm text-muted-foreground">
                    Standard assets for Pinterest profiles and pins. All
                    dimensions are in pixels.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Profile Picture (720x720 px)
                    </h4>
                    <div className="overflow-x-auto pb-4">
                      <div className="w-[720px] h-[720px] bg-black/10 flex items-center justify-center border rounded-lg flex-shrink-0">
                        <Loader size={64} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Square Pin (600x600 px)
                    </h4>
                    <div className="overflow-x-auto pb-4">
                      <div className="w-[600px] h-[600px] bg-black/10 flex items-center justify-center border rounded-lg flex-shrink-0">
                        <Loader size={64} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Standard Pin (600x900 px)
                    </h4>
                    <div className="overflow-x-auto pb-4">
                      <div className="w-[600px] h-[900px] bg-black/10 flex items-center justify-center border rounded-lg flex-shrink-0">
                        <Loader size={64} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Long Pin (600x1560 px)
                    </h4>
                    <div className="overflow-x-auto pb-4">
                      <div className="w-[600px] h-[1560px] bg-black/10 flex items-center justify-center border rounded-lg flex-shrink-0">
                        <Loader size={64} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Snapchat */}
              <div id="snapchat" className="space-y-6 scroll-mt-20">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Snapchat Assets</h3>
                  <p className="text-sm text-muted-foreground">
                    Standard assets for Snapchat profiles and stories. All
                    dimensions are in pixels.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Profile Picture (320x320 px)
                    </h4>
                    <div className="overflow-x-auto pb-4">
                      <div className="w-[320px] h-[320px] bg-black/10 flex items-center justify-center border rounded-lg flex-shrink-0">
                        <Loader size={64} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Stories (1080x1920 px)
                    </h4>
                    <div className="overflow-x-auto pb-4">
                      <div className="w-[1080px] h-[1920px] bg-black/10 flex items-center justify-center border rounded-lg flex-shrink-0">
                        <Loader size={64} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
