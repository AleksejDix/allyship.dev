import React from 'react'
import { Metadata } from 'next'
import { ChapterNavigation } from '../../components/ChapterNavigation'

export const metadata: Metadata = {
  title: 'Service Accessibility Requirements | European Accessibility Act',
  description:
    'Comprehensive guide to service accessibility requirements under the European Accessibility Act, including digital content, websites, and mobile applications.',
}

export default function ServiceRequirementsPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 id="page-title" className="text-4xl font-bold mb-[23px]">
            Service Accessibility Requirements.
          </h1>

          <nav aria-labelledby="page-sections-heading">
            <h2 id="page-sections-heading" className="sr-only">
              Page sections.
            </h2>
            <ul className="space-y-1 text-lg">
              <li>
                <a className="underline" href="#overview" id="overview-link">
                  Overview.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#general-requirements"
                  id="general-requirements-link"
                >
                  General Requirements.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#website-requirements"
                  id="website-requirements-link"
                >
                  Website Requirements.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#mobile-app-requirements"
                  id="mobile-app-requirements-link"
                >
                  Mobile App Requirements.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#electronic-documents"
                  id="electronic-documents-link"
                >
                  Electronic Documents.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#service-compliance"
                  id="service-compliance-link"
                >
                  Service Compliance.
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div
        className="lg:col-span-5 prose prose-lg dark:prose-invert py-4 pt-2"
        id="eaa-content"
        aria-labelledby="page-title"
      >
        <div className="space-y-8">
          <section aria-labelledby="overview">
            <h2
              className="text-2xl font-semibold mb-4 mt-0 scroll-mt-6"
              id="overview"
              tabIndex={-1}
            >
              Overview.
            </h2>
            <div className="space-y-4">
              <p>
                The European Accessibility Act establishes comprehensive
                requirements for ensuring services are accessible to persons
                with disabilities. These accessibility requirements apply to a
                wide range of services that fall within the scope of the EAA.
              </p>
              <p>
                This page details the service requirements from{' '}
                <strong>Annex I</strong> of the European Accessibility Act,
                which specifies how service providers must make their offerings
                accessible to all users.
              </p>
              <p>Services covered by the EAA include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Electronic communications services</li>
                <li>Services providing access to audiovisual media services</li>
                <li>
                  Elements of passenger transport services (websites, mobile
                  apps, e-ticketing, etc.)
                </li>
                <li>
                  Consumer banking services (websites, mobile banking, ATMs,
                  etc.)
                </li>
                <li>E-books and dedicated software</li>
                <li>E-commerce services</li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="general-requirements">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="general-requirements"
              tabIndex={-1}
            >
              General Requirements.
            </h2>
            <div className="space-y-4">
              <p>
                All services covered by the EAA must meet these general
                accessibility requirements:
              </p>
              <ol className="pl-6 space-y-4">
                <li>
                  <strong>Provide Accessible Information:</strong> Services must
                  provide information about:
                  <ul className="list-disc pl-6 mt-2">
                    <li>How the service works</li>
                    <li>What accessibility features are available</li>
                    <li>How to get support if needed</li>
                  </ul>
                  <p className="mt-2">
                    This information must be accessible to people with various
                    disabilities by:
                  </p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Being available in multiple formats (text, audio, video
                      with captions)
                    </li>
                    <li>Being clearly written in plain language</li>
                    <li>
                      Being perceivable by people with different sensory
                      abilities
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Make Digital Interfaces Accessible:</strong> Service
                  providers must ensure that their websites, mobile
                  applications, and electronic documents follow accessibility
                  principles:
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Perceivable: Information must be presented in ways users
                      can perceive
                    </li>
                    <li>
                      Operable: Interface must be usable by people with
                      different abilities
                    </li>
                    <li>
                      Understandable: Content and operation must be easy to
                      understand
                    </li>
                    <li>
                      Robust: Content must work with various assistive
                      technologies
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Implement Accessible Policies:</strong> Service
                  providers must have:
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Clear policies addressing the needs of people with
                      disabilities
                    </li>
                    <li>Staff training on serving people with disabilities</li>
                    <li>Procedures for handling accessibility issues</li>
                  </ul>
                </li>
                <li>
                  <strong>Ensure Support Functions Are Accessible:</strong>{' '}
                  Functions like:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Electronic identification methods</li>
                    <li>Security features</li>
                    <li>Payment systems</li>
                  </ul>
                  <p className="mt-2">
                    These must be designed to be perceivable, operable,
                    understandable, and robust for all users.
                  </p>
                </li>
              </ol>
            </div>
          </section>

          <section aria-labelledby="website-requirements">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="website-requirements"
              tabIndex={-1}
            >
              Website Requirements.
            </h2>
            <div className="space-y-4">
              <p>
                Websites must follow accessibility principles aligned with the
                Web Content Accessibility Guidelines (WCAG):
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Perceivable content:</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Provide text alternatives for non-text content</li>
                    <li>
                      Provide captions and audio descriptions for multimedia
                    </li>
                    <li>
                      Create content that can be presented in different ways
                    </li>
                    <li>Make it easier for users to see and hear content</li>
                  </ul>
                </li>
                <li>
                  <strong>Operable interface:</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Make all functionality available from a keyboard</li>
                    <li>Give users enough time to read and use content</li>
                    <li>
                      Do not use content that could cause seizures or physical
                      reactions
                    </li>
                    <li>Help users navigate and find content</li>
                    <li>Make it easier to use inputs other than keyboard</li>
                  </ul>
                </li>
                <li>
                  <strong>Understandable information:</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Make text readable and understandable</li>
                    <li>Make content appear and operate in predictable ways</li>
                    <li>Help users avoid and correct mistakes</li>
                  </ul>
                </li>
                <li>
                  <strong>Robust content:</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Maximize compatibility with current and future user tools
                    </li>
                    <li>Use standard HTML/CSS properly</li>
                    <li>Provide proper labels and relationships in content</li>
                  </ul>
                </li>
              </ul>
              <p>
                These requirements align with established web accessibility
                standards and help ensure that websites are usable by people
                with various disabilities.
              </p>
            </div>
          </section>

          <section aria-labelledby="mobile-app-requirements">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="mobile-app-requirements"
              tabIndex={-1}
            >
              Mobile App Requirements.
            </h2>
            <div className="space-y-4">
              <p>
                Mobile applications must meet similar accessibility requirements
                to websites, with special attention to mobile-specific features:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Compatibility with screen readers and other assistive
                  technologies on mobile platforms
                </li>
                <li>
                  Support for platform-specific accessibility features
                  (VoiceOver, TalkBack, etc.)
                </li>
                <li>
                  Proper implementation of accessible touch targets (size and
                  spacing)
                </li>
                <li>Support for different device orientations</li>
                <li>Accessibility of notifications and alerts</li>
                <li>Alternative methods for gesture-based controls</li>
                <li>Support for system text size settings</li>
                <li>Proper contrast ratios for mobile viewing conditions</li>
                <li>Accessible forms and input methods</li>
              </ul>
              <p>
                Mobile apps must also provide accessibility information in their
                store listings, helping users understand what accessibility
                features are supported.
              </p>
            </div>
          </section>

          <section aria-labelledby="electronic-documents">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="electronic-documents"
              tabIndex={-1}
            >
              Electronic Documents.
            </h2>
            <div className="space-y-4">
              <p>
                Electronic documents provided as part of a service must be
                accessible by:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Using proper document structure with headings, lists, and
                  tables
                </li>
                <li>Including alternative text for images and diagrams</li>
                <li>Providing meaningful hyperlink text</li>
                <li>Using sufficient color contrast</li>
                <li>Including document metadata (title, language, etc.)</li>
                <li>Ensuring compatibility with screen readers</li>
                <li>Avoiding reliance on color alone to convey information</li>
                <li>
                  Making forms fillable and navigable with assistive technology
                </li>
              </ul>
              <p>
                Common document formats that must be made accessible include
                PDFs, Word documents, presentations, and form documents used for
                service delivery.
              </p>
            </div>
          </section>

          <section aria-labelledby="service-compliance">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="service-compliance"
              tabIndex={-1}
            >
              Service Compliance.
            </h2>
            <div className="space-y-4">
              <p>
                To comply with the European Accessibility Act, service providers
                must:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Design and provide services following accessibility
                  requirements
                </li>
                <li>
                  Document how their services meet the accessibility
                  requirements
                </li>
                <li>
                  Maintain this documentation for as long as the service is
                  offered
                </li>
                <li>
                  Inform the public about how their services meet accessibility
                  requirements
                </li>
                <li>
                  Establish procedures to ensure continued compliance as
                  services evolve
                </li>
                <li>
                  Respond to complaints and feedback about accessibility issues
                </li>
              </ul>
              <p>
                If full compliance with certain requirements would fundamentally
                alter the service or create a disproportionate burden, service
                providers may claim exemptions. However, this requires thorough
                assessment and documentation based on specific criteria set out
                in the law.
              </p>
            </div>
          </section>

          <footer>
            <ChapterNavigation currentPageId="2.3-service-requirements" />
          </footer>
        </div>
      </div>
    </section>
  )
}
