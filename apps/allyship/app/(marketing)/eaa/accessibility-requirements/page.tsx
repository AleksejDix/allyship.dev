import React from 'react'
import Link from 'next/link'

export default function AccessibilityRequirementsPage() {
  return (
    <>
      <Link
        href="/eaa"
        className="inline-flex items-center text-sm text-blue-600 mb-6 hover:underline"
      >
        ← Back to Table of Contents
      </Link>

      <h1 className="text-4xl font-bold mb-8">Accessibility Requirements</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4" id="general-principles">
            General Principles
          </h2>
          <div className="space-y-4">
            <p>
              Products and services that fall within the scope of this Directive
              must be designed and produced in such a way as to maximize their
              foreseeable use by persons with disabilities and shall be
              accompanied by accessible information on their functioning and on
              their accessibility features.
            </p>
            <p>
              The accessibility requirements are formulated in terms of
              functional performance criteria, following four key principles
              derived from the Web Content Accessibility Guidelines (WCAG):
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Perceivability:</strong> Information and user interface
                components must be presentable to users in ways they can
                perceive
              </li>
              <li>
                <strong>Operability:</strong> User interface components and
                navigation must be operable by all users
              </li>
              <li>
                <strong>Understandability:</strong> Information and operation of
                the user interface must be comprehensible
              </li>
              <li>
                <strong>Robustness:</strong> Content must be robust enough to be
                interpreted by various user agents, including assistive
                technologies
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="products-requirements"
          >
            Product Requirements
          </h2>
          <div className="space-y-4">
            <p>
              For products covered by this Directive, the accessibility
              requirements include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Providing information about the use of the product on the
                product itself (labelling, instructions, warning) that shall be:
                <ul className="list-disc pl-6 mt-2">
                  <li>Made available by more than one sensory channel</li>
                  <li>Presented in an understandable way</li>
                  <li>Presented to users in ways they can perceive</li>
                  <li>
                    Presented in fonts of adequate size and suitable shape
                  </li>
                </ul>
              </li>
              <li>
                Making the user interface of the product accessible to enable
                persons with disabilities to perceive, operate, and understand
                it
              </li>
              <li>
                Ensuring compatibility with assistive technologies, including
                hearing aids, telecoils, cochlear implants, and assistive
                listening devices
              </li>
              <li>
                Providing support services (help desks, call centers, technical
                support, relay services) that provide information on the
                accessibility of the product
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="services-requirements"
          >
            Service Requirements
          </h2>
          <div className="space-y-4">
            <p>The provision of services must be ensured in a way that:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Makes information available about the functioning of the service
                and about its accessibility characteristics and facilities
              </li>
              <li>
                Makes websites accessible in a consistent and adequate way for
                users' perception, operation, and understanding, including the
                adaptability of content presentation and interaction
              </li>
              <li>
                Includes functions, practices, policies, and procedures targeted
                to address the needs of persons with disabilities
              </li>
              <li>
                Ensures that mobile applications are accessible in a consistent
                and adequate way for users' perception, operation and
                understanding
              </li>
              <li>
                Makes electronic identification, security and payment methods
                necessary for the provision of the service understandable,
                perceivable, operable, and robust
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="specific-sectors">
            Specific Sector Requirements
          </h2>
          <div className="space-y-4">
            <h3 className="text-xl font-medium mb-2">
              Electronic Communications
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide real time text in addition to voice communication</li>
              <li>
                Provide total conversation where video is provided in addition
                to voice communication
              </li>
              <li>
                Ensure that emergency communications using voice, text and video
                are synchronized
              </li>
            </ul>

            <h3 className="text-xl font-medium mb-2 mt-6">
              Audiovisual Media Services
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Provide electronic program guides (EPGs) that are perceivable,
                operable, understandable, and robust
              </li>
              <li>
                Ensure that accessibility components of audiovisual media
                services are transmitted in full
              </li>
            </ul>

            <h3 className="text-xl font-medium mb-2 mt-6">E-books</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Ensure that digital files use features, practices, policies, and
                procedures that address the needs of persons with disabilities
              </li>
              <li>
                Respect the integrity of the author's work while providing
                accessibility
              </li>
              <li>
                Enable alternative renditions of the content and its
                interoperability with assistive technologies
              </li>
            </ul>

            <h3 className="text-xl font-medium mb-2 mt-6">E-commerce</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Provide identification methods, electronic signatures, and
                payment services that are perceivable, operable, understandable,
                and robust
              </li>
              <li>
                Make information about the functioning of the service accessible
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="annex-reference">
            Detailed Requirements in Annexes
          </h2>
          <div className="space-y-4">
            <p>
              The specific technical requirements are detailed in Annex I of the
              Directive, which is organized into several sections:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Section I: General accessibility requirements for all products
              </li>
              <li>
                Section II: User interface and functionality design requirements
                for products
              </li>
              <li>
                Section III: General accessibility requirements for all services
              </li>
              <li>
                Section IV: Additional accessibility requirements for specific
                services
              </li>
              <li>
                Section V: Specific accessibility requirements for emergency
                communications
              </li>
              <li>
                Section VI: Accessibility requirements for features, elements,
                or functions of products and services
              </li>
              <li>Section VII: Functional performance criteria</li>
            </ul>
            <p>
              Additionally, Annex II provides non-binding examples of possible
              solutions that contribute to meeting the accessibility
              requirements, which Member States may inform economic operators
              about.
            </p>
          </div>
        </section>

        <nav className="flex justify-between mt-10 pt-4 border-t">
          <Link href="/eaa/scope" className="text-blue-600 hover:underline">
            ← Scope and Application
          </Link>
          <Link
            href="/eaa/existing-law"
            className="text-blue-600 hover:underline"
          >
            Existing Union Law →
          </Link>
        </nav>
      </div>
    </>
  )
}
