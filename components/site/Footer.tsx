"use client"

import { Badge } from "@/components/ui/badge"
import ThemeToggle from "@/components/ThemeToggle"

import { RouterLink } from "../RouterLink"
import { Logo } from "./Logo"

const sections = [
  {
    title: "Products",
    links: [
      {
        name: "Automated Audit",
        href: "/products/automated-accessibility-scanning",
      },
      { name: "Manual Audit", href: "/products/manual-accessibility-audit" },
      {
        name: "Focus Bookmarklet",
        href: "/products/focus-bookmarklet",
      },
      {
        name: "Heading Bookmarklet",
        href: "/products/heading-order-bookmarklet",
      },
    ],
  },
  {
    title: "Company",
    links: [
      // { name: "Help", href: "#" },
      // { name: "Sales" },
      // { name: "Advertise", href: "#" },
      { name: "About", href: "/about" },
      { name: "Privacy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
      { name: "Legal", href: "/legal" },
    ],
  },
  {
    title: "Education",
    links: [
      { name: "Courses", href: "/education/courses" },
      { name: "Checklist", href: "/education/checklist" },
      { name: "Blog", href: "/blog" },
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

// Add a helper function to check if a URL is external
const isExternalUrl = (url: string) => {
  return url.startsWith("http") || url.startsWith("https")
}

export const Footer = () => {
  return (
    <footer aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Site Navigation
      </h2>
      <section className="pb-4 pt-8">
        <div className="container">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
            <div className="col-span-2 mb-8 lg:mb-0">
              <Logo />
              <p className="text-pretty pl-[62px] relative bottom-[12px] font-display">
                Learn & Audit Studio
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
                        isExternalUrl(link.href) ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-labelledby={`external-link-${sectionIdx}-${linkIdx}`}
                          >
                            {link.name}
                            <span
                              id={`external-link-${sectionIdx}-${linkIdx}`}
                              className="sr-only"
                            >
                              {link.name} (opens in new window)
                            </span>
                          </a>
                        ) : (
                          <RouterLink href={link.href}>{link.name}</RouterLink>
                        )
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
          <div className="mt-24 flex flex-col justify-between gap-4 border-t border-border pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
            <p>© 2024 Allyship. All rights reserved.</p>

            <ul className="flex gap-4">
              <li>
                <ThemeToggle />
              </li>
              <li className="hover:text-primary">
                <RouterLink href="/imprint">Imprint</RouterLink>
              </li>
              <li className="hover:text-primary">
                <RouterLink href="/terms">Terms</RouterLink>
              </li>
              <li className="hover:text-primary">
                <RouterLink href="/privacy">Privacy</RouterLink>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </footer>
  )
}
