import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

import { Button } from '@workspace/ui/components/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'
import {
  CheckCircle,
  Clock,
  Users,
  Zap,
  ArrowRight,
  ChevronRight,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'For Accessibility Consultants | AllyShip',
  description:
    'Test any website you can see—no setup required. Purpose-built tools for accessibility consultants to grow their business, save time, and deliver better results.',
}

// Simple component definitions
function NavItem({
  title,
  active = false,
}: {
  title: string
  active?: boolean
}) {
  return (
    <div
      className={`py-3 px-4 border-l-2 ${active ? 'border-primary font-medium text-primary' : 'border-transparent text-muted-foreground hover:border-primary/30 hover:text-foreground'} transition-all`}
    >
      {title}
    </div>
  )
}

function ContentSection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div id={id} className="py-16 scroll-mt-20">
      <h2 className="text-3xl font-bold mb-10 flex items-center gap-3">
        <div className="h-8 w-1 bg-primary rounded-full"></div>
        {title}
      </h2>
      {children}
    </div>
  )
}

// Main page component
export default async function ConsultantsPage() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-800 to-blue-900 py-3 px-6 text-center text-sm font-medium">
        Limited Time: Get 3 months free on annual consultant plans
      </div>

      {/* Top Navigation */}
      <header className="border-b border-white/10 sticky top-0 z-10 backdrop-blur-lg bg-black/80">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-bold text-xl">
              AllyShip
            </Link>
            <div className="hidden md:flex items-center gap-1">
              <div className="h-6 w-6 rounded-full bg-green-400"></div>
              <span className="text-sm">Consultant Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {session ? (
              <Button asChild size="sm" variant="default">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="sm" variant="outline">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild size="sm" variant="default">
                  <Link href="/register">Start Free Trial</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Side Navigation */}
          <div className="hidden lg:block col-span-3 sticky top-24 self-start h-[calc(100vh-120px)] overflow-auto">
            <div className="pr-4 border-r border-white/10 h-full flex flex-col justify-between">
              <div>
                <div className="mb-6">
                  <h2 className="font-bold mb-2 text-sm text-muted-foreground">
                    DISCOVER
                  </h2>
                  <NavItem title="Overview" active />
                  <NavItem title="Features" />
                  <NavItem title="Use Cases" />
                  <NavItem title="Testimonials" />
                  <NavItem title="Pricing" />
                  <NavItem title="FAQ" />
                </div>

                <div className="mb-6">
                  <h2 className="font-bold mb-2 text-sm text-muted-foreground">
                    RESOURCES
                  </h2>
                  <NavItem title="Getting Started Guide" />
                  <NavItem title="Success Stories" />
                  <NavItem title="API Documentation" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-800 to-indigo-900 rounded-lg p-5 mb-6">
                <h3 className="font-medium mb-2">Need help choosing?</h3>
                <p className="text-sm text-indigo-200 mb-4">
                  Book a personalized demo with our accessibility specialist
                </p>
                <Button
                  asChild
                  size="sm"
                  variant="secondary"
                  className="w-full"
                >
                  <Link href="/demo">Schedule Demo</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-12 lg:col-span-9">
            {/* Hero */}
            <div className="mb-16 relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-blue-900 z-0"></div>
              <div className="absolute inset-0 opacity-30 bg-[url('/assets/grid-pattern.svg')] z-0"></div>

              <div className="relative z-10 p-10 md:p-16">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 max-w-2xl">
                  Test Any Website You Can See —{' '}
                  <span className="text-indigo-300">No Setup Required</span>
                </h1>

                <p className="text-xl text-indigo-200 mb-8 max-w-2xl">
                  Scan authenticated pages, secure portals, and dynamic
                  applications instantly with AllyShip's Chrome extension. If
                  you can browse it, you can test it.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-indigo-900 hover:bg-indigo-100"
                  >
                    <Link href="/register">
                      Start 14-Day Trial <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="border-white/30 hover:bg-white/10"
                  >
                    <Link href="/demo">Watch Demo</Link>
                  </Button>
                </div>

                <p className="text-sm text-indigo-200">
                  No credit card required. Full access to authenticated testing.
                </p>
              </div>
            </div>

            {/* Key Features */}
            <ContentSection id="features" title="Purpose-Built for Consultants">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-indigo-950 to-black rounded-xl p-6 border border-indigo-800/30">
                  <div className="bg-indigo-900/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Zap
                      className="h-6 w-6 text-indigo-300"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    Zero Configuration Testing
                  </h3>
                  <p className="text-indigo-300">
                    No credential sharing. No proxy setup. No coding. Just
                    install our Chrome extension and start scanning any page you
                    can access.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-indigo-950 to-black rounded-xl p-6 border border-indigo-800/30">
                  <div className="bg-indigo-900/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <CheckCircle
                      className="h-6 w-6 text-indigo-300"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    Behind-Login Access
                  </h3>
                  <p className="text-indigo-300">
                    Test member portals, account dashboards, and secure
                    applications with the same ease as public pages.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-indigo-950 to-black rounded-xl p-6 border border-indigo-800/30">
                  <div className="bg-indigo-900/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Users
                      className="h-6 w-6 text-indigo-300"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    Multi-Client Management
                  </h3>
                  <p className="text-indigo-300">
                    Organize findings by client, project, and page. Generate
                    custom reports with your branding.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-indigo-950 to-black rounded-xl p-6 border border-indigo-800/30">
                  <div className="bg-indigo-900/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Clock
                      className="h-6 w-6 text-indigo-300"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    Save Hours Per Audit
                  </h3>
                  <p className="text-indigo-300">
                    Eliminate complex setup and focus on analysis. Our
                    consultants report saving 4+ hours per client audit.
                  </p>
                </div>
              </div>
            </ContentSection>

            {/* How It Works */}
            <ContentSection id="how-it-works" title="How It Works">
              <div className="bg-gradient-to-br from-indigo-950 to-black rounded-2xl p-8 border border-indigo-800/30 mb-8">
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-full bg-indigo-900/50 border border-indigo-500 flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl font-bold">1</span>
                    </div>
                    <h3 className="font-semibold mb-2">Install</h3>
                    <p className="text-sm text-indigo-300">
                      One-click Chrome extension installation.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-14 h-14 rounded-full bg-indigo-900/50 border border-indigo-500 flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl font-bold">2</span>
                    </div>
                    <h3 className="font-semibold mb-2">Browse</h3>
                    <p className="text-sm text-indigo-300">
                      Access any authenticated page as normal.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-14 h-14 rounded-full bg-indigo-900/50 border border-indigo-500 flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl font-bold">3</span>
                    </div>
                    <h3 className="font-semibold mb-2">Scan</h3>
                    <p className="text-sm text-indigo-300">
                      Analyze for WCAG 2.2 compliance instantly.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-14 h-14 rounded-full bg-indigo-900/50 border border-indigo-500 flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl font-bold">4</span>
                    </div>
                    <h3 className="font-semibold mb-2">Report</h3>
                    <p className="text-sm text-indigo-300">
                      Generate white-label branded reports.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden h-80">
                <Image
                  src="/assets/consultant-workflow.jpg"
                  alt="Illustration of the AllyShip workflow for consultants"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="bg-black/50 backdrop-blur-sm"
                  >
                    <Link href="/demo">Watch Demo Video</Link>
                  </Button>
                </div>
              </div>
            </ContentSection>

            {/* Use Cases */}
            <ContentSection id="use-cases" title="Specialized Use Cases">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group hover:bg-indigo-950 bg-black rounded-xl border border-indigo-800/30 p-6 transition-all">
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-indigo-300">
                    Financial Portals
                  </h3>
                  <p className="text-indigo-400 mb-4">
                    Test banking dashboards, investment platforms, and account
                    management pages without ever sharing credentials.
                  </p>
                  <Link
                    href="/use-cases/financial"
                    className="text-indigo-300 flex items-center gap-1 text-sm hover:text-indigo-200"
                  >
                    Learn more <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="group hover:bg-indigo-950 bg-black rounded-xl border border-indigo-800/30 p-6 transition-all">
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-indigo-300">
                    Healthcare Applications
                  </h3>
                  <p className="text-indigo-400 mb-4">
                    Patient portals, health records, and insurance dashboards
                    are all instantly scannable while maintaining HIPAA
                    compliance.
                  </p>
                  <Link
                    href="/use-cases/healthcare"
                    className="text-indigo-300 flex items-center gap-1 text-sm hover:text-indigo-200"
                  >
                    Learn more <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="group hover:bg-indigo-950 bg-black rounded-xl border border-indigo-800/30 p-6 transition-all">
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-indigo-300">
                    Educational Systems
                  </h3>
                  <p className="text-indigo-400 mb-4">
                    Learning management systems, student portals, and online
                    classrooms are fully testable behind the authentication
                    layer.
                  </p>
                  <Link
                    href="/use-cases/education"
                    className="text-indigo-300 flex items-center gap-1 text-sm hover:text-indigo-200"
                  >
                    Learn more <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="group hover:bg-indigo-950 bg-black rounded-xl border border-indigo-800/30 p-6 transition-all">
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-indigo-300">
                    Enterprise SaaS
                  </h3>
                  <p className="text-indigo-400 mb-4">
                    Test custom enterprise applications, employee dashboards,
                    and admin interfaces without IT department involvement.
                  </p>
                  <Link
                    href="/use-cases/enterprise"
                    className="text-indigo-300 flex items-center gap-1 text-sm hover:text-indigo-200"
                  >
                    Learn more <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </ContentSection>

            {/* Testimonials */}
            <ContentSection id="testimonials" title="What Consultants Say">
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-indigo-950 to-black rounded-xl p-6 border border-indigo-800/30">
                  <div className="flex items-start gap-4">
                    <div className="bg-indigo-900/50 h-10 w-10 rounded-full flex-shrink-0"></div>
                    <div>
                      <div className="mb-3">
                        <div className="flex gap-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className="h-4 w-4 bg-yellow-400 rounded-sm"
                            ></div>
                          ))}
                        </div>
                        <p className="text-lg italic mb-4">
                          "AllyShip eliminated our biggest challenge – testing
                          behind logins. We increased our client capacity by 40%
                          and can now offer testing for secure portals that our
                          competitors can't handle."
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold">Alex Chen</p>
                        <p className="text-sm text-indigo-400">
                          Independent Accessibility Consultant
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-950 to-black rounded-xl p-6 border border-indigo-800/30">
                  <div className="flex items-start gap-4">
                    <div className="bg-indigo-900/50 h-10 w-10 rounded-full flex-shrink-0"></div>
                    <div>
                      <div className="mb-3">
                        <div className="flex gap-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className="h-4 w-4 bg-yellow-400 rounded-sm"
                            ></div>
                          ))}
                        </div>
                        <p className="text-lg italic mb-4">
                          "Before AllyShip, we spent 3-4 hours per client just
                          setting up access to their authenticated pages. Now we
                          simply log in and test immediately. Game-changer for
                          our agency."
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold">Maria Johnson</p>
                        <p className="text-sm text-indigo-400">
                          Accessibility Agency Founder
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ContentSection>

            {/* Pricing */}
            <ContentSection id="pricing" title="Consultant-Friendly Pricing">
              <div className="grid md:grid-cols-2 gap-6 mb-10">
                <div className="bg-gradient-to-br from-indigo-950 to-black rounded-xl p-8 border border-indigo-800/30">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-1">Consultant</h3>
                      <p className="text-indigo-300">
                        For independent professionals
                      </p>
                    </div>
                    <div className="bg-indigo-900/40 px-3 py-1 rounded-full text-xs font-medium text-indigo-300">
                      MOST POPULAR
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">$99</span>
                      <span className="text-indigo-400 ml-2">/month</span>
                    </div>
                    <p className="text-sm text-indigo-400">
                      or $990/year (save $198)
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    <li className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                      <span>Unlimited clients</span>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                      <span>Full authenticated testing</span>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                      <span>Up to 25 pages per client</span>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                      <span>Basic white-label reports</span>
                    </li>
                  </ul>

                  <Button size="lg" className="w-full">
                    Start 14-Day Free Trial
                  </Button>
                </div>

                <div className="bg-gradient-to-br from-indigo-950 to-black rounded-xl p-8 border border-indigo-800/30">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-1">Agency</h3>
                    <p className="text-indigo-300">For growing consultancies</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">$349</span>
                      <span className="text-indigo-400 ml-2">/month</span>
                    </div>
                    <p className="text-sm text-indigo-400">
                      or $3,490/year (save $698)
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    <li className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                      <span>Up to 5 team members</span>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                      <span>Unlimited clients</span>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                      <span>Up to 50 pages per client</span>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                      <span>Advanced white-label reports</span>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                      <span>Client portal access</span>
                    </li>
                  </ul>

                  <Button size="lg" className="w-full">
                    Contact Sales
                  </Button>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl font-semibold mb-2">
                    Need a custom plan?
                  </h3>
                  <p className="text-indigo-100">
                    Let's discuss your specific requirements
                  </p>
                </div>
                <Button variant="secondary" size="lg">
                  Schedule Consultation
                </Button>
              </div>
            </ContentSection>

            {/* FAQ */}
            <ContentSection id="faq" title="Frequently Asked Questions">
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-indigo-950 to-black rounded-xl p-6 border border-indigo-800/30">
                  <h3 className="text-xl font-semibold mb-3">
                    How does AllyShip test authenticated pages without my
                    credentials?
                  </h3>
                  <p className="text-indigo-300">
                    AllyShip works directly in your browser. You log in as
                    usual, and our extension scans what's already loaded in your
                    browser. Your credentials are never shared, stored, or
                    transmitted to us.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-indigo-950 to-black rounded-xl p-6 border border-indigo-800/30">
                  <h3 className="text-xl font-semibold mb-3">
                    Does it work with all types of authentication?
                  </h3>
                  <p className="text-indigo-300">
                    Yes. Form logins, SSO, multi-factor authentication, OAuth –
                    if you can access it in Chrome, AllyShip can scan it.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-indigo-950 to-black rounded-xl p-6 border border-indigo-800/30">
                  <h3 className="text-xl font-semibold mb-3">
                    Can I white-label reports for my clients?
                  </h3>
                  <p className="text-indigo-300">
                    Absolutely. Add your branding, customize templates, and
                    deliver professional reports that showcase your expertise.
                  </p>
                </div>
              </div>
            </ContentSection>

            {/* Final CTA */}
            <div className="bg-gradient-to-br from-indigo-800 via-indigo-700 to-blue-800 rounded-2xl p-10 text-center mt-20">
              <h2 className="text-3xl font-bold mb-4">
                Ready to transform your consulting workflow?
              </h2>
              <p className="text-xl mb-8 max-w-xl mx-auto">
                Join accessibility professionals who have revolutionized their
                testing with AllyShip's zero-setup approach.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-indigo-900 hover:bg-indigo-100"
                >
                  <Link href="/register">
                    Start 14-Day Free Trial{' '}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="border-white hover:bg-white/20"
                >
                  <Link href="/demo">Schedule Demo</Link>
                </Button>
              </div>

              <p className="text-sm text-indigo-200">
                No credit card required. Full access to authenticated testing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
