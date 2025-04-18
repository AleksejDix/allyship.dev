import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title:
    'Annex III: Requirements for Built Environment | European Accessibility Act',
  description:
    'Requirements for the built environment where services are provided under the European Accessibility Act, ensuring physical accessibility for persons with disabilities.',
}

export default function BuiltEnvironmentPage() {
  return (
    <>
      <Link
        href="/eaa/annexes"
        className="inline-flex items-center text-sm text-blue-600 mb-6 hover:underline"
      >
        ← Back to Annexes Overview
      </Link>

      <h1 className="text-4xl font-bold mb-8">
        Annex III: Requirements for Built Environment
      </h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4" id="overview">
            Overview
          </h2>
          <div className="prose max-w-none">
            <p>
              Annex III of the European Accessibility Act establishes
              accessibility requirements for the built environment where
              services covered by the EAA are provided to the public. These
              requirements aim to ensure that the physical spaces where services
              are delivered are accessible to persons with disabilities,
              maximizing their foreseeable use.
            </p>
            <p>
              It's important to note that Member States can choose whether to
              require compliance with these built environment requirements. If a
              Member State decides to require compliance, the built environment
              where the service is provided must conform to the requirements
              outlined in this annex.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="scope-application">
            Scope of Application
          </h2>
          <div className="prose max-w-none">
            <p>The requirements in Annex III apply to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Service areas:</strong> Physical locations where
                services falling under the scope of the EAA are provided to the
                public
              </li>
              <li>
                <strong>Service infrastructure:</strong> Buildings, facilities,
                and environments designed for public access where covered
                services are delivered
              </li>
              <li>
                <strong>New constructions:</strong> Requirements typically apply
                to newly constructed facilities or major renovations
              </li>
              <li>
                <strong>Existing buildings:</strong> When Member States require
                it, the requirements may also apply to existing facilities
                (often with reasonable adaptation periods)
              </li>
            </ul>
            <p>
              The built environment requirements focus on ensuring that persons
              with various disabilities can access and use the physical spaces
              where they receive services covered by the EAA.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="key-requirements">
            Key Requirements
          </h2>
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mt-6 mb-2">
              1. Use of Related Spaces and Facilities
            </h3>
            <p>
              For the independent use of spaces and facilities open to the
              public:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Adjacent outdoor areas:</strong> Design outdoor areas
                and facilities that are under the responsibility of the service
                provider to be accessible
              </li>
              <li>
                <strong>Approaches to buildings:</strong> Provide accessible
                paths to buildings from public areas, including parking
                facilities and public transportation stops
              </li>
              <li>
                <strong>Service delivery areas:</strong> Ensure all areas where
                the service is delivered are designed for independent navigation
                and use
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              2. Access to Building Entrances
            </h3>
            <p>To ensure accessible building entrances:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Step-free access:</strong> Provide at least one
                accessible, step-free entrance route
              </li>
              <li>
                <strong>Door clearance:</strong> Ensure doorways have sufficient
                width for wheelchair users
              </li>
              <li>
                <strong>Door operation:</strong> Install doors that can be
                opened with minimal force or provide automated door systems
              </li>
              <li>
                <strong>Thresholds:</strong> Design thresholds to be level or
                with minimal height differences to prevent tripping hazards
              </li>
              <li>
                <strong>Clear markings:</strong> Make entrances clearly visible
                through appropriate visual contrast and lighting
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              3. Horizontal Circulation
            </h3>
            <p>For accessible horizontal circulation within buildings:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Corridor width:</strong> Design corridors and
                passageways with sufficient width for wheelchair users,
                including passing spaces where needed
              </li>
              <li>
                <strong>Floor surfaces:</strong> Provide stable, firm, and
                slip-resistant floor surfaces
              </li>
              <li>
                <strong>Level changes:</strong> Identify any small level changes
                with visual contrast and tactile warnings
              </li>
              <li>
                <strong>Clear space:</strong> Ensure adequate clear space for
                maneuvering, particularly at doors and intersections
              </li>
              <li>
                <strong>Wayfinding:</strong> Implement consistent and accessible
                wayfinding systems with visual, tactile, and where appropriate,
                audible information
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              4. Vertical Circulation
            </h3>
            <p>For accessible vertical circulation between building levels:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Accessible routes:</strong> Provide accessible routes
                between all floors where services are delivered
              </li>
              <li>
                <strong>Elevators:</strong> Install accessible elevators with
                appropriate dimensions, controls at accessible heights, and
                audible and visual signals
              </li>
              <li>
                <strong>Ramps:</strong> Where necessary, provide ramps with
                appropriate slope, width, non-slip surfaces, handrails, and
                landing areas
              </li>
              <li>
                <strong>Stairs:</strong> Design stairs with consistent step
                dimensions, visual contrast on step edges, and handrails on both
                sides
              </li>
              <li>
                <strong>Platform lifts:</strong> Where appropriate, install
                platform lifts as an alternative vertical circulation option
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              5. Service Counters and Information Points
            </h3>
            <p>For accessible service delivery points:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Counter heights:</strong> Provide service counters with
                sections at appropriate heights for both standing and seated
                users
              </li>
              <li>
                <strong>Clear approach:</strong> Ensure sufficient clear space
                for wheelchair users to approach and use service counters
              </li>
              <li>
                <strong>Visual contrast:</strong> Design service areas with
                adequate visual contrast to help those with visual impairments
              </li>
              <li>
                <strong>Induction loops:</strong> Install hearing enhancement
                systems (such as induction loops) at service counters to assist
                people with hearing impairments
              </li>
              <li>
                <strong>Lighting:</strong> Provide appropriate lighting to
                facilitate lip-reading and sign language interpretation
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              6. Accessible Facilities
            </h3>
            <p>For accessible facilities within service areas:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Toilets:</strong> Provide accessible toilet facilities
                with appropriate dimensions, fixtures at suitable heights, and
                emergency call systems
              </li>
              <li>
                <strong>Waiting areas:</strong> Design waiting spaces with
                accessible seating options and space for wheelchair users
              </li>
              <li>
                <strong>Self-service equipment:</strong> Ensure that any
                self-service machines or kiosks are accessible to people with
                various disabilities
              </li>
              <li>
                <strong>Signage:</strong> Install clear, consistent, and
                accessible signage throughout the facility
              </li>
              <li>
                <strong>Acoustic environment:</strong> Design spaces with
                appropriate acoustic properties to minimize background noise and
                echo
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="information-communication"
          >
            Information and Communication
          </h2>
          <div className="prose max-w-none">
            <p>
              The built environment must include accessible information and
              communication elements:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Signage:</strong> Provide clear, legible signage with
                adequate contrast, appropriate sizing, and consistent placement
              </li>
              <li>
                <strong>Wayfinding:</strong> Implement integrated wayfinding
                systems using visual, tactile, and where appropriate, audible
                information
              </li>
              <li>
                <strong>Tactile information:</strong> Include tactile signage
                and tactile maps at key decision points for people with visual
                impairments
              </li>
              <li>
                <strong>Alarms:</strong> Install emergency alarm systems that
                provide both visual and audible signals
              </li>
              <li>
                <strong>Acoustic information:</strong> Design public address
                systems to be clear and understandable, with minimal echo or
                distortion
              </li>
              <li>
                <strong>Digital interfaces:</strong> Ensure that any digital
                interfaces in the built environment (such as information kiosks)
                meet accessibility requirements
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="emergency-provisions">
            Emergency Provisions
          </h2>
          <div className="prose max-w-none">
            <p>Accessible emergency provisions must include:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Evacuation routes:</strong> Design accessible emergency
                evacuation routes with appropriate signage
              </li>
              <li>
                <strong>Areas of refuge:</strong> Provide designated areas of
                refuge where persons with disabilities can wait safely for
                assistance
              </li>
              <li>
                <strong>Two-way communication:</strong> Install accessible
                two-way communication systems in areas of refuge
              </li>
              <li>
                <strong>Visual and audible alarms:</strong> Ensure fire alarms
                and emergency notifications include both visual (flashing
                lights) and audible elements
              </li>
              <li>
                <strong>Clear evacuation instructions:</strong> Provide
                evacuation instructions in accessible formats, including large
                print and simple language
              </li>
              <li>
                <strong>Emergency lighting:</strong> Install adequate emergency
                lighting along evacuation routes
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="technical-standards">
            Technical Standards and Specifications
          </h2>
          <div className="prose max-w-none">
            <p>
              Annex III requirements can be met by referring to various
              technical standards and specifications:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>European standards:</strong> EN 17210 "Accessibility and
                usability of the built environment - Functional requirements"
              </li>
              <li>
                <strong>ISO standards:</strong> ISO 21542 "Building construction
                - Accessibility and usability of the built environment"
              </li>
              <li>
                <strong>National building codes:</strong> Member States'
                technical regulations on accessibility in the built environment
              </li>
              <li>
                <strong>CEN/CENELEC standards:</strong> European standardization
                organizations' technical specifications for accessible built
                environments
              </li>
              <li>
                <strong>Harmonized standards:</strong> Standards developed
                specifically to support EAA implementation (when available)
              </li>
            </ul>
            <p>
              While following these standards doesn't automatically guarantee
              compliance with Annex III, they provide valuable guidance and
              established best practices that can help organizations implement
              the accessibility requirements effectively.
            </p>
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="implementation-approaches"
          >
            Implementation Approaches
          </h2>
          <div className="prose max-w-none">
            <p>
              Service providers can adopt various approaches to implement Annex
              III requirements:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Access audits:</strong> Conduct comprehensive
                accessibility audits of existing facilities to identify barriers
              </li>
              <li>
                <strong>Phased implementation:</strong> Develop a prioritized,
                phased approach to addressing accessibility improvements
              </li>
              <li>
                <strong>Universal design principles:</strong> Apply universal
                design principles in new construction and renovations
              </li>
              <li>
                <strong>Staff training:</strong> Train facility management and
                staff on accessibility features and how to assist persons with
                disabilities
              </li>
              <li>
                <strong>Feedback mechanisms:</strong> Establish systems for
                users to report accessibility issues and suggest improvements
              </li>
              <li>
                <strong>Consultation:</strong> Involve disability organizations
                and experts in planning and implementing accessibility
                improvements
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="member-state-variations"
          >
            Member State Variations
          </h2>
          <div className="prose max-w-none">
            <p>
              Implementation of Annex III requirements may vary across Member
              States:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Optional implementation:</strong> Member States decide
                whether to require compliance with the built environment
                requirements
              </li>
              <li>
                <strong>Varying standards:</strong> Member States may have
                different national accessibility standards for the built
                environment
              </li>
              <li>
                <strong>Implementation timelines:</strong> Transition periods
                for complying with built environment requirements may vary
              </li>
              <li>
                <strong>Scope differences:</strong> Some Member States may apply
                the requirements to a broader or narrower range of services
              </li>
              <li>
                <strong>Enforcement mechanisms:</strong> The approach to
                monitoring and enforcing compliance may differ between countries
              </li>
            </ul>
            <p>
              Service providers operating across multiple Member States should
              be aware of these variations and ensure compliance with the
              specific requirements in each country where they operate.
            </p>
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="relationship-other-annexes"
          >
            Relationship with Other Annexes
          </h2>
          <div className="prose max-w-none">
            <p>Annex III works in conjunction with other parts of the EAA:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Annex I (Accessibility Requirements):</strong> While
                Annex I focuses on product and service accessibility, Annex III
                addresses the physical environment where those services are
                provided
              </li>
              <li>
                <strong>Annex II (Examples of Implementation):</strong> Some
                examples in Annex II may relate to physical interfaces or
                elements relevant to the built environment
              </li>
              <li>
                <strong>Annex IV and VI (Disproportionate Burden):</strong> The
                assessment of disproportionate burden may also apply to built
                environment requirements
              </li>
              <li>
                <strong>Annex V (Conformity Assessment):</strong> The conformity
                assessment process may need to consider built environment
                aspects for service providers
              </li>
            </ul>
            <p>
              Understanding the interrelation between these annexes helps
              service providers develop comprehensive accessibility strategies
              that address both digital and physical aspects of service
              delivery.
            </p>
          </div>
        </section>

        <nav className="flex justify-between mt-10 pt-4 border-t">
          <Link
            href="/eaa/annexes/implementation-examples"
            className="text-blue-600 hover:underline"
          >
            ← Annex II: Examples of Implementation
          </Link>
          <Link
            href="/eaa/annexes/disproportionate-burden-assessment"
            className="text-blue-600 hover:underline"
          >
            Annex IV: Assessment of Disproportionate Burden →
          </Link>
        </nav>
      </div>
    </>
  )
}
