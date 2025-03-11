import Link from 'next/link'
import { generateMetadata } from '@/lib/metadata'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@workspace/ui/components/button'
import { Clock, ArrowRight } from 'lucide-react'
import { Loader } from '@/components/loader'
import { Card, CardContent, CardHeader } from '@workspace/ui/components/card'
import { Badge } from '@workspace/ui/components/badge'
// Import component blocks
import { Faqs } from '@/components/blocks/Faqs'
import { Issues } from '@/components/blocks/Issues'
import { ScanProcess } from '@/components/blocks/ScanProcess'
import { Services } from '@/components/blocks/Services'
import { Stats } from '@/components/blocks/Stats'
import { WebScanner } from '@/components/blocks/WebScanner'
import { Compliance } from '@/components/charts/Compliance'
import { UserTestimonials } from '@/components/blocks/UserTestimonials'
import { BenefitsSection } from '@/components/blocks/BenefitsSection'
import { BlogBlock } from '@/components/blocks/blog'
import { getAllPosts } from '@/app/(marketing)/blog/page'
import { BorderBeam } from '@workspace/ui/components/magicui/border-beam'

const posts = await getAllPosts()

// Component wrapper for consistent styling of pre-built components
const ComponentWrapper = ({
  children,
  title,
}: {
  children: React.ReactNode
  title?: string
}) => (
  <div className="border-t border-border/20 py-16">
    {title && (
      <div className="container mb-10">
        <h2 className="text-3xl font-bold md:text-5xl max-w-2xl mx-auto font-display text-pretty text-center">
          {title}
        </h2>
      </div>
    )}
    {children}
  </div>
)

export const metadata = generateMetadata({
  path: '/',
})

