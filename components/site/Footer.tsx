"use client"

import { Badge } from "@/components/ui/badge"

import { RouterLink } from "../RouterLink"
import { Logo } from "./Logo"

const sections = [
  {
    title: "Services",
    links: [
      { name: "e2e tests", href: null },
      { name: "a11y e2e tests", href: "/services/a11y-e2e-tests" },
      { name: "a11y audits", href: null },
      { name: "a11y courses", href: null },
      // { name: "workshops", href: "#" },
      // { name: "Integrations", href: "#" },
      // { name: "Pricing", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      // { name: "Team", href: "/team" },
      { name: "Blog", href: "/blog" },
      // { name: "Careers", href: "/jobs" },
      { name: "Contact", href: "/contact" },
      // { name: "Newsletter", href: "/newsletter" },
      { name: "Brand", href: "/brand" },
    ],
  },
  {
    title: "Resources",
    links: [
      // { name: "Help", href: "#" },
      // { name: "Sales" },
      // { name: "Advertise", href: "#" },
      { name: "Privacy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
      { name: "Imprint", href: "/imprint" },
      { name: "Glossary", href: "/glossary" },
    ],
  },
  {
    title: "Social",
    links: [
      { name: "Twitter", href: "https://x.com/aleksejdix" },
      {
        name: "LinkedIn",
        href: "https://www.linkedin.com/company/allyship-dev",
      },
      { name: "GitHub", href: "https://github.com/AleksejDix" },
      {
        name: "Bluesky",
        href: "https://bsky.app/profile/aleksejdix.bsky.social",
      },
    ],
  },
]

export const Footer = () => {
  return (
    <footer aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <section className="pb-4 pt-8">
        <div className="container">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
            <div className="col-span-2 mb-8 lg:mb-0">
              <Logo />
              <p className="font-bold text-pretty max-w-44">
                We can make the web more accessible.
              </p>
            </div>
            {sections.map((section, sectionIdx) => (
              <nav
                key={sectionIdx}
                aria-labelledby={`footer-section-${sectionIdx}`}
              >
                <h3
                  className="mb-4 font-bold"
                  id={`footer-section-${sectionIdx}`}
                >
                  {section.title}
                </h3>
                <ul
                  className="space-y-4 text-muted-foreground"
                  aria-labelledby={`footer-section-${sectionIdx}`}
                >
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="font-medium hover:text-primary"
                    >
                      {link.href ? (
                        <RouterLink href={link.href}>{link.name}</RouterLink>
                      ) : (
                        <a aria-disabled="true" className="cursor-not-allowed">
                          {link.name} <Badge variant="outline">Soon</Badge>
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
          <div className="mt-24 flex flex-col justify-between gap-4 border-t pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
            <p>© 2024 Allyship. All rights reserved.</p>
            <ul className="flex gap-4">
              <li className="underline hover:text-primary">
                <RouterLink href="/imprint">Imprint</RouterLink>
              </li>
              <li className="underline hover:text-primary">
                <RouterLink href="/terms">Terms</RouterLink>
              </li>
              <li className="underline hover:text-primary">
                <RouterLink href="/privacy">Privacy</RouterLink>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </footer>
  )
}
