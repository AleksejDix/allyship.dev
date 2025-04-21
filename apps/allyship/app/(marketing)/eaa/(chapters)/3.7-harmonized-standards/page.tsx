import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, List, ExternalLink } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import {
  INTRODUCTION_LINKS,
  COMPLIANCE_LINKS,
  REQUIREMENTS_LINKS,
  EXCEPTIONS_LINKS,
} from '../../constants/links'

export const metadata: Metadata = {
  title: 'Harmonized Standards & Technical Specifications | EAA Guide',
  description:
    'Understand how harmonized standards and technical specifications support EAA compliance and provide presumption of conformity.',
}

export default function HarmonizedStandardsPage() {
  return (
    <section className="py-10 px-4 md:px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="prose dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold mb-6">
            Harmonized Standards and Technical Specifications
          </h1>

          <p className="lead text-xl text-muted-foreground mb-6">
            Harmonized standards and technical specifications help businesses
            comply with the European Accessibility Act (EAA) by providing clear,
            practical ways to meet the requirements.
          </p>

          <section aria-labelledby="eaa-overview">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="eaa-overview"
              tabIndex={-1}
            >
              What are Harmonized Standards?
            </h2>
            <div className="space-y-4">
              <p>
                Harmonized standards are technical documents that provide
                specific details on how to meet legal requirements. They are:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Created by recognized European standards organizations (like
                  CEN, CENELEC, and ETSI)
                </li>
                <li>Requested by the European Commission to support EU laws</li>
                <li>Published in the Official Journal of the European Union</li>
                <li>
                  Voluntary to use — you can choose to follow them or find other
                  ways to comply with the EAA
                </li>
              </ul>

              <p>
                These standards play a crucial role in the EAA by translating
                general accessibility requirements into practical technical
                guidance.
              </p>
            </div>
          </section>

          <section aria-labelledby="eaa-conformity">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="eaa-conformity"
              tabIndex={-1}
            >
              Presumption of Conformity
            </h2>
            <div className="space-y-4">
              <p>
                When you follow harmonized standards to make your products or
                services accessible, you get a "presumption of conformity" —
                meaning authorities will assume you're meeting the EAA
                requirements covered by those standards.
              </p>
              <p>This presumption:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Provides legal protection during market surveillance checks
                </li>
                <li>
                  Helps simplify compliance by giving you clear guidelines
                </li>
                <li>Reduces your risk of non-compliance issues</li>
              </ul>
              <p>
                Remember that using harmonized standards is voluntary. You can
                choose other methods to comply with the EAA, but you'll need to
                demonstrate how your approach meets the accessibility
                requirements.
              </p>
            </div>
          </section>

          <section aria-labelledby="eaa-tech-specs">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="eaa-tech-specs"
              tabIndex={-1}
            >
              Technical Specifications
            </h2>
            <div className="space-y-4">
              <p>
                Technical specifications are temporary solutions used when
                harmonized standards don't yet exist for certain accessibility
                requirements. They:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fill gaps until full harmonized standards are developed</li>
                <li>Are adopted by the European Commission</li>
                <li>Also provide presumption of conformity when followed</li>
              </ul>
              <p>
                For example, if there's no harmonized standard yet for making
                e-books accessible, the Commission might issue technical
                specifications to guide publishers until a full standard is
                available.
              </p>
            </div>
          </section>

          <section aria-labelledby="eaa-benefits">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="eaa-benefits"
              tabIndex={-1}
            >
              Benefits of Using Standards
            </h2>
            <div className="space-y-4">
              <p>Following harmonized standards offers several advantages:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Legal certainty:</strong> Evidence that you're meeting
                  legal requirements
                </li>
                <li>
                  <strong>Simplified compliance:</strong> Clear instructions on
                  how to make products and services accessible
                </li>
                <li>
                  <strong>Reduced testing costs:</strong> Standards provide
                  established testing methods
                </li>
                <li>
                  <strong>Market access:</strong> Products meeting standards can
                  be marketed throughout the EU
                </li>
                <li>
                  <strong>Innovation support:</strong> Standards provide a
                  foundation while allowing for creative solutions
                </li>
                <li>
                  <strong>Consistent quality:</strong> Standards ensure
                  reliability for users with disabilities
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="eaa-partial-conformity">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="eaa-partial-conformity"
              tabIndex={-1}
            >
              Partial Conformity
            </h2>
            <div className="space-y-4">
              <p>
                Important: The presumption of conformity only applies to parts
                of your product or service that are actually covered by the
                standards you're using.
              </p>
              <p>
                For example, if you follow a standard for making your website's
                text accessible, but the standard doesn't cover video content,
                you'll need to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Get presumption of conformity for the text elements</li>
                <li>
                  Find other ways to demonstrate compliance for your video
                  content
                </li>
              </ul>
              <p>
                Always check exactly what aspects of accessibility each standard
                covers and ensure you address all relevant EAA requirements.
              </p>
            </div>
          </section>

          <section aria-labelledby="eaa-finding-standards">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="eaa-finding-standards"
              tabIndex={-1}
            >
              Finding and Using Relevant Standards
            </h2>
            <div className="space-y-4">
              <p>To find and apply standards for your business:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  <strong>Identify applicable standards:</strong> Check the
                  Official Journal of the EU for harmonized standards supporting
                  the EAA
                </li>
                <li>
                  <strong>Assess relevance:</strong> Determine which standards
                  apply to your specific products or services
                </li>
                <li>
                  <strong>Obtain standards:</strong> Purchase or access
                  standards through your national standards organization
                </li>
                <li>
                  <strong>Apply requirements:</strong> Implement the technical
                  specifications in your design and development processes
                </li>
                <li>
                  <strong>Document compliance:</strong> Keep records of how
                  you've applied standards to demonstrate conformity
                </li>
                <li>
                  <strong>Stay updated:</strong> Monitor for new or revised
                  standards that may affect your products
                </li>
              </ol>
              <p>
                The European standardization process is ongoing, with new
                standards continuously being developed to address new
                technologies and improve existing requirements. For the EAA:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The European Commission works with European standardization
                  organizations to identify gaps where standards are needed.
                </li>
                <li>
                  The Commission issues requests to develop new harmonized
                  standards where needed.
                </li>
                <li>
                  Stakeholders, including organizations representing persons
                  with disabilities, participate in the standards development
                  process.
                </li>
                <li>
                  Technical specifications may be developed as temporary
                  measures while standard development is in progress.
                </li>
              </ul>
              <p>
                Businesses should regularly check for updates to ensure they are
                using the most current standards for compliance.
              </p>
            </div>
          </section>

          <section aria-labelledby="eaa-references">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="eaa-references"
              tabIndex={-1}
            >
              References
            </h2>
            <div className="space-y-4">
              <p>
                The information on this page relates to the following articles
                and recitals of the European Accessibility Act:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <Link
                    href="/eaa/article-15"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Article 15: Harmonized standards and technical
                    specifications
                  </Link>
                  : Sets up the framework for using standards and specifications
                  for presumption of conformity.
                </li>
                <li>
                  <Link
                    href="/eaa/article-27#paragraph-2"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Article 27(2): Committee procedure
                  </Link>
                  : Refers to the process for adopting technical specifications.
                </li>
                <li>
                  <Link
                    href="/eaa/recitals#recital-57"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Recital 57
                  </Link>
                  : Presumption of conformity based on harmonized standards.
                </li>
                <li>
                  <Link
                    href="/eaa/recitals#recital-58"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Recital 58
                  </Link>
                  : Use of technical specifications when harmonized standards
                  are not available.
                </li>
                <li>
                  <Link
                    href="/eaa/recitals#recital-59"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Recital 59
                  </Link>
                  : Process for developing technical specifications, including
                  stakeholder involvement.
                </li>
                <li>
                  <Link
                    href="/eaa/recitals#recital-60"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Recital 60
                  </Link>
                  : Conditions under which the Commission adopts technical
                  specifications.
                </li>
              </ul>
            </div>
          </section>

          <footer>
            <nav
              className="flex justify-end items-center mt-10 pt-4 border-t"
              aria-labelledby="footer-nav-heading"
            >
              <h2 id="footer-nav-heading" className="sr-only">
                Chapter navigation
              </h2>
              <Button asChild id="next-chapter-button">
                <Link
                  href={EXCEPTIONS_LINKS.FUNDAMENTAL_ALTERATION.fullPath}
                  className="no-underline"
                  aria-labelledby="next-chapter-label"
                >
                  <span id="next-chapter-label">Fundamental Alteration</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </Button>
            </nav>
          </footer>
        </div>
      </div>
    </section>
  )
}