const Page = async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <>
      <div className="relative overflow-hidden">
        {/* Hero section */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(var(--foreground-rgb),0.05),transparent_50%)]"></div>

        <div className="container px-4 pt-16 pb-24 mx-auto">
          <div className="space-y-12 max-w-5xl mx-auto text-center">
            <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
              <Loader size={64} />
            </div>

            <div className="space-y-6">
              <div className="flex justify-center items-center">
                <div className="flex justify-center items-center relative overflow-hidden shadow-lg rounded-2xl">
                  <Badge variant="outline" className="m-0 leading-none">
                    Limited Beta Access Available
                  </Badge>
                  <BorderBeam
                    size={40}
                    initialOffset={20}
                    className="from-transparent via-yellow-500 to-transparent absolute inset-0"
                  />
                </div>
              </div>

              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-7xl max-w-2xl mx-auto font-display">
                Complete Web Accessibility Coverage
              </h1>

              <p className="text-pretty text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Capture accessibility issues that static scanners miss. Allyship
                provides complete coverage by combining automated monitoring
                with real-world interaction testing.
              </p>
            </div>

            {/* CTA Section */}
            <div className="mt-12">
              {!user ? (
                <div className="space-y-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex flex-wrap justify-center gap-4 mt-2">
                      <Button size="lg" variant="default" asChild>
                        <Link href="/auth/signup">
                          <span>Start Free Scan</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>

                      <Button size="lg" variant="outline" asChild>
                        <Link href="/auth/login">Sign In</Link>
                      </Button>
                    </div>

                    <p className="text-xs text-muted-foreground mt-2">
                      No credit card required. Free during beta period.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center">
                  <Button
                    size="lg"
                    className="h-12 px-8 shadow-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 dark:from-blue-500 dark:to-cyan-500 dark:hover:from-blue-600 dark:hover:to-cyan-600 text-white border-0"
                    asChild
                  >
                    <Link href="/spaces">
                      <span>Go to Dashboard</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Our Products Cards */}
      <div className="container px-4 py-16 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* aLLyship Card */}
          <Card className="overflow-hidden border border-border/40 bg-card/30 backdrop-blur-sm hover:border-border/60 transition-all duration-200">
            <CardHeader className="p-6 pb-0">
              <h3 className="text-2xl font-bold font-display">
                <span className="text-blue-500 ">AllyShip</span> - Accessibility
                Monitoring
              </h3>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-sm">
                  <span className="font-medium">
                    Detect 90% more accessibility issues
                  </span>{' '}
                  than traditional scanners. Reduce legal risk and reach 100% of
                  your market with comprehensive compliance monitoring.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                    <span>Avoid costly lawsuits and compliance violations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                    <span>Improve conversions with better user experience</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                    <span>Enterprise-ready implementation and support</span>
                  </li>
                </ul>
                {/* <Button variant="outline" className="w-full mt-2" asChild>
                  <Link href="/products/allyship">Learn more</Link>
                </Button> */}
              </div>
            </CardContent>
          </Card>

          {/* AllyStudio Card */}
          <Card className="overflow-hidden border border-border/40 bg-card/30 backdrop-blur-sm hover:border-border/60 transition-all duration-200">
            <CardHeader className="p-6 pb-0">
              <h3 className="text-2xl font-bold font-display">
                <span className="text-blue-500">AllyStudio</span> -
                Accessibility Audit Studio
              </h3>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-sm">
                  <span className="font-medium">
                    Cut development costs by 40%
                  </span>{' '}
                  by finding accessibility issues earlier. Our AI tools detect
                  90% more bugs than standard checkers at the design stage.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                    <span>Reduce expensive late-stage code refactoring</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                    <span>Streamline accessibility compliance workflow</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                    <span>Measurable ROI with compliance reporting</span>
                  </li>
                </ul>
                {/* <Button variant="outline" className="w-full mt-2" asChild>
                  <Link href="/products/allystudio">Learn more</Link>
                </Button> */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Use our component blocks */}
      <UserTestimonials />
      <BenefitsSection />

      {/* Pre-built components with consistent styling */}
      <ComponentWrapper title="Scan your website for accessibility issues">
        <WebScanner />
      </ComponentWrapper>

      <ComponentWrapper title="Why Accessibility Matters">
        <Stats />
      </ComponentWrapper>

      <ComponentWrapper title="Our Accessibility Scanning Process">
        <ScanProcess />
      </ComponentWrapper>

      <ComponentWrapper title="Common Accessibility Issues We Detect">
        <Issues />
      </ComponentWrapper>

      <ComponentWrapper title="Services to Build Inclusive Digital Experiences">
        <Services />
      </ComponentWrapper>

      <div className="container py-16 space-y-12 max-w-5xl mx-auto border-t border-border/20">
        <div className="space-y-6 text-center">
          <h2 className="text-3xl font-bold md:text-5xl max-w-2xl mx-auto font-display text-pretty">
            Get Started with Allyship
          </h2>
          <p className="text-pretty text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-xl mx-auto">
            Start your journey to web accessibility mastery today. Allyship
            offers a range of services to help you create inclusive digital
            experiences.
          </p>
        </div>
        <Compliance />
      </div>

      <BlogBlock
        title="Latest News"
        subtitle="Updates from our team"
        posts={posts}
        showMax={3} // Show up to 5 posts
        footerLink={{
          text: 'View all posts',
          href: '/blog',
        }}
      />

      <ComponentWrapper title="Frequently Asked Questions">
        <Faqs />
      </ComponentWrapper>

      {/* {!user && (
        <div className="w-full mt-16 flex justify-center z-50">
          <div className="bg-card/95 dark:bg-card/90 backdrop-blur-md border border-border/30 shadow-lg rounded-lg flex flex-col md:flex-row items-start md:items-center p-4 gap-4 max-w-xl">
            <div className="flex-1">
              <h3 className="text-sm font-medium mb-1">
                Ready to improve your website accessibility?
              </h3>
              <p className="text-xs text-muted-foreground">
                Enter your website URL to get started with a free scan.
              </p>
            </div>
            <div className="flex w-full md:w-auto gap-2 items-center">
              <input
                type="text"
                placeholder="yourdomain.com"
                className="px-3 py-2 text-sm rounded-md border bg-background/70 dark:bg-background/40 w-full md:w-40 focus:border-blue-500 focus:ring-blue-500/20"
              />
              <Button
                size="sm"
                className="whitespace-nowrap bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 dark:from-blue-500 dark:to-cyan-500 dark:hover:from-blue-600 dark:hover:to-cyan-600 text-white border-0"
              >
                <span>Start Free</span>
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      )} */}
    </>
  )
}

export default Page
