import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fundamental Alteration | European Accessibility Act',
  description:
    'Understanding when accessibility requirements would require a fundamental alteration of a product or service under the European Accessibility Act.',
}

export default function FundamentalAlterationPage() {
  return (
    <>
      <div className="space-y-8">
        <h1 className="text-4xl font-bold mb-8">Fundamental Alteration</h1>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="overview">
            Overview
          </h2>
          <div className="prose max-w-none">
            <p>
              The European Accessibility Act (EAA) includes provisions for cases
              where implementing certain accessibility requirements would
              necessitate a "fundamental alteration" of a product or service.
              This concept serves as an important boundary condition for the
              scope of accessibility obligations.
            </p>
            <p>
              Article 14(1)(c) of the EAA states that accessibility requirements
              apply only to the extent that they "do not require a significant
              change in a product or service that results in the fundamental
              alteration of its basic nature."
            </p>
            <p>
              This provision acknowledges that certain accessibility
              modifications might fundamentally change what a product or service
              is or does, and in such cases, economic operators may be exempted
              from specific requirements.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="definition">
            Definition and Scope
          </h2>
          <div className="prose max-w-none">
            <p>
              The EAA does not provide a precise definition of what constitutes
              a "fundamental alteration." However, from the directive and
              related EU legal principles, we can understand that:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                It involves a change that would essentially transform the nature
                or purpose of the product or service
              </li>
              <li>
                It goes beyond reasonable modifications, affecting core
                characteristics or functionalities
              </li>
              <li>
                It changes the primary identity or essential purpose of what is
                being offered
              </li>
              <li>
                It is not merely a substantial change but a transformative one
                that affects the basic nature
              </li>
            </ul>
            <p>
              Unlike the disproportionate burden exemption, the fundamental
              alteration provision is not primarily concerned with costs or
              resources but with the preservation of a product's or service's
              essential nature and purpose.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="assessment-criteria">
            Assessment Criteria
          </h2>
          <div className="prose max-w-none">
            <p>
              When evaluating whether an accessibility requirement would cause a
              fundamental alteration, economic operators should consider the
              following criteria:
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              Core Purpose and Functionality
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Would implementing the accessibility requirement change the
                primary function of the product or service?
              </li>
              <li>
                Would it alter how the core features operate in a way that
                changes what the product essentially is?
              </li>
              <li>
                Would it transform the fundamental user experience beyond
                recognition?
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              Target Audience and Use Cases
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Would the changes significantly shift the product's target
                audience or intended use cases?
              </li>
              <li>
                Would implementing accessibility features fundamentally change
                how the product is used by the majority of users?
              </li>
              <li>
                Would the changes eliminate specialized functionality that
                defines the product for a specific audience?
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              Product or Service Identity
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Does the required change alter defining characteristics that
                make the product or service unique in the market?
              </li>
              <li>
                Would the accessibility modifications fundamentally change how
                users identify or understand the product or service?
              </li>
              <li>
                Would implementing the requirements transform the product into
                something essentially different?
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="examples">
            Examples and Illustrations
          </h2>
          <div className="prose max-w-none">
            <p>
              The concept of fundamental alteration can be better understood
              through examples:
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              Potential Fundamental Alterations
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Specialized Historical Archive:</strong> A digital
                archive of historical manuscripts might claim fundamental
                alteration if required to provide full text alternatives for all
                ancient handwritten documents, as this would change the nature
                of the archive from primary sources to transcribed versions
              </li>
              <li>
                <strong>Visual Art Experience:</strong> A virtual reality art
                experience designed specifically to explore visual perception
                might claim fundamental alteration if required to provide
                non-visual alternatives that would essentially create a
                different artistic experience
              </li>
              <li>
                <strong>Language Learning Service:</strong> An audio-based
                language immersion service might claim fundamental alteration if
                required to provide text alternatives for all spoken content, as
                it would transform the immersive audio-only methodology that
                defines the service
              </li>
              <li>
                <strong>Professional Technical Equipment:</strong> Highly
                specialized technical equipment designed exclusively for
                professional users with specific training might claim
                fundamental alteration if certain accessibility requirements
                would impact precision or specialized functions
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              Not Fundamental Alterations
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>E-Commerce Platform:</strong> Adding screen reader
                support, keyboard navigation, and alternative text for images
                would not fundamentally alter an online store's nature
              </li>
              <li>
                <strong>Banking Application:</strong> Implementing accessible
                authentication methods and ensuring form field labels are
                accessible would not change the fundamental nature of a banking
                service
              </li>
              <li>
                <strong>E-Book Reader:</strong> Adding text-to-speech
                functionality, adjustable text sizes, and contrast controls
                would not fundamentally alter the nature of an e-book reading
                service
              </li>
              <li>
                <strong>Streaming Service:</strong> Adding closed captions,
                audio descriptions, and accessible navigation would not
                fundamentally alter the nature of a video streaming service
              </li>
            </ul>
            <p>
              These examples illustrate that routine accessibility features that
              preserve core functionality while making it accessible would
              rarely constitute fundamental alterations.
            </p>
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="practical-considerations"
          >
            Practical Application and Considerations
          </h2>
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mt-6 mb-2">Burden of Proof</h3>
            <p>
              The economic operator claiming a fundamental alteration bears the
              burden of proof. This requires:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Detailed documentation</strong> explaining why specific
                accessibility requirements would fundamentally alter the product
                or service
              </li>
              <li>
                <strong>Evidence-based assessment</strong> demonstrating how the
                required changes would transform the basic nature
              </li>
              <li>
                <strong>Consultation with experts</strong> in both accessibility
                and the specific domain of the product or service
              </li>
              <li>
                <strong>Market research or user feedback</strong> supporting the
                claim that changes would alter the fundamental nature
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              Partial Application
            </h3>
            <p>Even when a fundamental alteration exemption applies:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                It applies only to the specific accessibility requirements that
                would cause the fundamental alteration
              </li>
              <li>
                All other accessibility requirements that don't cause
                fundamental alteration must still be implemented
              </li>
              <li>
                Alternative approaches to accessibility should be explored where
                possible
              </li>
              <li>
                The exemption should be reviewed periodically as technology and
                methods evolve
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              Relationship with Innovation
            </h3>
            <p>
              The fundamental alteration provision aims to strike a balance
              between:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Protecting innovation</strong> and preserving unique
                product/service characteristics
              </li>
              <li>
                <strong>Encouraging inclusive design</strong> that considers
                accessibility from the outset
              </li>
              <li>
                <strong>Allowing specialized products</strong> that may serve
                specific needs or purposes
              </li>
              <li>
                <strong>Promoting general accessibility</strong> across the
                market
              </li>
            </ul>
            <p>
              The provision is not intended to be a broad exemption but rather a
              targeted recognition that in specific cases, certain requirements
              might fundamentally change what a product or service is.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="decision-framework">
            Decision Framework
          </h2>
          <div className="prose max-w-none">
            <p>
              Organizations can use the following framework to assess potential
              fundamental alteration claims:
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              Step 1: Define Core Essence
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Clearly articulate the essential nature and purpose of the
                product or service
              </li>
              <li>
                Identify the defining characteristics that constitute its basic
                nature
              </li>
              <li>
                Document the primary functions and key features that define what
                it is
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              Step 2: Analyze Impact of Requirements
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Assess each accessibility requirement individually against the
                core essence
              </li>
              <li>
                Identify which specific requirements might alter fundamental
                characteristics
              </li>
              <li>
                Evaluate the extent of change to core functionality, not just
                the effort required
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              Step 3: Explore Alternatives
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Investigate alternative approaches to meet accessibility needs
              </li>
              <li>
                Consider modifications to implementation that preserve core
                nature
              </li>
              <li>Consult with accessibility experts on creative solutions</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              Step 4: Document Decision
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Record the detailed reasoning for any fundamental alteration
                claim
              </li>
              <li>Document which specific requirements are affected and why</li>
              <li>Maintain evidence supporting the assessment</li>
              <li>Include any alternative measures being implemented</li>
            </ul>
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="differences-disproportionate"
          >
            Differences from Disproportionate Burden
          </h2>
          <div className="prose max-w-none">
            <p>
              It's important to distinguish between fundamental alteration and
              disproportionate burden:
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300 mt-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Aspect
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Fundamental Alteration
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Disproportionate Burden
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">
                      Primary Focus
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      Nature and identity of the product/service
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      Cost and effort relative to benefits
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">
                      Main Consideration
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      Whether the basic nature would change
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      Whether resources required are reasonable
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">
                      Assessment Basis
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      Qualitative change to core functionality
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      Quantitative analysis of costs and benefits
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">
                      Temporal Nature
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      Generally more permanent
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      May change as costs decrease or organization grows
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">
                      Company Size Factor
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      Generally independent of company size
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      Explicitly considers company resources and size
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4">
              An organization might invoke both provisions in different
              contexts, but they should be assessed separately and with
              appropriate evidence for each.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="best-practices">
            Best Practices
          </h2>
          <div className="prose max-w-none">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Consider accessibility early:</strong> Integrate
                accessibility considerations in the design phase to avoid
                fundamental alteration issues later
              </li>
              <li>
                <strong>Assess narrowly:</strong> Apply the fundamental
                alteration concept narrowly to specific requirements, not
                broadly to avoid accessibility obligations
              </li>
              <li>
                <strong>Document thoroughly:</strong> Maintain detailed
                documentation of any fundamental alteration assessment and
                conclusions
              </li>
              <li>
                <strong>Seek expert input:</strong> Consult with both
                accessibility experts and domain specialists before claiming
                fundamental alteration
              </li>
              <li>
                <strong>Explore creative solutions:</strong> Investigate
                innovative approaches that might provide accessibility without
                fundamental alteration
              </li>
              <li>
                <strong>Implement alternatives:</strong> When a specific
                requirement would cause fundamental alteration, explore
                alternative accessibility approaches
              </li>
              <li>
                <strong>Reassess periodically:</strong> Review fundamental
                alteration determinations as technology and methods evolve
              </li>
              <li>
                <strong>Communicate clearly:</strong> Explain to users which
                accessibility features are available and any limitations
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="relationship-annexes">
            Relationship with EAA Annexes
          </h2>
          <div className="prose max-w-none">
            <p>
              The fundamental alteration provision interacts with the EAA
              annexes in several ways:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Annex I (Accessibility Requirements):</strong>{' '}
                Fundamental alteration may provide exemption from specific
                requirements in Annex I, but only those that would transform the
                basic nature
              </li>
              <li>
                <strong>Annex II (Examples):</strong> Examples in Annex II might
                help clarify when a particular approach wouldn't constitute
                fundamental alteration
              </li>
              <li>
                <strong>Annex III (Built Environment):</strong> Physical
                accessibility requirements might interact with fundamental
                alteration considerations in specific contexts
              </li>
              <li>
                <strong>Annex IV (Disproportionate Burden):</strong>{' '}
                Organizations need to distinguish between fundamental alteration
                and disproportionate burden when seeking exemptions
              </li>
              <li>
                <strong>Annex V (Conformity Assessment):</strong> Any claimed
                fundamental alteration exemptions should be documented as part
                of the conformity assessment process
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="market-surveillance">
            Market Surveillance Considerations
          </h2>
          <div className="prose max-w-none">
            <p>
              Market surveillance authorities will evaluate fundamental
              alteration claims carefully. Organizations should:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Maintain robust evidence:</strong> Be prepared to
                justify any fundamental alteration claim with thorough
                documentation
              </li>
              <li>
                <strong>Demonstrate good faith:</strong> Show that a genuine
                assessment was conducted, not a superficial attempt to avoid
                accessibility requirements
              </li>
              <li>
                <strong>Implement partial compliance:</strong> Demonstrate that
                all requirements not causing fundamental alteration have been
                implemented
              </li>
              <li>
                <strong>Show alternative approaches:</strong> Document any
                alternative accessibility measures implemented where direct
                compliance would cause fundamental alteration
              </li>
            </ul>
            <p>
              Authorities are likely to scrutinize fundamental alteration claims
              closely, especially when similar products or services in the
              market have successfully implemented the accessibility
              requirements in question.
            </p>
          </div>
        </section>

        <div className="flex justify-between mt-8 pt-4 border-t">
          <Link
            href="/eaa/technical-standards"
            className="text-blue-600 hover:underline"
          >
            ← Harmonized Standards
          </Link>
          <Link
            href="/eaa/annexes/implementation-examples"
            className="text-blue-600 hover:underline"
          >
            Annex II: Implementation Examples →
          </Link>
        </div>
      </div>
    </>
  )
}
