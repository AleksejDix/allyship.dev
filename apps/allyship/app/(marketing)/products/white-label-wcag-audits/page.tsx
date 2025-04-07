import { Metadata } from 'next'
import Link from 'next/link'
import {
  Check,
  ArrowRight,
  FileText,
  Shield,
  LineChart,
  Users,
  Star,
  X,
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

function Testimonial({
  quote,
  author,
  company,
  avatar,
}: {
  quote: string
  author: string
  company: string
  avatar: string
}) {
  return (
    <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
      <CardContent className="pt-6 space-y-4">
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map(n => (
            <Star key={n} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <p className="text-muted-foreground italic">"{quote}"</p>
        <div className="flex items-center space-x-3">
          <div className="relative h-10 w-10 rounded-full bg-primary/10 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-primary font-semibold">
              {avatar}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">{author}</p>
            <p className="text-xs text-muted-foreground">{company}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function WhiteLabelWcagAuditsPage() {
  return (
    <div className="container py-8 md:py-12 space-y-12 relative">
      {/* Hero Section */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(var(--foreground-rgb),0.05),transparent_50%)]"></div>

      <div className="space-y-6 max-w-5xl mx-auto">
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

        <div className="space-y-4 text-center">
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

      {/* Trust Signals */}
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap justify-center gap-6 py-4 text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span className="text-sm font-medium">
              WCAG 2.1 & 2.2 Compliant
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span className="text-sm font-medium">20+ Agency Partners</span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span className="text-sm font-medium">500+ Audits Delivered</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">4.9/5 Customer Rating</span>
          </div>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold md:text-4xl max-w-2xl mx-auto font-display text-pretty">
            Why Partner With Us?
          </h2>
          <p className="text-pretty text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
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
      <div className="space-y-8 max-w-5xl mx-auto border-t border-border/20 pt-12">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold md:text-4xl max-w-2xl mx-auto font-display text-pretty">
            How It Works
          </h2>
          <p className="text-pretty text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            A simple four-step process to deliver white-label accessibility
            audits
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                1
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">Upload Your Branding</h3>
                <p className="text-muted-foreground">
                  Add your agency logo, colors, and contact information to our
                  platform.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                2
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">Submit Client Website</h3>
                <p className="text-muted-foreground">
                  Enter your client's website URL and select the WCAG level to
                  test against.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                3
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">We Perform the Audit</h3>
                <p className="text-muted-foreground">
                  Our accessibility experts and automated tools analyze the
                  website thoroughly.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                4
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">
                  Receive Branded Report
                </h3>
                <p className="text-muted-foreground">
                  Download the finished white-label PDF report ready to deliver
                  to your client.
                </p>
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
      </div>

      {/* Testimonials */}
      <div className="space-y-8 max-w-5xl mx-auto border-t border-border/20 pt-12">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold md:text-4xl max-w-2xl mx-auto font-display text-pretty">
            What Our Partners Say
          </h2>
          <p className="text-pretty text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            Hear from agencies already offering white-label accessibility audits
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Testimonial
            quote="This has been a game-changer for our agency. We now offer accessibility audits to all our web design clients at a premium price point."
            author="Sarah Johnson"
            company="Pixel Perfect Design"
            avatar="SJ"
          />
          <Testimonial
            quote="The white-label reports are so professional that clients think we have an in-house accessibility team. Great for our brand!"
            author="Michael Torres"
            company="WebForce Agency"
            avatar="MT"
          />
          <Testimonial
            quote="Our government clients are thrilled with the detailed EAA compliance reporting. It's opened up a whole new market for us."
            author="Emma Chen"
            company="Accessible UX"
            avatar="EC"
          />
        </div>
      </div>

      {/* Pricing Section */}
      <div
        id="pricing"
        className="space-y-8 max-w-5xl mx-auto border-t border-border/20 pt-12"
      >
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold md:text-4xl max-w-2xl mx-auto font-display text-pretty">
            Pricing Plans
          </h2>
          <p className="text-pretty text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that works best for your business
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Accessibility Audit</CardTitle>
              <CardDescription>
                Standard audit with AllyStudio branding
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
                  <span>Up to 100 pages scanned</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="min-w-4 h-4 text-primary mt-1" />
                  <span>Basic issue reporting</span>
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <X className="min-w-4 h-4 text-red-400 mt-1" />
                  <span>No white labeling (AllyStudio branded)</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline" asChild>
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
                <li className="flex items-start gap-2 font-medium">
                  <Check className="min-w-4 h-4 text-green-500 mt-1" />
                  <span>Fully white labeled with your branding</span>
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
                <li className="flex items-start gap-2 font-medium">
                  <Check className="min-w-4 h-4 text-green-500 mt-1" />
                  <span>Advanced white labeling options</span>
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

      {/* European Accessibility Act (Condensed) */}
      <div className="space-y-8 max-w-5xl mx-auto border-t border-border/20 pt-12">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold md:text-4xl max-w-2xl mx-auto font-display text-pretty">
            European Accessibility Act (EAA) Compliance
          </h2>
          <p className="text-pretty text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            Help your clients meet growing accessibility regulations in Europe
          </p>
        </div>

        <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">
                  Why EAA Compliance Matters
                </h3>
                <p className="text-muted-foreground">
                  The European Accessibility Act requires businesses serving EU
                  customers to make their digital products accessible, with
                  deadlines approaching soon.
                </p>
                <h3 className="text-xl font-semibold">
                  Comprehensive Compliance
                </h3>
                <p className="text-muted-foreground">
                  Our audits assess websites against WCAG 2.1 and 2.2 standards,
                  the technical foundation for EAA compliance requirements.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">
                  Key Requirements Covered
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-start gap-2">
                    <Check className="min-w-4 h-4 text-primary mt-1" />
                    <span className="text-sm">Keyboard accessibility</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="min-w-4 h-4 text-primary mt-1" />
                    <span className="text-sm">Text alternatives</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="min-w-4 h-4 text-primary mt-1" />
                    <span className="text-sm">Color contrast compliance</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="min-w-4 h-4 text-primary mt-1" />
                    <span className="text-sm">Navigation assistance</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="min-w-4 h-4 text-primary mt-1" />
                    <span className="text-sm">Form input labeling</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="min-w-4 h-4 text-primary mt-1" />
                    <span className="text-sm">
                      Assistive tech compatibility
                    </span>
                  </div>
                </div>
                <Button className="w-full mt-2" asChild>
                  <Link href="/auth/signup">
                    Start Offering EAA Compliance Audits
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ (Condensed) */}
      <div className="space-y-8 max-w-5xl mx-auto border-t border-border/20 pt-12">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold md:text-4xl max-w-2xl mx-auto font-display text-pretty">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                Can I resell these audits under my own name?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Absolutely. That's the core value of our white-label model. You
                can resell our WCAG 2.1 & 2.2 audits as your own service with
                your branding and pricing.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                Do I need to install anything?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No. Everything runs in the cloud. We deliver ready-to-use PDF
                reports that you can download and send directly to your clients.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                What kind of websites can be audited?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We can audit any website including SPAs, e-commerce sites, and
                government portals. Our tools handle modern frameworks like
                React, Vue, and Angular.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                Can I get a sample before buying?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Yes! Just sign up for a free account and we'll generate a free
                sample audit with your branding that you can use to showcase to
                potential clients.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-5xl mx-auto border-t border-border/20 pt-12">
        <WhiteLabelLeadForm />
      </div>
    </div>
  )
}
