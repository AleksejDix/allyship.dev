import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardTitle, CardDescription, CardHeader } from "@/components/ui/card"
import { ArrowRight, Bot, FileSearch, Users, Code } from "lucide-react"
import Link from "next/link"
import { PageHeader } from '@/components/page-header'
import { Separator } from "@/components/ui/separator"

const services = [
  {
    title: "Accessibility Audits",
    description: "Get a comprehensive evaluation of your website's accessibility compliance with WCAG guidelines.",
    icon: FileSearch,
    features: [
      "Manual expert review",
      "Detailed compliance report",
      "Prioritized fixes",
      "Implementation guidance"
    ],
    href: "/services/audits",

  },
  {
    title: "Automated Monitoring",
    description: "Continuous end-to-end testing to ensure your website stays accessible 24/7.",
    icon: Bot,
    features: [
      "Real-time monitoring",
      "Instant issue alerts",
      "Trend analysis",
      "Automated fixes"
    ],
    href: "/services/a11y-e2e-tests",

  },
  {
    title: "Accessibility Training",
    description: "Empower your team with the knowledge and skills to build accessible websites.",
    icon: Users,
    features: [
      "Interactive workshops",
      "Best practices",
      "Hands-on exercises",
      "Certification"
    ],
    href: "/services/courses",

  },
  {
    title: "Development Support",
    description: "Expert assistance in implementing accessible features and fixing issues.",
    icon: Code,
    features: [
      "Code review",
      "Implementation help",
      "Technical consulting",
      "Custom solutions"
    ],
    href: "/services/e2e-testing",

  }
]

export default function ServicesPage() {
  return (
    <main className="container py-8">
      {/* Hero Section */}


        <PageHeader
          heading="Services"
          description="Comprehensive solutions to help make your digital products accessible to everyone."
        />

      <Separator className="my-4" />

      {/* Services Grid */}
      <section
        className=" py-8"
        aria-labelledby="services-heading"
      >
        <h2 id="services-heading" className="sr-only">Our Services</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service) => (
            <Card
              key={service.title}
            >
                <CardHeader>


                <CardTitle>{service.title}</CardTitle>
                <CardDescription >
                  {service.description}
                </CardDescription>
                </CardHeader>
              <CardContent>
                <ul>
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                >
                  <Link href={service.href}>
                    Learn more about {service.title}
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="container py-16 border-t border-border"
        aria-labelledby="cta-heading"
      >
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2
            id="cta-heading"
            className="text-3xl font-bold sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80"
          >
            Not Sure Which Service You Need?
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Schedule a free consultation with our accessibility experts.
            We'll help you choose the right solution for your needs.
          </p>
          <Button
            size="lg"
            className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 motion-safe:transform"
          >
            Book a Free Consultation
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </section>
    </main>
  )
}
