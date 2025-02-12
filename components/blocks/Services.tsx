import {
  Accessibility,
  BadgeCheck,
  Code,
  Eye,
  PersonStanding,
  Scale,
} from "lucide-react"

const services = [
  {
    name: "E2E Accessibility Testing",
    description:
      "Comprehensive end-to-end tests to ensure your web apps are accessible to all users.",
    icon: Accessibility,
  },
  {
    name: "Accessibility Audits",
    description:
      "In-depth audits to identify accessibility issues and provide actionable recommendations.",
    icon: Eye,
  },
  {
    name: "Accessibility Compliance",
    description:
      "Ensure your applications meet WCAG and ADA compliance standards.",
    icon: Scale,
  },
  {
    name: "Accessibility Training",
    description:
      "Empower your team with the knowledge to build and maintain accessible applications.",
    icon: PersonStanding,
  },
  {
    name: "Automated E2E Testing",
    description:
      "Automated testing to catch accessibility issues early in development.",
    icon: BadgeCheck,
  },
  {
    name: "Vue.js Frontend Consulting",
    description:
      "Expert guidance to optimize your frontend for performance, accessibility, and scalability.",
    icon: Code,
  },
]

export function Services() {
  return (
    <section className="py-28">
      <div className="max-w-4xl mx-auto px-8">
        <header className="max-w-xl mx-auto lg:text-center">
          <h2 className="text-2xl font-bold md:text-3xl text-pretty font-display">
            Services to Build Inclusive Digital Experiences
          </h2>
          <p className="text-foreground/60 mt-6 md:text-lg">
            From training your team to ensuring compliance, we provide the tools
            and expertise to create accessible and user-friendly applications.
          </p>
        </header>

        <div className="max-w-2xl mx-auto mt-16 md:mt-20 lg:mt-24 lg:max-w-4xl">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2 lg:gap-y-16">
            {services.map((service) => (
              <div key={service.name} className="relative pl-16">
                <div className="font-semibold">
                  <div className="absolute left-0 top-0 flex w-9 h-9 items-center justify-center rounded-lg bg-blue-500/15 text-blue-500 border-foreground">
                    <service.icon aria-hidden="true" size={16} />
                  </div>
                  {service.name}
                </div>
                <div className="text-foreground/60 mt-2">
                  {service.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
