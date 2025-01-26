import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ArrowRight, Bot, FileSearch, Users, Code } from "lucide-react"
import Link from "next/link"

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
    gradient: "from-blue-500/10 via-blue-500/5 to-background",
    accent: "text-blue-600",
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
    gradient: "from-green-500/10 via-green-500/5 to-background",
    accent: "text-green-600"
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
    gradient: "from-purple-500/10 via-purple-500/5 to-background",
    accent: "text-purple-600"
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
    gradient: "from-orange-500/10 via-orange-500/5 to-background",
    accent: "text-orange-600"
  }
]

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section
        className="bg-gradient-to-b from-primary/10 via-background to-background border-b"
        aria-labelledby="hero-heading"
      >
        <div className="container py-24 sm:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1
              id="hero-heading"
              className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80"
            >
              Accessibility Services
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Comprehensive solutions to help make your digital products accessible to everyone.
              Choose the service that best fits your needs.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section
        className="container py-24 sm:py-32"
        aria-labelledby="services-heading"
      >
        <h2 id="services-heading" className="sr-only">Our Services</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service) => (
            <Card
              key={service.title}
              className={`group overflow-hidden bg-gradient-to-br ${service.gradient} border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] motion-safe:transform`}
            >
              <CardContent className="p-8">
                <service.icon
                  className={`h-12 w-12 ${service.accent} mb-6 transition-transform group-hover:scale-110 motion-safe:transform`}
                  aria-hidden="true"
                />
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-3 mb-8" role="list">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div
                        className={`h-2 w-2 rounded-full ${service.accent.replace('text', 'bg')}`}
                        aria-hidden="true"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-8 pt-0">
                <Button
                  asChild
                  className="w-full group-hover:translate-x-1 transition-transform motion-safe:transform"
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
        className="container py-24 sm:py-32 border-t"
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
