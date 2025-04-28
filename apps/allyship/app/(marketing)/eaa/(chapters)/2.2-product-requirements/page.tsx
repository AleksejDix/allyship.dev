import React from 'react'
import { Metadata } from 'next'
import { ChapterNavigation } from '../../components/ChapterNavigation'

export const metadata: Metadata = {
  title: 'Product Accessibility Requirements | European Accessibility Act',
  description:
    'Detailed accessibility requirements for products under the European Accessibility Act (EAA), including general and specific product categories.',
}

export default function ProductRequirementsPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 id="page-title" className="text-4xl font-bold mb-[23px]">
            Product Accessibility Requirements.
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
                  href="#self-service-terminals"
                  id="self-service-terminals-link"
                >
                  Self-Service Terminals.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#computing-hardware"
                  id="computing-hardware-link"
                >
                  Computing Hardware.
                </a>
              </li>
              <li>
                <a className="underline" href="#e-readers" id="e-readers-link">
                  E-Readers.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#product-compliance"
                  id="product-compliance-link"
                >
                  Product Compliance.
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
                The European Accessibility Act specifies detailed requirements
                for making products accessible to people with disabilities.
                These requirements cover both general aspects applicable to all
                products and specific requirements for certain product
                categories.
              </p>
              <p>
                This page presents the product requirements from{' '}
                <strong>Annex I</strong> of the European Accessibility Act,
                which outlines detailed accessibility specifications that
                products must meet to be compliant.
              </p>
              <p>Products covered by the EAA include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Consumer computer hardware systems and operating systems
                </li>
                <li>
                  Self-service terminals (ATMs, ticketing machines, check-in
                  machines)
                </li>
                <li>
                  Consumer terminal equipment with interactive computing
                  capability used for electronic communications
                </li>
                <li>
                  Consumer terminal equipment with interactive computing
                  capability used for accessing audiovisual media services
                </li>
                <li>E-readers</li>
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
                All products covered by the EAA must meet these general
                accessibility requirements:
              </p>
              <ol className="pl-6 space-y-4">
                <li>
                  <strong>Accessible Information.</strong> Product information
                  (including instructions, packaging, etc.) must be:
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Available through more than one sensory channel (visual,
                      auditory, tactile)
                    </li>
                    <li>Presented in an understandable way</li>
                    <li>Perceivable by users with different abilities</li>
                    <li>Presented with adequate contrast and font size</li>
                    <li>
                      Available in text format that can be used to generate
                      alternative formats
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Accessible User Interface.</strong> The product's user
                  interface and functionality must be accessible by:
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Providing information through more than one sensory
                      channel
                    </li>
                    <li>
                      Offering alternatives to speech for communication and
                      operation
                    </li>
                    <li>
                      Allowing flexible magnification, contrast, and brightness
                      adjustments
                    </li>
                    <li>
                      Providing alternatives when color is used to convey
                      information
                    </li>
                    <li>
                      Avoiding triggering seizures and allowing enough time for
                      user interaction
                    </li>
                    <li>
                      Providing alternatives to fine motor control operations
                    </li>
                    <li>
                      Avoiding designs requiring extensive reach or strength
                    </li>
                    <li>
                      Considering light sensitivity and minimizing
                      photosensitive triggers
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Assistive Technology Support.</strong> Products must
                  be compatible with assistive technologies, including:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Screen readers and alternative input devices</li>
                    <li>Hearing aids and cochlear implants</li>
                    <li>Assistive listening devices</li>
                  </ul>
                </li>
                <li>
                  <strong>Support Services.</strong> Help desks, call centers,
                  and technical support must provide information about product
                  accessibility in accessible formats.
                </li>
              </ol>
            </div>
          </section>

          <section aria-labelledby="self-service-terminals">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="self-service-terminals"
              tabIndex={-1}
            >
              Self-Service Terminals.
            </h2>
            <div className="space-y-4">
              <p>
                Self-service terminals such as ATMs, ticket machines, and
                check-in kiosks must meet these specific requirements:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Include text-to-speech technology when terminals have text
                  input or output capabilities
                </li>
                <li>
                  Allow the use of personal headsets when audio output is
                  provided
                </li>
                <li>
                  Support alternative input methods when timed responses are
                  required (voice, touch, etc.)
                </li>
                <li>
                  Provide visual alternatives for audio content and audio
                  alternatives for visual content
                </li>
                <li>Avoid visual patterns that could cause seizures</li>
                <li>Be compatible with assistive technologies</li>
                <li>Support high color contrast for important information</li>
                <li>
                  Be physically accessible, with all interactive elements
                  reachable by users with different abilities
                </li>
              </ul>
              <p>
                These requirements apply to terminals including but not limited
                to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Payment terminals and banking ATMs</li>
                <li>Transport ticketing and check-in machines</li>
                <li>Public information kiosks</li>
                <li>Self-service shopping checkout machines</li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="computing-hardware">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="computing-hardware"
              tabIndex={-1}
            >
              Computing Hardware and Operating Systems.
            </h2>
            <div className="space-y-4">
              <p>
                Consumer computing hardware systems and operating systems must:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Support text-to-speech functionality for text content</li>
                <li>Provide reliable connection to assistive technologies</li>
                <li>
                  Enable keyboard control for all functions that normally
                  require mouse or touch input
                </li>
                <li>
                  Allow for alternative input methods (head tracking, eye
                  tracking, voice control, etc.)
                </li>
                <li>
                  Permit customization of display settings (color, contrast,
                  font size, etc.)
                </li>
                <li>
                  Include accessibility features that protect user privacy
                </li>
                <li>
                  Allow users to disable automatic features that might interfere
                  with assistive technologies
                </li>
                <li>
                  Support interoperability with assistive technologies through
                  standard communication protocols
                </li>
              </ul>
              <p>
                These requirements apply to personal computers, laptops,
                tablets, and smartphones, along with their operating systems.
              </p>
            </div>
          </section>

          <section aria-labelledby="e-readers">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="e-readers"
              tabIndex={-1}
            >
              E-Readers.
            </h2>
            <div className="space-y-4">
              <p>
                E-readers must meet these specific accessibility requirements:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Support text-to-speech technology to enable reading by blind
                  and low-vision users
                </li>
                <li>
                  Ensure that accessibility features are not blocked by digital
                  rights management or security measures
                </li>
                <li>
                  Include accessibility metadata to help users find accessible
                  content
                </li>
                <li>
                  Support reflowable text that can be adjusted for size,
                  spacing, and color
                </li>
                <li>
                  Enable navigation through content via multiple methods (table
                  of contents, page numbers, search)
                </li>
                <li>
                  Support bookmarks, highlights, and notes in accessible formats
                </li>
                <li>
                  Maintain compatibility with screen readers and other assistive
                  technologies
                </li>
                <li>
                  Allow for customization of display settings (contrast,
                  brightness, color themes)
                </li>
              </ul>
              <p>
                These requirements ensure that e-readers and their content are
                accessible to people with various disabilities, including
                visual, cognitive, and motor impairments.
              </p>
            </div>
          </section>

          <section aria-labelledby="product-compliance">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="product-compliance"
              tabIndex={-1}
            >
              Product Compliance.
            </h2>
            <div className="space-y-4">
              <p>
                To comply with the European Accessibility Act, manufacturers
                must:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Incorporate accessibility features during product design and
                  development
                </li>
                <li>
                  Document how products meet the accessibility requirements
                </li>
                <li>
                  Create a technical file demonstrating conformity with the
                  requirements
                </li>
                <li>
                  Apply the CE marking to products that meet the requirements
                </li>
                <li>
                  Publish accessibility information along with product
                  information
                </li>
                <li>
                  Maintain records of compliance for at least five years after
                  the product is placed on the market
                </li>
              </ul>
              <p>
                If full compliance with certain requirements would require a
                fundamental alteration to the product or create a
                disproportionate burden, manufacturers may apply for exemptions.
                However, this requires thorough documentation and justification.
              </p>
            </div>
          </section>

          <footer>
            <ChapterNavigation currentPageId="2.2-product-requirements" />
          </footer>
        </div>
      </div>
    </section>
  )
}
