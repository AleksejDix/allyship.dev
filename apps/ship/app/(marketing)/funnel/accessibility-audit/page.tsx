"use client"

import { useState } from "react"
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  DollarSign,
  Timer,
} from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function AuditFunnelPage() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)

  return (
    <div className="min-h-screen">
      {/* Hero Section - Problem/Solution Statement */}
      <section className="bg-gradient-to-b from-red-500/10 via-background to-background border-b border-border">
        <div className="container py-20 text-center">
          <Badge variant="destructive" className="mb-6">
            WARNING: Your Website Might Be Excluding 1 Billion Users
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold max-w-4xl mx-auto mb-6">
            Get Your Free Website Accessibility Score Before You Get Sued
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {
              "61% of accessibility lawsuits target e-commerce sites. Don't wait until it's too late.  Get your comprehensive accessibility audit today."
            }
          </p>
          <Button size="lg" className="bg-red-600 hover:bg-red-700">
            Get Your Free Score Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="container py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          The Real Cost of Inaccessible Websites
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: AlertTriangle,
              title: "Legal Risk",
              description:
                "ADA non-compliance lawsuits increased by 400% in the last 3 years",
            },
            {
              icon: DollarSign,
              title: "Lost Revenue",
              description:
                "You're missing out on $6.9 billion in annual revenue from disabled users",
            },
            {
              icon: Timer,
              title: "Time Bomb",
              description:
                "Every day without accessibility is another day closer to legal action",
            },
          ].map((item) => (
            <Card key={item.title}>
              <CardContent className="pt-6">
                <item.icon className="h-12 w-12 text-red-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-muted/50 border-y border-border">
        <div className="container py-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Trusted by Industry Leaders
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                quote:
                  "The audit helped us identify critical issues we had no idea about. ROI was immediate.",
                author: "Sarah Johnson",
                role: "CTO, E-commerce Giant",
              },
              {
                quote:
                  "Comprehensive, actionable, and worth every penny. Saved us from potential lawsuits.",
                author: "Michael Chen",
                role: "Director of Digital, Fortune 500",
              },
            ].map((testimonial) => (
              <Card key={testimonial.author}>
                <CardContent className="p-6">
                  <p className="text-lg mb-4">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Address Objections */}
      <section className="container py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Common Questions About Our Audit
        </h2>
        <Accordion type="single" collapsible className="max-w-3xl mx-auto">
          {[
            {
              question: "How long does the audit take?",
              answer:
                "Our comprehensive audit takes 5-7 business days. You'll get your initial accessibility score within 24 hours.",
            },
            {
              question: "What's included in the audit?",
              answer:
                "WCAG 2.1 compliance check, detailed reports, prioritized fixes, legal risk assessment, and implementation guidance.",
            },
            {
              question: "Is this a one-time fee?",
              answer:
                "Yes, the audit fee is one-time. We also offer optional ongoing monitoring and support packages.",
            },
            {
              question: "Do I really need this?",
              answer:
                "If your website isn't fully accessible, you're at risk of lawsuits and losing customers. It's not if, but when.",
            },
          ].map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Pricing - The Offer */}
      <section className="bg-muted/50 border-y border-border">
        <div className="container py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Choose Your Audit Package
            </h2>
            <p className="text-xl text-muted-foreground">
              All packages include our 30-day satisfaction guarantee
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Essential",
                price: "997",
                features: [
                  "Basic WCAG 2.1 compliance check",
                  "Accessibility score",
                  "High-level recommendations",
                  "PDF report",
                ],
              },
              {
                name: "Professional",
                price: "1,997",
                features: [
                  "Everything in Essential",
                  "Detailed technical audit",
                  "Legal risk assessment",
                  "Priority fixes list",
                  "60-min consultation",
                ],
              },
              {
                name: "Enterprise",
                price: "4,997",
                features: [
                  "Everything in Professional",
                  "Custom solutions",
                  "Implementation guidance",
                  "3 months support",
                  "Training session",
                ],
              },
            ].map((pkg) => (
              <Card
                key={pkg.name}
                className={`${
                  selectedPackage === pkg.name ? "ring-2 ring-primary" : ""
                }`}
              >
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <p className="text-3xl font-bold mb-6">
                    ${pkg.price}
                    <span className="text-base font-normal text-muted-foreground">
                      /audit
                    </span>
                  </p>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    onClick={() => setSelectedPackage(pkg.name)}
                  >
                    Choose {pkg.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Urgency/Scarcity */}
      <section className="container py-20">
        <Card className="max-w-3xl mx-auto bg-green-900">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Limited Time Offer: Save 20% This Week
            </h2>
            <p className="text-xl mb-8">
              Plus get a free accessibility monitoring dashboard ($497 value)
            </p>
            <Button size="lg" variant="secondary">
              Claim Your Discount Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
