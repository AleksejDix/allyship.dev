import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title:
    'Annex VI: Criteria for Disproportionate Burden | European Accessibility Act',
  description:
    'Detailed criteria for assessing disproportionate burden claims under the European Accessibility Act, including evaluation factors, quantitative analysis, and documentation requirements.',
}

export default function CriteriaDisproportionateBurdenPage() {
  return (
    <>
      <Link
        href="/eaa/annexes"
        className="inline-flex items-center text-sm text-blue-600 mb-6 hover:underline"
      >
        ← Back to Annexes Overview
      </Link>

      <h1 className="text-4xl font-bold mb-8">
        Annex VI: Criteria for Disproportionate Burden
      </h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4" id="overview">
            Overview
          </h2>
          <div className="prose max-w-none">
            <p>
              Annex VI of the European Accessibility Act (EAA) establishes
              specific criteria for assessing whether compliance with
              accessibility requirements would impose a disproportionate burden
              on economic operators. These criteria provide a structured
              framework for evaluating claims of disproportionate burden and
              ensuring consistent application across the EU.
            </p>
            <p>
              The criteria in this annex should be used in conjunction with the
              disproportionate burden assessment process outlined in Annex IV.
              While Annex IV provides the overall assessment methodology, Annex
              VI details the specific factors that should be considered during
              this assessment.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="evaluation-criteria">
            Evaluation Criteria
          </h2>
          <div className="prose max-w-none">
            <p>
              The EAA specifies that the following criteria must be taken into
              account when conducting an assessment of disproportionate burden:
            </p>

            <ol className="pl-6 space-y-4">
              <li>
                <strong>
                  The ratio of net costs of compliance to overall costs:
                </strong>
                <ul>
                  <li>
                    Net costs of compliance with accessibility requirements
                    versus overall costs (operating and capital expenditures) of
                    the economic operator
                  </li>
                  <li>
                    This establishes a proportional assessment of financial
                    impact relative to the organization's size and resources
                  </li>
                </ul>
              </li>
              <li>
                <strong>
                  The estimated costs and benefits compared to the potential
                  benefit to persons with disabilities:
                </strong>
                <ul>
                  <li>
                    Taking into account the frequency and duration of use of the
                    specific product or service
                  </li>
                  <li>
                    This balances implementation costs against the scale of
                    potential positive impact for users with disabilities
                  </li>
                </ul>
              </li>
              <li>
                <strong>
                  The ratio of the net costs of compliance to the economic
                  operator's net turnover:
                </strong>
                <ul>
                  <li>
                    This ratio provides a measure of economic impact relative to
                    the organization's financial capacity
                  </li>
                  <li>
                    It helps determine whether the costs would significantly
                    impact the operator's financial viability
                  </li>
                </ul>
              </li>
            </ol>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="net-costs-assessment">
            Assessing Net Costs of Compliance
          </h2>
          <div className="prose max-w-none">
            <p>
              Net costs of compliance should be calculated considering both
              direct costs and potential benefits:
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">Direct Costs</h3>
            <p>Direct costs related to achieving compliance include:</p>
            <ul>
              <li>
                <strong>Design and Development:</strong> Costs for redesigning
                products or services to incorporate accessibility features
              </li>
              <li>
                <strong>Implementation:</strong> Physical production or
                programming costs related to accessibility features
              </li>
              <li>
                <strong>Testing:</strong> Costs for testing and validating
                accessibility features
              </li>
              <li>
                <strong>Documentation:</strong> Costs for creating accessibility
                documentation
              </li>
              <li>
                <strong>Training:</strong> Costs for training staff on
                accessibility requirements
              </li>
              <li>
                <strong>Maintenance:</strong> Ongoing costs for maintaining
                accessibility features
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              Offsetting Benefits
            </h3>
            <p>
              Potential benefits that should be deducted from costs include:
            </p>
            <ul>
              <li>
                <strong>Market Expansion:</strong> Revenue from increased market
                size due to inclusivity
              </li>
              <li>
                <strong>Public Funding:</strong> Subsidies or financial support
                for accessibility implementation
              </li>
              <li>
                <strong>Tax Benefits:</strong> Tax incentives for accessibility
                investments
              </li>
              <li>
                <strong>Operational Efficiencies:</strong> Cost savings from
                streamlined processes resulting from accessibility improvements
              </li>
              <li>
                <strong>Brand Value:</strong> Enhanced reputation and brand
                value from demonstrating social responsibility
              </li>
              <li>
                <strong>Avoided Costs:</strong> Potential litigation or
                compliance penalties avoided
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              Net Cost Calculation
            </h3>
            <p>The calculation of net costs should follow this formula:</p>
            <pre className="bg-gray-100 p-4 rounded">
              Net Costs = Direct Costs - Offsetting Benefits
            </pre>
            <p>
              This net cost figure is then used in the ratio calculations
              specified in the evaluation criteria.
            </p>
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="frequency-and-duration"
          >
            Frequency and Duration of Use
          </h2>
          <div className="prose max-w-none">
            <p>
              A critical component of the assessment is the evaluation of
              frequency and duration of use by persons with disabilities:
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              Quantitative Assessment
            </h3>
            <p>
              When evaluating frequency and duration of use, economic operators
              should:
            </p>
            <ul>
              <li>
                <strong>Estimate Potential Users:</strong> Determine the
                estimated number of persons with disabilities who could benefit
                from improved accessibility
              </li>
              <li>
                <strong>Assess Usage Patterns:</strong> Consider how often these
                individuals would use the product or service and for how long
              </li>
              <li>
                <strong>Evaluate Criticality:</strong> Assess whether the
                product or service fulfills essential needs or provides access
                to essential services
              </li>
              <li>
                <strong>Consider Alternatives:</strong> Analyze whether
                accessible alternatives are currently available in the market
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              Categories of Impact
            </h3>
            <p>Impact assessment should consider different categories:</p>
            <ul>
              <li>
                <strong>High Impact:</strong> Products or services used daily or
                continuously by significant numbers of persons with
                disabilities, with few accessible alternatives
              </li>
              <li>
                <strong>Medium Impact:</strong> Products or services used
                regularly by moderate numbers of persons with disabilities, or
                with some accessible alternatives
              </li>
              <li>
                <strong>Low Impact:</strong> Products or services used
                infrequently or by small numbers of persons with disabilities,
                with many accessible alternatives
              </li>
            </ul>
            <p>
              A higher impact category indicates a greater potential benefit to
              persons with disabilities, which should be weighed against the
              costs of implementation.
            </p>
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="ratios-and-thresholds"
          >
            Financial Ratios and Thresholds
          </h2>
          <div className="prose max-w-none">
            <p>
              The EAA does not prescribe specific numerical thresholds that
              automatically constitute a disproportionate burden. Instead, the
              assessment should consider these ratios in the context of:
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              Contextual Evaluation
            </h3>
            <ul>
              <li>
                <strong>Company Size:</strong> Different expectations for large
                corporations versus small and medium enterprises (SMEs)
              </li>
              <li>
                <strong>Industry Standards:</strong> Typical cost ratios and
                investments in the specific industry
              </li>
              <li>
                <strong>Time Horizon:</strong> Short-term costs versus long-term
                benefits and return on investment
              </li>
              <li>
                <strong>Impact Significance:</strong> Higher ratios may be
                acceptable for products or services with high impact on
                accessibility
              </li>
              <li>
                <strong>Resource Availability:</strong> Financial and technical
                resources available to the economic operator
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              Suggested Framework
            </h3>
            <p>
              While not specifically mandated by the EAA, the following
              framework may help in evaluation:
            </p>
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">
                    Impact Category
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Cost/Turnover Ratio Considerations
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    High Impact
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Higher ratios may be expected before claiming
                    disproportionate burden
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    Medium Impact
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Moderate ratios may warrant case-by-case evaluation
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    Low Impact
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Lower ratios might support disproportionate burden claims
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="mt-4">
              National authorities may provide more specific guidance on
              appropriate thresholds within their jurisdictions.
            </p>
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
              Economic operators claiming disproportionate burden must maintain
              comprehensive documentation of their assessment process, which
              should include:
            </p>

            <ol className="pl-6 space-y-4">
              <li>
                <strong>Detailed Cost Analysis:</strong>
                <ul>
                  <li>
                    Itemized breakdown of costs related to implementing each
                    accessibility requirement
                  </li>
                  <li>
                    Documentation of how costs were estimated, including any
                    quotes, expert assessments, or previous implementation
                    experiences
                  </li>
                  <li>
                    Identification of offsetting benefits and how they were
                    calculated
                  </li>
                </ul>
              </li>
              <li>
                <strong>Financial Context:</strong>
                <ul>
                  <li>
                    Overall costs of producing or providing the product or
                    service
                  </li>
                  <li>Net turnover figures for the relevant period</li>
                  <li>
                    Calculated ratios as specified in the evaluation criteria
                  </li>
                </ul>
              </li>
              <li>
                <strong>Impact Assessment:</strong>
                <ul>
                  <li>
                    Analysis of frequency and duration of use by persons with
                    disabilities
                  </li>
                  <li>
                    Supporting data or research on user demographics and needs
                  </li>
                  <li>
                    Evaluation of the criticality of the product or service
                  </li>
                </ul>
              </li>
              <li>
                <strong>Alternative Measures:</strong>
                <ul>
                  <li>
                    Documentation of alternative measures considered and
                    implemented
                  </li>
                  <li>
                    Explanation of how these measures maximize accessibility
                    within the constraints identified
                  </li>
                  <li>
                    Plan for reevaluation when financial or technical
                    constraints change
                  </li>
                </ul>
              </li>
              <li>
                <strong>Methodology:</strong>
                <ul>
                  <li>Description of the assessment methodology used</li>
                  <li>Qualifications of those who conducted the assessment</li>
                  <li>
                    Any consultation with accessibility experts or user groups
                  </li>
                </ul>
              </li>
            </ol>
            <p>
              This documentation must be retained for a period of five years
              from the last time the product was made available on the market or
              after the service was last provided.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="microenterprises">
            Special Provisions for Microenterprises
          </h2>
          <div className="prose max-w-none">
            <p>
              The EAA contains special provisions for microenterprises providing
              services:
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              Exemption from Assessment Requirements
            </h3>
            <p>
              Microenterprises providing services are exempted from the
              requirement to perform the assessment of disproportionate burden.
              However, they must still comply with the applicable accessibility
              requirements.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              Definition of Microenterprise
            </h3>
            <p>
              A microenterprise is defined as an enterprise that employs fewer
              than 10 persons and has an annual turnover not exceeding €2
              million or an annual balance sheet total not exceeding €2 million.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">Implications</h3>
            <p>
              While microenterprises providing services are exempt from the
              formal assessment requirements, they should note that:
            </p>
            <ul>
              <li>
                They still must comply with the accessibility requirements of
                the EAA
              </li>
              <li>
                If they claim disproportionate burden, they should be prepared
                to justify this claim if requested by market surveillance
                authorities
              </li>
              <li>
                The exemption applies only to the formal assessment process, not
                to the accessibility requirements themselves
              </li>
              <li>
                Microenterprises that manufacture products are not exempt from
                the assessment requirement
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="practical-examples">
            Practical Examples of Assessment Applications
          </h2>
          <div className="prose max-w-none">
            <p>
              The following examples illustrate how the criteria might be
              applied in practice:
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              Example 1: E-commerce Website
            </h3>
            <div className="bg-gray-100 p-4 rounded mb-4">
              <p className="font-medium">Scenario:</p>
              <p>
                An online retailer with annual turnover of €5 million needs to
                make their website accessible. The estimated cost for redesign,
                development, and testing is €75,000, with annual maintenance
                costs of €15,000.
              </p>
              <p className="font-medium mt-2">Assessment:</p>
              <ul>
                <li>
                  <strong>Net costs:</strong> €75,000 initial + €15,000 annual =
                  €90,000 for first year
                </li>
                <li>
                  <strong>Potential offsetting benefits:</strong> Estimated
                  increased sales of €30,000 annually from new customers
                </li>
                <li>
                  <strong>Net first-year cost:</strong> €60,000
                </li>
                <li>
                  <strong>Ratio to turnover:</strong> 1.2% of annual turnover
                </li>
                <li>
                  <strong>Impact category:</strong> High (e-commerce is used
                  daily by many persons with disabilities)
                </li>
                <li>
                  <strong>Conclusion:</strong> Given the high impact and
                  relatively low ratio to turnover, this would likely not
                  qualify as a disproportionate burden.
                </li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              Example 2: Specialized Medical Device
            </h3>
            <div className="bg-gray-100 p-4 rounded mb-4">
              <p className="font-medium">Scenario:</p>
              <p>
                A small manufacturer with annual turnover of €1.5 million
                produces a specialized medical device. Making the device
                accessible would require a complete redesign costing €250,000,
                plus €50,000 for new manufacturing equipment.
              </p>
              <p className="font-medium mt-2">Assessment:</p>
              <ul>
                <li>
                  <strong>Net costs:</strong> €300,000 initial investment
                </li>
                <li>
                  <strong>Potential offsetting benefits:</strong> Estimated
                  increased sales of €20,000 annually
                </li>
                <li>
                  <strong>Net first-year cost:</strong> €280,000
                </li>
                <li>
                  <strong>Ratio to turnover:</strong> 18.7% of annual turnover
                </li>
                <li>
                  <strong>Impact category:</strong> Medium (specialized device
                  used by a moderate number of persons with disabilities)
                </li>
                <li>
                  <strong>Conclusion:</strong> With a significant ratio to
                  turnover and medium impact, this might qualify as a
                  disproportionate burden. The manufacturer should document the
                  assessment thoroughly and consider alternative measures to
                  maximize accessibility within their constraints.
                </li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              Example 3: Mobile Banking Application
            </h3>
            <div className="bg-gray-100 p-4 rounded">
              <p className="font-medium">Scenario:</p>
              <p>
                A medium-sized bank with annual turnover of €50 million needs to
                make its mobile banking application accessible. The estimated
                cost is €200,000 for redesign and development, with annual
                maintenance of €30,000.
              </p>
              <p className="font-medium mt-2">Assessment:</p>
              <ul>
                <li>
                  <strong>Net costs:</strong> €200,000 initial + €30,000 annual
                  = €230,000 for first year
                </li>
                <li>
                  <strong>Potential offsetting benefits:</strong> Estimated
                  increased customer retention and acquisition worth €100,000
                  annually
                </li>
                <li>
                  <strong>Net first-year cost:</strong> €130,000
                </li>
                <li>
                  <strong>Ratio to turnover:</strong> 0.26% of annual turnover
                </li>
                <li>
                  <strong>Impact category:</strong> High (banking services are
                  essential and used regularly by many persons with
                  disabilities)
                </li>
                <li>
                  <strong>Conclusion:</strong> Given the low ratio to turnover
                  and high impact, this would not qualify as a disproportionate
                  burden.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="potential-challenges">
            Challenges in Criteria Application
          </h2>
          <div className="prose max-w-none">
            <p>
              Economic operators may face several challenges when applying these
              criteria:
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              Common Assessment Difficulties
            </h3>
            <ul>
              <li>
                <strong>Quantifying Benefits:</strong> Determining the exact
                financial benefit of increased accessibility can be challenging
              </li>
              <li>
                <strong>Estimating User Impact:</strong> Limited data on users
                with disabilities may make it difficult to accurately assess
                frequency and duration of use
              </li>
              <li>
                <strong>Varying Technical Complexity:</strong> Accessibility
                implementation costs can vary widely based on existing systems
                and architectures
              </li>
              <li>
                <strong>Evolving Standards:</strong> Changing technical
                specifications and harmonized standards may impact cost
                assessments
              </li>
              <li>
                <strong>Organizational Structure:</strong> For complex
                organizations, determining the appropriate level (product,
                division, company) for assessment can be difficult
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              Potential Mitigation Strategies
            </h3>
            <p>To address these challenges, economic operators can:</p>
            <ul>
              <li>
                <strong>Consult Experts:</strong> Engage accessibility
                specialists to provide accurate cost and impact assessments
              </li>
              <li>
                <strong>Conduct User Research:</strong> Gather data on users
                with disabilities through surveys, interviews, or market
                research
              </li>
              <li>
                <strong>Phase Implementation:</strong> Consider a phased
                approach to spread costs over time while progressively improving
                accessibility
              </li>
              <li>
                <strong>Industry Collaboration:</strong> Share anonymized cost
                data and best practices through industry associations
              </li>
              <li>
                <strong>Consult Authorities:</strong> Seek guidance from market
                surveillance authorities on appropriate assessment methodologies
              </li>
            </ul>
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
            <p>Annex VI works in conjunction with other parts of the EAA:</p>
            <ul>
              <li>
                <strong>Annex I (Accessibility Requirements):</strong> Defines
                the accessibility requirements that form the basis for the
                disproportionate burden assessment
              </li>
              <li>
                <strong>Annex IV (Disproportionate Burden Assessment):</strong>{' '}
                Provides the methodology for conducting the assessment, while
                Annex VI provides the specific criteria to be applied
              </li>
              <li>
                <strong>Annex V (Conformity Assessment for Products):</strong>{' '}
                Relates to the process that products must undergo to demonstrate
                compliance with accessibility requirements, which may be
                affected by disproportionate burden claims
              </li>
            </ul>
            <p>
              Understanding these relationships is crucial for economic
              operators to correctly assess and document disproportionate burden
              claims in the context of the EAA as a whole.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="conclusion">
            Conclusion
          </h2>
          <div className="prose max-w-none">
            <p>
              The criteria in Annex VI provide a structured framework for
              assessing whether compliance with accessibility requirements would
              impose a disproportionate burden. By considering the ratio of
              costs to overall costs and turnover, as well as the potential
              benefit to persons with disabilities based on frequency and
              duration of use, economic operators can make an informed
              assessment.
            </p>
            <p>
              It is important to note that claiming disproportionate burden is
              an exception rather than the rule. Economic operators should
              always aim to maximize accessibility within their constraints and
              should only claim disproportionate burden after a thorough and
              well-documented assessment process.
            </p>
            <p>
              The assessment should be periodically reviewed as technologies
              evolve, costs change, and new solutions become available, ensuring
              that accessibility continues to improve over time even when a
              disproportionate burden has been legitimately claimed.
            </p>
          </div>
        </section>

        <nav className="flex justify-between mt-10 pt-4 border-t">
          <Link
            href="/eaa/annexes/conformity-assessment-products"
            className="text-blue-600 hover:underline"
          >
            ← Annex V: Conformity Assessment for Products
          </Link>
          <Link href="/eaa/annexes" className="text-blue-600 hover:underline">
            Back to Annexes Overview
          </Link>
        </nav>
      </div>
    </>
  )
}
