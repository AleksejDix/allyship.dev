import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { RouterLink, RelatedLinks } from '../../components/RouterLink'
import {
  annexLinks,
  disproportionateBurdenLinks,
} from '../../constants/navigation'

export const metadata: Metadata = {
  title:
    'Annex IV: Assessment of Disproportionate Burden - European Accessibility Act',
  description:
    'Learn about the criteria and assessment process for claiming disproportionate burden exemption under the European Accessibility Act (EAA).',
}

export default function DisproportionateBurdenAssessment() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8">
        <RouterLink
          href="/eaa/annexes"
          className="text-blue-600 hover:underline mb-4 inline-flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Annexes
        </RouterLink>
        <h1 className="text-3xl font-bold mt-4">
          Annex IV: Assessment of Disproportionate Burden
        </h1>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4" id="overview">
            Overview
          </h2>
          <div className="prose max-w-none">
            <p>
              Annex IV of the European Accessibility Act (EAA) establishes the
              criteria for economic operators to assess whether compliance with
              accessibility requirements would impose a disproportionate burden.
              This provides a structured framework for organizations to
              determine when they may be exempt from certain accessibility
              requirements based on legitimate economic considerations.
            </p>
            <p>
              This exemption recognizes that while accessibility is critically
              important, there may be situations where implementing certain
              accessibility requirements would create a fundamentally
              disproportionate financial and organizational burden relative to
              the benefits provided. Annex IV ensures this determination is made
              through a consistent, evidence-based approach.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="assessment-criteria">
            Assessment Criteria
          </h2>
          <div className="prose max-w-none">
            <p>
              Annex IV requires economic operators to use the following criteria
              when conducting their assessment of disproportionate burden:
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              1. Ratio of Net Costs to Overall Costs
            </h3>
            <p>
              The assessment must consider the ratio between the net costs of
              compliance with accessibility requirements and the overall costs
              (operating and capital expenditures) of manufacturing,
              distributing, or importing the product, or providing the service.
              This includes:
            </p>
            <ul>
              <li>
                One-time costs for redesigning products or services to meet
                accessibility requirements
              </li>
              <li>
                Ongoing operational costs related to maintaining accessibility
                features
              </li>
              <li>Costs for staff training related to accessibility</li>
              <li>Costs for testing with users with disabilities</li>
            </ul>
            <p>
              These costs should be weighed against the organization's total
              costs for the product or service.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              2. Estimated Costs and Benefits for the Economic Operator
            </h3>
            <p>
              The assessment must include an estimate of the costs and benefits
              for the economic operator in relation to the estimated benefit for
              persons with disabilities, taking into account:
            </p>
            <ul>
              <li>
                The frequency and duration of use of the specific product or
                service
              </li>
              <li>
                The estimated number of persons with disabilities who would
                benefit from improved accessibility
              </li>
              <li>The estimated market gains from increased accessibility</li>
              <li>The lifecycle of the product or service</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              3. Comparison of Net Costs with Organization Criteria
            </h3>
            <p>
              The assessment must compare the net costs of compliance with the
              accessibility requirements with:
            </p>
            <ul>
              <li>
                <strong>For Microenterprises:</strong> The organization's
                overall resources, ensuring the burden does not threaten the
                viability of the business
              </li>
              <li>
                <strong>For Other Enterprises:</strong> The proportion of
                accessibility-related expenditure compared to the organization's
                turnover
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="documentation-requirements"
          >
            Documentation Requirements
          </h2>
          <div className="prose max-w-none">
            <p>
              When claiming disproportionate burden, economic operators must
              document their assessment thoroughly. The documentation should
              include:
            </p>
            <ul>
              <li>
                <strong>Detailed Cost Analysis:</strong> Itemized breakdown of
                estimated costs for implementing each accessibility requirement
                identified as potentially imposing a disproportionate burden
              </li>
              <li>
                <strong>Benefit Analysis:</strong> Assessment of the potential
                benefits for persons with disabilities, including quantitative
                and qualitative factors where possible
              </li>
              <li>
                <strong>Alternatives Considered:</strong> Documentation of
                partial accessibility solutions or alternatives considered and
                why they were insufficient or still imposed a disproportionate
                burden
              </li>
              <li>
                <strong>Financial Context:</strong> Relevant financial
                information that demonstrates the disproportionate nature of the
                burden in relation to the organization's size and resources
              </li>
              <li>
                <strong>Expert Input:</strong> Any relevant expert opinions or
                stakeholder consultations conducted as part of the assessment
              </li>
            </ul>
            <p>
              This documentation must be retained for at least five years from
              the last time the product is made available on the market, or the
              last time the service is provided, as appropriate.
            </p>
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="periodic-reassessment"
          >
            Periodic Reassessment
          </h2>
          <div className="prose max-w-none">
            <p>
              The EAA requires economic operators to conduct a reassessment of
              disproportionate burden in the following situations:
            </p>
            <ul>
              <li>When a service provided is modified</li>
              <li>When a product is changed or redesigned</li>
              <li>When requested by a market surveillance authority</li>
              <li>At a minimum, every five years</li>
            </ul>
            <p>
              The purpose of periodic reassessment is to determine whether
              circumstances have changed that might affect the previous
              determination of disproportionate burden. Such changes might
              include:
            </p>
            <ul>
              <li>
                Decreased implementation costs due to technological advances
              </li>
              <li>
                Availability of new tools that make accessibility implementation
                easier
              </li>
              <li>Changes in the organization's financial situation</li>
              <li>
                Changes in the product or service that might affect
                accessibility implementation
              </li>
              <li>
                Evolution of user needs and expectations regarding accessibility
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="microenterprises">
            Special Provisions for Microenterprises
          </h2>
          <div className="prose max-w-none">
            <p>
              The EAA includes special provisions for microenterprises providing
              services. According to the Act, microenterprises are exempt from
              complying with the accessibility requirements and from carrying
              out the disproportionate burden assessment. However:
            </p>
            <ul>
              <li>
                This exemption only applies to microenterprises providing
                services, not those manufacturing, importing, or distributing
                products
              </li>
              <li>
                A microenterprise is defined as an enterprise which employs
                fewer than 10 persons and whose annual turnover and/or annual
                balance sheet total does not exceed €2 million
              </li>
              <li>
                Market surveillance authorities can still request relevant
                documentation to verify that an enterprise qualifies as a
                microenterprise
              </li>
            </ul>
            <p>
              Despite the exemption, microenterprises are encouraged to consider
              implementing accessibility features where feasible, as this can
              open up market opportunities and prepare them for growth beyond
              microenterprise status.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="guiding-principles">
            Guiding Principles for Assessment
          </h2>
          <div className="prose max-w-none">
            <p>
              When conducting a disproportionate burden assessment, economic
              operators should follow these guiding principles:
            </p>
            <ul>
              <li>
                <strong>Requirement-Specific Analysis:</strong> Assess each
                accessibility requirement individually, rather than making a
                blanket determination for all requirements
              </li>
              <li>
                <strong>Evidence-Based Approach:</strong> Base the assessment on
                objective evidence rather than assumptions about costs or
                benefits
              </li>
              <li>
                <strong>Narrowest Possible Exemption:</strong> Seek the most
                limited exemption possible, implementing as many accessibility
                requirements as can be reasonably accommodated
              </li>
              <li>
                <strong>Alternative Solutions:</strong> Consider whether partial
                implementation or alternative approaches might mitigate the
                burden while still improving accessibility
              </li>
              <li>
                <strong>Consultation:</strong> Consult with accessibility
                experts and organizations representing persons with disabilities
                when possible to ensure a thorough understanding of the
                implications
              </li>
              <li>
                <strong>Forward-Looking:</strong> Consider future technological
                developments and potentially decreasing implementation costs
                over time
              </li>
              <li>
                <strong>Transparency:</strong> Be prepared to share the
                rationale for a disproportionate burden determination with
                stakeholders and authorities
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="practical-assessment-steps"
          >
            Practical Assessment Steps
          </h2>
          <div className="prose max-w-none">
            <p>
              Economic operators can use the following step-by-step approach to
              conduct a disproportionate burden assessment in line with Annex IV
              requirements:
            </p>
            <ol className="pl-6 space-y-4">
              <li>
                <strong>Identify Applicable Requirements:</strong> Determine
                which accessibility requirements from Annex I apply to your
                specific product or service
              </li>
              <li>
                <strong>Evaluate Implementation Options:</strong> For each
                requirement, identify the technical and organizational measures
                needed for implementation
              </li>
              <li>
                <strong>Estimate Costs:</strong> Calculate the one-time and
                ongoing costs associated with implementing each accessibility
                requirement, including:
                <ul>
                  <li>Design and development costs</li>
                  <li>Testing costs</li>
                  <li>Staff training</li>
                  <li>Documentation updates</li>
                  <li>Ongoing maintenance</li>
                </ul>
              </li>
              <li>
                <strong>Estimate Benefits:</strong> Assess the potential
                benefits of implementing each requirement, including:
                <ul>
                  <li>Potential market expansion</li>
                  <li>Improved user experience for all users</li>
                  <li>Competitive advantages</li>
                  <li>Reduced legal risk</li>
                  <li>Enhanced brand reputation</li>
                </ul>
              </li>
              <li>
                <strong>Determine Net Burden:</strong> Calculate the net burden
                by comparing costs against benefits and organizational resources
              </li>
              <li>
                <strong>Explore Alternatives:</strong> For requirements where
                the initial assessment indicates a disproportionate burden,
                explore alternative approaches that might be less burdensome
              </li>
              <li>
                <strong>Document Assessment:</strong> Create comprehensive
                documentation of the assessment process, findings, and
                justifications
              </li>
              <li>
                <strong>Set Reassessment Schedule:</strong> Establish a timeline
                for periodic reassessment, including triggers for earlier
                reassessment
              </li>
            </ol>
            <p>
              This structured approach helps ensure a thorough and defensible
              assessment that meets the requirements of Annex IV while
              identifying opportunities to maximize accessibility within
              reasonable resource constraints.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="limitations">
            Limitations of the Disproportionate Burden Exemption
          </h2>
          <div className="prose max-w-none">
            <p>
              While the disproportionate burden provision provides important
              flexibility, it is subject to several limitations:
            </p>
            <ul>
              <li>
                <strong>Not Automatic:</strong> The exemption is not
                automatically granted and must be justified through a documented
                assessment
              </li>
              <li>
                <strong>Subject to Verification:</strong> Market surveillance
                authorities can request and evaluate the assessment
                documentation
              </li>
              <li>
                <strong>Temporary Nature:</strong> A disproportionate burden
                determination is not permanent and must be periodically
                reassessed
              </li>
              <li>
                <strong>Not Applicable to EU Funds:</strong> Products or
                services funded by EU programs must comply with accessibility
                requirements regardless of burden
              </li>
              <li>
                <strong>Cannot Override Fundamental Requirements:</strong> The
                disproportionate burden provision cannot be used to avoid
                implementing accessibility features that are considered
                fundamental to the product or service's basic functionality
              </li>
              <li>
                <strong>Public Accountability:</strong> Organizations using this
                exemption should be prepared for potential public scrutiny and
                market pressure
              </li>
            </ul>
            <p>
              These limitations ensure that the disproportionate burden
              provision is used appropriately and does not undermine the
              fundamental objectives of the EAA.
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
            <p>Annex IV works in conjunction with other annexes of the EAA:</p>
            <ul>
              <li>
                <strong>Annex I (Accessibility Requirements):</strong> The
                disproportionate burden assessment evaluates the feasibility of
                implementing the specific accessibility requirements detailed in
                Annex I
              </li>
              <li>
                <strong>Annex II (Examples of Implementation):</strong> The
                examples provided in Annex II can help economic operators
                understand potential implementation approaches and associated
                costs when conducting their assessment
              </li>
              <li>
                <strong>Annex V (Conformity Assessment for Products):</strong>{' '}
                Products claiming a disproportionate burden exemption must still
                undergo conformity assessment for any accessibility requirements
                that are being implemented
              </li>
              <li>
                <strong>
                  Annex VI (Criteria for Disproportionate Burden):
                </strong>{' '}
                Works directly with Annex IV, providing more detailed criteria
                for assessing disproportionate burden
              </li>
            </ul>
            <p>
              Understanding these relationships helps economic operators conduct
              comprehensive assessments that consider all relevant aspects of
              the EAA.
            </p>
          </div>
        </section>

        <nav className="flex justify-between mt-10 pt-4 border-t">
          <Link
            href="/eaa/annexes/built-environment"
            className="text-blue-600 hover:underline"
          >
            ← Annex III: Requirements for Built Environment
          </Link>
          <Link
            href="/eaa/annexes/conformity-assessment-products"
            className="text-blue-600 hover:underline"
          >
            Annex V: Conformity Assessment for Products →
          </Link>
        </nav>
      </div>

      <section className="mt-12 border-t pt-8">
        <h2 className="text-xl font-semibold mb-4">Related Resources</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {disproportionateBurdenLinks.map(link => (
            <li key={link.href}>
              <RouterLink
                href={link.href}
                className="hover:underline block p-2 rounded-md hover:bg-muted/50 transition-colors"
              >
                {link.label}
              </RouterLink>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
