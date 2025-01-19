"use client"

import { RouterLink } from "../RouterLink"
import { Logo } from "./Logo"

const sections = [
  {
    title: "Product",
    links: [
      { name: "e2e tests", href: "#" },
      { name: "a11y audits", href: "#" },
      { name: "a11y courses", href: "#" },
      // { name: "workshops", href: "#" },
      // { name: "Integrations", href: "#" },
      // { name: "Pricing", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Team", href: "/team" },
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/jobs" },
      { name: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      // { name: "Help", href: "#" },
      // { name: "Sales" },
      // { name: "Advertise", href: "#" },
      { name: "Privacy", href: "/privacy" },
      { name: "Terms and Conditions", href: "/terms" },
      { name: "Imprint", href: "/imprint" },
    ],
  },
  {
    title: "Social",
    links: [
      { name: "Twitter", href: "#" },
      { name: "Instagram", href: "#" },
      { name: "LinkedIn", href: "#" },
    ],
  },
]

export const Footer = () => {
  return (
    <footer>
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
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold">{section.title}</h3>
                <ul className="space-y-4 text-muted-foreground">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="font-medium hover:text-primary"
                    >
                      {link.href ? (
                        <RouterLink href={link.href}>{link.name}</RouterLink>
                      ) : (
                        <a aria-disabled="true">{link.name}</a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-24 flex flex-col justify-between gap-4 border-t pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
            <p>© 2024 Allyship. All rights reserved.</p>
            <ul className="flex gap-4">
              <li className="underline hover:text-primary">
                <RouterLink href="/imprint">Imprint</RouterLink>
              </li>
              <li className="underline hover:text-primary">
                <RouterLink href="/terms">Terms and Conditions</RouterLink>
              </li>
              <li className="underline hover:text-primary">
                <RouterLink href="/privacy">Privacy Policy</RouterLink>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </footer>
  )
}
