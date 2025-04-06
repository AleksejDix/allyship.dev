import { Metadata } from 'next'
import Link from 'next/link'
import {
  Check,
  ArrowRight,
  FileText,
  Shield,
  LineChart,
  Users,
  Store,
  Code,
} from 'lucide-react'

import { Button } from '@workspace/ui/components/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@workspace/ui/components/card'
import { Badge } from '@workspace/ui/components/badge'
import { BrowserWindow } from '@/components/BrowserWindow'
import { BorderBeam } from '@workspace/ui/components/magicui/border-beam'
import { WhiteLabelLeadForm } from '@/components/blocks/WaitingListForm'

export const metadata: Metadata = {
  title:
    'White Label WCAG 2.1 & 2.2 Audits | European Accessibility Act Compliance | AllyStudio',
  description:
    'Sell WCAG 2.1 & 2.2 accessibility audits under your own brand. Help clients achieve European Accessibility Act (EAA) compliance with branded reports.',
}

export default function WhiteLabelWcagAuditsPage() {
  return (
    <div className="container py-8 md:py-16 space-y-16 relative">
      {/* Hero Section */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(var(--foreground-rgb),0.05),transparent_50%)]"></div>

      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="flex justify-center items-center mb-6">
          <div className="flex justify-center items-center relative overflow-hidden shadow-lg rounded-2xl">
            <Badge variant="outline" className="m-0 leading-none">
              For Agencies & Freelancers
            </Badge>
            <BorderBeam
              size={40}
              initialOffset={20}
              className="from-transparent via-yellow-500 to-transparent absolute inset-0"
            />
          </div>
        </div>

        <div className="space-y-6 text-center">
          <h1 className="text-4xl font-bold md:text-7xl max-w-3xl mx-auto font-display text-pretty">
            Sell WCAG 2.1 & 2.2 Accessibility Audits Under Your Own Brand
          </h1>
          <p className="text-pretty text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl mx-auto">
            We handle the technical work. You deliver branded audit reports to
            your clients — helping them meet WCAG standards and European
            Accessibility Act requirements.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/auth/signup">
              Get a Free Demo Report
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#pricing">View Pricing</Link>
          </Button>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="space-y-10 max-w-5xl mx-auto">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold md:text-5xl max-w-2xl mx-auto font-display text-pretty">
            Why Partner With Us?
          </h2>
          <p className="text-pretty text-lg md:text-xl leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            Expand your service offerings without the overhead of accessibility
            expertise
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="bg-primary/10 w-12 h-12 rounded-md flex items-center justify-center mb-2">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Branded PDF Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Professionally designed audit reports featuring your agency
                logo, colors, and contact information.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="bg-primary/10 w-12 h-12 rounded-md flex items-center justify-center mb-2">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">
                Full WCAG 2.1 & 2.2 Coverage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Comprehensive testing against WCAG 2.1 and 2.2 at A, AA, and AAA
                levels with detailed conformance reporting for European
                Accessibility Act compliance.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="bg-primary/10 w-12 h-12 rounded-md flex items-center justify-center mb-2">
                <LineChart className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">AI-Powered Fixes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Actionable recommendations and code snippets to help your
                clients resolve accessibility issues quickly.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How It Works */}
      <div className="space-y-10 max-w-5xl mx-auto border-t border-border/20 pt-16">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold md:text-5xl max-w-2xl mx-auto font-display text-pretty">
            How It Works
          </h2>
          <p className="text-pretty text-lg md:text-xl leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            A simple four-step process to deliver white-label accessibility
            audits
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                  1
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">
                    Upload Your Branding
                  </h3>
                  <p className="text-muted-foreground">
                    Add your agency logo, colors, and contact information to our
                    platform.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                  2
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">
                    Submit Client Website
                  </h3>
                  <p className="text-muted-foreground">
                    Enter your client's website URL and select the WCAG level to
                    test against.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                  3
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">
                    We Perform the Audit
                  </h3>
                  <p className="text-muted-foreground">
                    Our accessibility experts and automated tools analyze the
                    website thoroughly.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                  4
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">
                    Receive Branded Report
                  </h3>
                  <p className="text-muted-foreground">
                    Download the finished white-label PDF report ready to
                    deliver to your client.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <BrowserWindow url="youragency.com/report">
            <div className="p-4 space-y-4">
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                <div className="w-32 h-8 bg-primary/20 rounded-md text-center text-xs flex items-center justify-center">
                  Your Agency Logo
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-6 bg-muted-foreground/20 rounded-md w-2/3"></div>
                <div className="h-4 bg-muted-foreground/20 rounded-md w-full"></div>
                <div className="h-4 bg-muted-foreground/20 rounded-md w-5/6"></div>
              </div>
              <div className="space-y-2">
                <div className="flex gap-2 items-center">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <div className="h-4 bg-muted-foreground/20 rounded-md w-1/2"></div>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                  <div className="h-4 bg-muted-foreground/20 rounded-md w-2/3"></div>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <div className="h-4 bg-muted-foreground/20 rounded-md w-1/3"></div>
                </div>
              </div>
            </div>
          </BrowserWindow>
        </div>

        <div className="flex justify-center">
          <Button size="lg" asChild>
            <Link href="/auth/signup">
              Request a Free Audit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Who It's For */}
      <div className="space-y-10 max-w-5xl mx-auto border-t border-border/20 pt-16">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold md:text-5xl max-w-2xl mx-auto font-display text-pretty">
            Who It's For
          </h2>
          <p className="text-pretty text-lg md:text-xl leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            Perfect for agencies and businesses looking to expand their service
            offerings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="bg-primary/10 w-12 h-12 rounded-md flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Web Agencies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Include accessibility audits in your care packages or SEO
                services without hiring specialized staff.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="bg-primary/10 w-12 h-12 rounded-md flex items-center justify-center mb-2">
                <Code className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Freelance Developers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Offer professional accessibility audits as an add-on service to
                increase your value and revenue.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="bg-primary/10 w-12 h-12 rounded-md flex items-center justify-center mb-2">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Government Contractors</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Fulfill ADA, Section 508, and European Accessibility Act (EAA)
                compliance requirements with comprehensive, detailed reporting.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="bg-primary/10 w-12 h-12 rounded-md flex items-center justify-center mb-2">
                <Store className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>E-commerce Businesses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Improve user experience and conversion rates by ensuring
                websites meet accessibility standards.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* European Accessibility Act Section */}
      <div className="space-y-10 max-w-5xl mx-auto border-t border-border/20 pt-16">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold md:text-5xl max-w-2xl mx-auto font-display text-pretty">
            European Accessibility Act (EAA) Compliance
          </h2>
          <p className="text-pretty text-lg md:text-xl leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            Help your clients meet growing accessibility regulations in Europe
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">
                Why EAA Compliance Matters
              </h3>
              <p className="text-muted-foreground">
                The European Accessibility Act (EAA) requires businesses serving
                EU customers to make their digital products and services
                accessible, with compliance deadlines approaching soon.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">
                Comprehensive WCAG Compliance
              </h3>
              <p className="text-muted-foreground">
                Our white-label audits assess websites against WCAG 2.1 and 2.2
                standards, which form the technical foundation for EAA
                compliance requirements.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">
                Detailed Compliance Reports
              </h3>
              <p className="text-muted-foreground">
                Provide your clients with branded compliance documentation that
                demonstrates their efforts toward meeting EAA requirements.
              </p>
            </div>
          </div>

          <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">
                Key EAA Requirements Covered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="min-w-4 h-4 text-primary mt-1" />
                  <span>Keyboard accessibility for all functionality</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="min-w-4 h-4 text-primary mt-1" />
                  <span>Text alternatives for non-text content</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="min-w-4 h-4 text-primary mt-1" />
                  <span>Color contrast compliance for text readability</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="min-w-4 h-4 text-primary mt-1" />
                  <span>Navigation and orientation assistance</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="min-w-4 h-4 text-primary mt-1" />
                  <span>Form input labeling and error prevention</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="min-w-4 h-4 text-primary mt-1" />
                  <span>Compatibility with assistive technologies</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/auth/signup">
                  Start Offering EAA Compliance Audits
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Pricing Section */}
      <div
        id="pricing"
        className="space-y-10 max-w-5xl mx-auto border-t border-border/20 pt-16"
      >
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold md:text-5xl max-w-2xl mx-auto font-display text-pretty">
            Pricing Plans
          </h2>
          <p className="text-pretty text-lg md:text-xl leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that works best for your business
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>White Label Lite</CardTitle>
              <CardDescription>
                Automated audit with branded PDF report
              </CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">$100</span>
                <span className="text-muted-foreground">/report</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="min-w-4 h-4 text-primary mt-1" />
                  <span>Automated WCAG 2.1 & 2.2 audit</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="min-w-4 h-4 text-primary mt-1" />
                  <span>Branded PDF report</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="min-w-4 h-4 text-primary mt-1" />
                  <span>Up to 100 pages scanned</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="min-w-4 h-4 text-primary mt-1" />
                  <span>Basic issue reporting</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-primary border-2 bg-card/30 backdrop-blur-sm relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="px-3 py-1">Most Popular</Badge>
            </div>
            <CardHeader>
              <CardTitle>White Label Pro</CardTitle>
              <CardDescription>
                Combined automated and manual audit
              </CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">$300</span>
                <span className="text-muted-foreground">/report</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="min-w-4 h-4 text-primary mt-1" />
                  <span>Everything in Lite, plus:</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="min-w-4 h-4 text-primary mt-1" />
                  <span>Manual expert review</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="min-w-4 h-4 text-primary mt-1" />
                  <span>Screenshots with issue highlights</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="min-w-4 h-4 text-primary mt-1" />
                  <span>Code fix recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="min-w-4 h-4 text-primary mt-1" />
                  <span>Up to 250 pages scanned</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Agency Portal</CardTitle>
              <CardDescription>Dedicated white-label dashboard</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">$499</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="min-w-4 h-4 text-primary mt-1" />
                  <span>Everything in Pro, plus:</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="min-w-4 h-4 text-primary mt-1" />
                  <span>Branded client dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="min-w-4 h-4 text-primary mt-1" />
                  <span>10 reports included monthly</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="min-w-4 h-4 text-primary mt-1" />
                  <span>Team collaboration tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="min-w-4 h-4 text-primary mt-1" />
                  <span>Priority support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Sample Report */}
      <div className="space-y-10 max-w-5xl mx-auto border-t border-border/20 pt-16">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold md:text-5xl max-w-2xl mx-auto font-display text-pretty">
            Sample Report
          </h2>
          <p className="text-pretty text-lg md:text-xl leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            See what your clients will receive
          </p>
        </div>

        <div className="flex justify-center">
          <Card className="max-w-md mx-auto border border-border/40 bg-card/30 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="aspect-[3/4] bg-muted rounded-md mb-4 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-20 h-6 bg-primary/20 rounded-md"></div>
                  <div className="text-lg font-semibold">
                    Sample WCAG 2.1 & 2.2 Audit Report
                  </div>
                  <div className="px-6">
                    <div className="h-32 bg-muted-foreground/10 rounded-md"></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/auth/signup">
                    <FileText className="mr-2 h-4 w-4" />
                    Download Sample PDF
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="space-y-10 max-w-5xl mx-auto border-t border-border/20 pt-16">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold md:text-5xl max-w-2xl mx-auto font-display text-pretty">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">
                Can I resell these audits under my own name?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Absolutely. That's the core value of our white-label model. You
                can resell our WCAG 2.1 & 2.2 audits as your own service with
                your branding and pricing.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">
                Do I need to install anything?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                No. Everything runs in the cloud. We deliver ready-to-use PDF
                reports that you can download and send directly to your clients.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">
                What kind of websites can be audited?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We can audit any website including SPAs, e-commerce sites,
                landing pages, and government portals. Our tools handle modern
                frameworks like React, Vue, and Angular, ensuring compliance
                with both WCAG standards and European Accessibility Act
                requirements.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">
                Can I get a sample before buying?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Yes! Just sign up for a free account and we'll generate a free
                sample audit with your branding that you can use to showcase to
                potential clients.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-5xl mx-auto border-t border-border/20 pt-16">
        <WhiteLabelLeadForm />
      </div>
    </div>
  )
}
