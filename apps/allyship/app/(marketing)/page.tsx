import Link from 'next/link'
import { generateMetadata } from '@/lib/metadata'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@workspace/ui/components/button'
import { ArrowRight, BookOpen, ExternalLink, Volume2 } from 'lucide-react'
import { Loader } from '@/components/loader'
import { Card, CardContent, CardHeader } from '@workspace/ui/components/card'
import { Badge } from '@workspace/ui/components/badge'
// Import component blocks
import { Faqs } from '@/components/blocks/Faqs'
import { Issues } from '@/components/blocks/Issues'
import { Services } from '@/components/blocks/Services'
import { Stats } from '@/components/blocks/Stats'
import { Compliance } from '@/components/charts/Compliance'
import { UserTestimonials } from '@/components/blocks/UserTestimonials'
import { BenefitsSection } from '@/components/blocks/BenefitsSection'
import { BlogBlock } from '@/components/blocks/blog'
import { getAllPosts } from '@/app/(marketing)/blog/page'
import { BorderBeam } from '@workspace/ui/components/magicui/border-beam'
import { TextToSpeechButton } from '@/components/accessibility/TextToSpeechButton'

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

              {/* Text-to-speech button */}
              <div className="flex justify-center">
                <TextToSpeechButton
                  text={`
                  Complete Web Accessibility Coverage.
                  Capture accessibility issues that static scanners miss. Allyship
                  provides complete coverage by combining automated monitoring
                  with real-world interaction testing.
                `}
                />
              </div>
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

      {/* Featured EAA Simple Language Guide */}
      <div className="relative bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/30 dark:to-background">
        <div className="container px-4 py-20 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-900">
                    NEW RESOURCE
                  </Badge>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold font-display">
                  European Accessibility Act in Simple Language
                </h2>

                <p className="text-lg text-muted-foreground">
                  Understanding the EAA doesn't have to be complicated. Our
                  simplified guide breaks down complex legal requirements into
                  clear, actionable steps.
                </p>

                {/* Text-to-speech button for EAA section */}
                <div className="flex">
                  <TextToSpeechButton
                    text={`
                    European Accessibility Act in Simple Language.
                    Understanding the EAA doesn't have to be complicated. Our
                    simplified guide breaks down complex legal requirements into
                    clear, actionable steps.
                    Our guide includes plain language explanations that anyone can understand,
                    visual diagrams and examples for complex concepts, and
                    practical compliance steps for businesses of all sizes.
                  `}
                  />
                </div>

                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-1 mt-0.5">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-blue-600 dark:text-blue-400"
                      >
                        <path
                          d="M12 5L6.5 10.5L4 8"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span>
                      Plain language explanations that anyone can understand
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-1 mt-0.5">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-blue-600 dark:text-blue-400"
                      >
                        <path
                          d="M12 5L6.5 10.5L4 8"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span>
                      Visual diagrams and examples for complex concepts
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-1 mt-0.5">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-blue-600 dark:text-blue-400"
                      >
                        <path
                          d="M12 5L6.5 10.5L4 8"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span>
                      Practical compliance steps for businesses of all sizes
                    </span>
                  </li>
                </ul>

                <div className="flex flex-wrap gap-4 pt-2">
                  <Button asChild size="lg">
                    <Link href="/eaa/" className="group">
                      Read Simple Guide
                      <ArrowRight
                        className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative">
              <div className="rounded-xl  shadow-xl relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 mix-blend-multiply"></div>
                <div
                  className="w-full h-[400px] bg-blue-50 dark:bg-blue-900/20 p-8 relative"
                  role="img"
                  aria-label="Preview of the EAA Simple Language Guide"
                >
                  {/* Document header */}
                  <div className="bg-white dark:bg-gray-800 rounded-t-lg border border-border shadow-sm p-4 mb-4 flex items-center">
                    <BookOpen
                      className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3"
                      aria-hidden="true"
                    />
                    <h3 className="text-lg font-semibold">
                      European Accessibility Act Guide
                    </h3>
                  </div>

                  {/* Content sections */}
                  <div className="space-y-4">
                    {/* Title */}
                    <div className="bg-white dark:bg-gray-800 rounded-md border border-border p-4">
                      <div className="h-6 w-48 bg-blue-600/90 dark:bg-blue-500/90 rounded mb-2"></div>
                      <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>

                    {/* Section 1 */}
                    <div className="bg-white dark:bg-gray-800 rounded-md border border-border p-4">
                      <div className="h-5 w-32 bg-blue-500/80 dark:bg-blue-600/80 rounded mb-3"></div>
                      <div className="space-y-2">
                        <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                    </div>

                    {/* Section 2 with bullet points */}
                    <div className="bg-white dark:bg-gray-800 rounded-md border border-border p-4">
                      <div className="h-5 w-40 bg-blue-500/80 dark:bg-blue-600/80 rounded mb-3"></div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                          <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                          <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                          <div className="h-3 w-4/5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Free Access badge */}
                  <div className="absolute bottom-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
                    <span>Free Access</span>
                    <span className="text-[10px] opacity-80">
                      (No registration required)
                    </span>
                  </div>

                  {/* Visual elements */}
                  <div className="absolute bottom-6 right-6 bg-blue-100 dark:bg-blue-800/70 rounded-full p-2">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-blue-600 dark:text-blue-300"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 8V12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 16H12.01"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 opacity-30">
                    <svg
                      width="80"
                      height="80"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-blue-600 dark:text-blue-400"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-4 bg-white dark:bg-card p-3 rounded-lg shadow-lg border border-border">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40"
                    >
                      Free Access
                    </Badge>
                    <span className="text-sm font-medium">
                      No registration required
                    </span>
                  </div>
                </div>
              </div>
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
      <ComponentWrapper title="Why Accessibility Matters">
        <Stats />
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
