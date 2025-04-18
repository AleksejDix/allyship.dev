import React from 'react'
import Link from 'next/link'

export default function ScopePage() {
  return (
    <>
      <Link
        href="/eaa"
        className="inline-flex items-center text-sm text-blue-600 mb-6 hover:underline"
      >
        ← Back to Table of Contents
      </Link>

      <h1 className="text-4xl font-bold mb-8">Scope and Application</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4" id="products-covered">
            Products Covered
          </h2>
          <div className="space-y-4">
            <p>
              This Directive applies to a wide range of products placed on the
              market after 28 June 2025, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Consumer general purpose computer hardware systems and operating
                systems
              </li>
              <li>
                Payment terminals, including both their hardware and software
              </li>
              <li>
                Self-service terminals related to covered services:
                <ul className="list-disc pl-6 mt-2">
                  <li>ATMs</li>
                  <li>
                    Ticketing machines issuing physical tickets granting access
                    to services
                  </li>
                  <li>Bank office queuing ticket machines</li>
                  <li>Check-in machines</li>
                  <li>Interactive information terminals</li>
                </ul>
              </li>
              <li>
                Consumer terminal equipment with interactive computing
                capability used for electronic communications
              </li>
              <li>E-readers</li>
            </ul>
            <p>
              However, certain interactive self-service terminals providing
              information installed as integrated parts of vehicles, aircrafts,
              ships or rolling stock are excluded from the scope of this
              Directive, since these form part of those vehicles which are not
              covered by this Directive.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="services-covered">
            Services Covered
          </h2>
          <div className="space-y-4">
            <p>
              This Directive also applies to several key service categories
              provided after 28 June 2025:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Electronic communications services</li>
              <li>Services providing access to audiovisual media services</li>
              <li>
                Certain elements of air, bus, rail, and waterborne passenger
                transport services, including:
                <ul className="list-disc pl-6 mt-2">
                  <li>Websites</li>
                  <li>Mobile device-based services</li>
                  <li>Electronic ticketing</li>
                  <li>Delivery of transport service information</li>
                </ul>
              </li>
              <li>Banking services for consumers</li>
              <li>E-books and related software</li>
              <li>E-commerce services</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="microenterprises">
            Microenterprises Exemption
          </h2>
          <div className="space-y-4">
            <p>
              Microenterprises providing services shall be exempt from complying
              with the accessibility requirements referred to in this Directive
              and any obligations relating to the compliance with those
              requirements.
            </p>
            <p>
              Member States shall provide guidelines and tools to
              microenterprises to facilitate the application of the national
              measures transposing this Directive. Member States shall develop
              those tools in consultation with relevant stakeholders.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="built-environment">
            Built Environment
          </h2>
          <div className="space-y-4">
            <p>
              Member States may decide, in the light of national conditions,
              that the built environment used by clients of services covered by
              this Directive shall comply with the accessibility requirements
              set out in Annex III, in order to maximize their use by persons
              with disabilities.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="emergency-services">
            Emergency Services
          </h2>
          <div className="space-y-4">
            <p>
              Member States shall ensure that the answering of emergency
              communications to the single European emergency number '112' by
              the most appropriate PSAP, shall comply with the specific
              accessibility requirements set out in Section V of Annex I in the
              manner best suited to the national organisation of emergency
              systems.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="specifications">
            Further Specifications
          </h2>
          <div className="space-y-4">
            <p>
              The Commission is empowered to adopt delegated acts to supplement
              Annex I by further specifying the accessibility requirements that,
              by their very nature, cannot produce their intended effect unless
              they are further specified in binding legal acts of the Union,
              such as requirements related to interoperability.
            </p>
          </div>
        </section>

        <nav className="flex justify-between mt-10 pt-4 border-t">
          <Link
            href="/eaa/purpose-and-definitions"
            className="text-blue-600 hover:underline"
          >
            ← Purpose and Definitions
          </Link>
          <Link
            href="/eaa/accessibility-requirements"
            className="text-blue-600 hover:underline"
          >
            Accessibility Requirements →
          </Link>
        </nav>
      </div>
    </>
  )
}
