'use client'

import { Button } from '@workspace/ui/components/button'
import { Card, CardContent } from '@workspace/ui/components/card'
import { Badge } from '@workspace/ui/components/badge'
import {
  ArrowRight,
  Bot,
  LineChart,
  Bell,
  Shield,
  Gauge,
  RefreshCcw,
  Workflow,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog'
import { useState } from 'react'

export default function E2ETestingPage() {
  const [showDemoModal, setShowDemoModal] = useState(false)

  return (
    <div className="min-h-screen">
      {/* Demo Modal */}
      <Dialog open={showDemoModal} onOpenChange={setShowDemoModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Product Demo</DialogTitle>
          </DialogHeader>
          <div className="aspect-video relative">
            <iframe
              className="w-full aspect-video"
              src="https://www.youtube.com/embed/Oe-tP6zE4K8?si=sKdlipXhoML3P4SZ"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Hero Section */}
      <section className="border-b border-border">
        <div className="container py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="secondary" className="text-green-600">
                New Service
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Automated Accessibility Monitoring
              </h1>
              <p className="text-xl text-muted-foreground">
                Continuous end-to-end testing to ensure your website stays
                accessible. Catch issues before they affect your users with our
                automated monitoring service.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  Start Monitoring
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setShowDemoModal(true)}
                >
                  View Demo
                </Button>
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {[
                {
                  title: '24/7 Monitoring',
                  description: 'Continuous testing across your entire site',
                },
                {
                  title: 'Instant Alerts',
                  description:
                    'Real-time notifications for accessibility issues',
                },
                {
                  title: 'Detailed Reports',
                  description: 'Comprehensive analytics and trends',
                },
                {
                  title: 'Auto-fixes',
                  description: 'AI-powered suggestions for quick fixes',
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

      {/* Features Section */}
      <section className="container py-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground">
            Our automated system continuously monitors your website for
            accessibility issues, providing real-time alerts and detailed
            reports.
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              icon: Bot,
              title: 'Automated Scans',
              description:
                'Regular automated testing across your entire website',
            },
            {
              icon: LineChart,
              title: 'Trend Analysis',
              description: 'Track accessibility improvements over time',
            },
            {
              icon: Bell,
              title: 'Instant Alerts',
              description: 'Real-time notifications for new issues',
            },
            {
              icon: Shield,
              title: 'Compliance Tracking',
              description: 'Monitor WCAG compliance continuously',
            },
          ].map(item => (
            <Card key={item.title}>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <item.icon className="h-8 w-8 text-green-600 mb-2" />
                  <h3 className="font-semibold text-xl">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="border-y border-border">
        <div className="container py-20">
          <h2 className="text-3xl font-bold text-center mb-12">Key Benefits</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Gauge,
                title: 'Performance Metrics',
                features: [
                  'Page load time monitoring',
                  'Resource usage tracking',
                  'User interaction analysis',
                  'Mobile responsiveness checks',
                ],
              },
              {
                icon: RefreshCcw,
                title: 'Continuous Testing',
                features: [
                  '24/7 automated monitoring',
                  'Cross-browser testing',
                  'Device compatibility',
                  'Regular compliance checks',
                ],
              },
              {
                icon: Workflow,
                title: 'Integration Ready',
                features: [
                  'CI/CD pipeline integration',
                  'API access',
                  'Custom webhook support',
                  'Third-party tool connections',
                ],
              },
            ].map(section => (
              <Card key={section.title} className="bg-card/50">
                <CardContent className="p-6">
                  <section.icon className="h-8 w-8 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-4">
                    {section.title}
                  </h3>
                  <div className="space-y-3">
                    {section.features.map(feature => (
                      <div key={feature} className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-600" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20">
        <Card className="bg-green-500/5 border-green-500/20">
          <CardContent className="p-12 text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to Start Monitoring?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Keep your website accessible 24/7 with automated testing and
              monitoring. Start your free trial today.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Schedule Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
