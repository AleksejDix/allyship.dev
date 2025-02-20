import Link from 'next/link'
import { ArrowRight, CheckCircle, FileSearch, Shield, Zap } from 'lucide-react'

import { Button } from '@workspace/ui/components/button'
import { Card, CardContent } from '@workspace/ui/components/card'

export default function AuditsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-background border-b border-border">
        <div className="container py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Manual Accessibility Audit
              </h1>
              <p className="text-xl text-muted-foreground">
                Get a comprehensive evaluation of your website&apos;s
                accessibility. Our expert audit will help you identify and fix
                Our expert audit will help you identify and fix accessibility
                issues, ensuring compliance with WCAG guidelines.
              </p>
              <div className="flex gap-4">
                <Button asChild>
                  <Link href="/contact">
                    Order Manual Audit{' '}
                    <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {[
                {
                  title: 'WCAG 2.1 Compliance',
                  description: 'Full evaluation against latest standards',
                },
                {
                  title: 'Detailed Report',
                  description: 'Comprehensive findings and recommendations',
                },
                {
                  title: 'Expert Review',
                  description: 'Manual testing by accessibility specialists',
                },
                {
                  title: 'Action Plan',
                  description: 'Prioritized fixes and implementation guide',
                },
              ].map(item => (
                <Card key={item.title} className="bg-card/50">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="container py-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Audit Process</h2>
          <p className="text-lg text-muted-foreground">
            We follow a comprehensive four-step process to ensure thorough
            evaluation of your website&apos;s accessibility.
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              icon: FileSearch,
              title: 'Initial Scan',
              description:
                'Automated testing to identify common accessibility issues',
            },
            {
              icon: Shield,
              title: 'Manual Testing',
              description: 'Expert review using assistive technologies',
            },
            {
              icon: CheckCircle,
              title: 'Compliance Check',
              description: 'Evaluation against WCAG 2.1 guidelines',
            },
            {
              icon: Zap,
              title: 'Action Items',
              description: 'Detailed report with prioritized recommendations',
            },
          ].map((item, index) => (
            <Card key={item.title} className="relative">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <span className="absolute -top-4 left-6 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <item.icon className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-semibold text-xl">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* What We Check */}
      <section className="bg-background border-y border-border">
        <div className="container py-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            What We Check
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              [
                'Website Navigation',
                'Form validation',
                'Login and registration Flows',
                'Keyboard navigation',
              ],
              [
                'Semantic HTML structure',
                'ARIA labels and landmarks',
                'Alternative text for images',
                'Multimedia accessibility',
              ],
              [
                'Mobile responsiveness',
                'Dynamic content updates',
                'Document structure and headings',
                'Tab order and focus management',
              ],
            ].map((list, index) => (
              <div key={index} className="space-y-4">
                {list.map(item => (
                  <div key={item} className="flex gap-3">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container py-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the audit package that best fits your needs
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Simple Audit
                  </p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold">1900</span>
                    <span className="text-xl font-semibold ml-2">CHF</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    2 weeks delivery
                  </p>
                </div>
                <div className="space-y-3">
                  {[
                    'Basic WCAG 2.1 compliance check',
                    'Technical report',
                    'Key action items',
                    'Basic recommendations',
                    '14-day support period',
                  ].map(feature => (
                    <div key={feature} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <Button asChild>
                  <Link href="/contact">
                    Order Basic Audit{' '}
                    <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Comprehensive Audit
                  </p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold">5,238</span>
                    <span className="text-xl font-semibold ml-2">CHF</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    4 weeks delivery
                  </p>
                </div>
                <div className="space-y-3">
                  {[
                    'Complete WCAG 2.1 compliance audit',
                    'Detailed technical report',
                    'Prioritized action items',
                    'Implementation recommendations',
                    '30-day support period',
                  ].map(feature => (
                    <div key={feature} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <Button asChild>
                  <Link href="/contact">
                    Order Comprehensive Audit{' '}
                    <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20">
        <Card className="bg-primary-foreground">
          <CardContent className="p-12 text-center space-y-6">
            <h2 className="text-3xl font-bold">
              Ready to Make Your Website Accessible?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get a detailed accessi bility audit and actionable recommendations
              to make your website work for everyone.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/contact">
                  Request Your Audit{' '}
                  <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
