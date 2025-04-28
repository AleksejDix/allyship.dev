import React from 'react'
import { Metadata } from 'next'

import { ChapterNavigation } from '../../components/ChapterNavigation'

export const metadata: Metadata = {
  title: 'Periodic Reviews | European Accessibility Act',
  description:
    'Understanding the periodic review process under the European Accessibility Act (EAA) and how it supports continuous improvement in accessibility.',
}

export default function PeriodicReviewsPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 id="page-title" className="text-4xl font-bold mb-[23px]">
            Periodic Reviews.
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
                  href="#member-state-reviews"
                  id="member-state-reviews-link"
                >
                  Member State Reviews.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#commission-reviews"
                  id="commission-reviews-link"
                >
                  Commission Reviews.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#review-process"
                  id="review-process-link"
                >
                  Review Process.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#stakeholder-involvement"
                  id="stakeholder-involvement-link"
                >
                  Stakeholder Involvement.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#implications"
                  id="implications-link"
                >
                  Implications for Organizations.
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
          <section aria-labelledby="overview-heading">
            <h2
              className="text-2xl font-semibold mb-4 mt-0 scroll-mt-6"
              id="overview"
              tabIndex={-1}
            >
              Overview.
            </h2>
            <div className="space-y-4">
              <p>
                The European Accessibility Act (EAA) establishes a system of
                periodic reviews to assess the implementation, effectiveness,
                and impact of the Act. These reviews are crucial for ensuring
                that the EAA achieves its objectives of improving accessibility
                for persons with disabilities and harmonizing accessibility
                requirements across the EU.
              </p>
              <p>Periodic reviews serve several important purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Evaluating the effectiveness of the EAA in improving
                  accessibility
                </li>
                <li>Identifying challenges in implementation</li>
                <li>Gathering data on compliance and enforcement</li>
                <li>
                  Analyzing the impact on persons with disabilities and economic
                  operators
                </li>
                <li>Informing potential amendments or additional measures</li>
                <li>
                  Adapting to technological changes and emerging accessibility
                  needs
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="member-state-reviews-heading">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="member-state-reviews"
              tabIndex={-1}
            >
              Member State Reviews.
            </h2>
            <div className="space-y-4">
              <p>
                The EAA requires each EU Member State to report regularly on the
                implementation of the Act within their jurisdiction. These
                Member State reviews include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Regular reporting</strong> - Member States must report
                  to the European Commission on:
                  <ul className="list-disc pl-6 mt-2">
                    <li>The application of the accessibility requirements</li>
                    <li>Enforcement activities and measures taken</li>
                    <li>Resources allocated to implementation</li>
                    <li>Challenges encountered and solutions developed</li>
                  </ul>
                </li>
                <li>
                  <strong>Market surveillance reports</strong> - Information on
                  market surveillance activities, including:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Number and types of inspections conducted</li>
                    <li>Identified cases of non-compliance</li>
                    <li>Corrective actions required and taken</li>
                    <li>Penalties imposed for non-compliance</li>
                  </ul>
                </li>
                <li>
                  <strong>Exemption analysis</strong> - Data on the use of
                  exceptions such as:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Disproportionate burden claims</li>
                    <li>Fundamental alteration exemptions</li>
                    <li>Impact of microenterprise exemptions</li>
                  </ul>
                </li>
                <li>
                  <strong>Complaint data</strong> - Information about
                  accessibility complaints received and their resolution
                </li>
              </ul>
              <p>
                These Member State reports form the foundation for the
                Commission's broader review of the EAA and help identify areas
                where implementation guidance or additional measures might be
                needed.
              </p>
            </div>
          </section>

          <section aria-labelledby="commission-reviews-heading">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="commission-reviews"
              tabIndex={-1}
            >
              Commission Reviews.
            </h2>
            <div className="space-y-4">
              <p>
                The European Commission conducts comprehensive reviews of the
                EAA at regular intervals:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Initial review</strong> - By 28 June 2030 (five years
                  after the application date for most requirements), and every
                  five years thereafter
                </li>
                <li>
                  <strong>Review scope</strong> - The Commission reviews:
                  <ul className="list-disc pl-6 mt-2">
                    <li>The application of the Act across Member States</li>
                    <li>Technological developments and market changes</li>
                    <li>
                      Progress in accessibility for persons with disabilities
                    </li>
                    <li>Potential barriers to implementation</li>
                    <li>
                      Economic impact on manufacturers, importers, and service
                      providers
                    </li>
                    <li>
                      Whether additional product and service categories should
                      be included
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Review methodologies</strong> include:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Analysis of Member State reports</li>
                    <li>Stakeholder consultations</li>
                    <li>Independent studies and assessments</li>
                    <li>Analysis of complaint data and enforcement actions</li>
                  </ul>
                </li>
                <li>
                  <strong>Review outcomes</strong> may include:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Recommendations for amendments to the EAA</li>
                    <li>Updated implementation guidance</li>
                    <li>Proposals for additional legislation</li>
                    <li>Recommendations for standardization activities</li>
                  </ul>
                </li>
              </ul>
              <p>
                Commission reviews provide a comprehensive assessment of the
                EAA's effectiveness and help ensure that the Act remains
                relevant and effective as technology and society evolve.
              </p>
            </div>
          </section>

          <section aria-labelledby="review-process-heading">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="review-process"
              tabIndex={-1}
            >
              Review Process.
            </h2>
            <div className="space-y-4">
              <p>The periodic review process typically follows these phases:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  <strong>Data collection</strong> - Gathering information from
                  various sources:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Member State reports on implementation</li>
                    <li>Market surveillance data</li>
                    <li>Feedback from economic operators</li>
                    <li>
                      Input from organizations representing persons with
                      disabilities
                    </li>
                    <li>Academic and market research</li>
                  </ul>
                </li>
                <li>
                  <strong>Analysis</strong> - Evaluating the effectiveness of
                  the EAA:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Compliance levels across different sectors</li>
                    <li>Impact on persons with disabilities</li>
                    <li>Economic impact on business stakeholders</li>
                    <li>Challenges in implementation and enforcement</li>
                    <li>Technological developments affecting accessibility</li>
                  </ul>
                </li>
                <li>
                  <strong>Stakeholder consultation</strong> - Seeking input from
                  interested parties:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Public consultations</li>
                    <li>Targeted stakeholder workshops</li>
                    <li>Expert group meetings</li>
                    <li>Industry and disability organization roundtables</li>
                  </ul>
                </li>
                <li>
                  <strong>Report preparation</strong> - Documenting findings and
                  recommendations:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Assessment of the current state of implementation</li>
                    <li>Identification of best practices</li>
                    <li>Analysis of gaps and challenges</li>
                    <li>Recommendations for improvement</li>
                  </ul>
                </li>
                <li>
                  <strong>Follow-up actions</strong> - Taking steps based on
                  review findings:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Legislative proposals for amendments if needed</li>
                    <li>Development of additional guidance documents</li>
                    <li>Recommendations for standardization activities</li>
                    <li>Enhanced enforcement measures if required</li>
                  </ul>
                </li>
              </ol>
            </div>
          </section>

          <section aria-labelledby="stakeholder-involvement-heading">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="stakeholder-involvement"
              tabIndex={-1}
            >
              Stakeholder Involvement.
            </h2>
            <div className="space-y-4">
              <p>
                The EAA emphasizes the importance of involving key stakeholders
                in the review process:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Persons with disabilities</strong> and their
                  representative organizations:
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Providing firsthand experience of accessibility barriers
                    </li>
                    <li>Evaluating the real-world impact of the EAA</li>
                    <li>Identifying gaps in coverage or implementation</li>
                    <li>Suggesting improvements based on lived experience</li>
                  </ul>
                </li>
                <li>
                  <strong>Economic operators</strong> subject to the EAA:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Sharing implementation challenges</li>
                    <li>Providing data on compliance costs</li>
                    <li>Identifying areas where guidance would be helpful</li>
                    <li>
                      Suggesting improvements to make compliance more efficient
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Industry associations</strong> representing
                  manufacturers, importers, and service providers:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Providing sectoral perspectives on implementation</li>
                    <li>Sharing industry-specific challenges and solutions</li>
                    <li>Contributing to the development of best practices</li>
                  </ul>
                </li>
                <li>
                  <strong>National authorities</strong> responsible for
                  implementation:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Sharing enforcement experiences</li>
                    <li>
                      Identifying resources needed for effective implementation
                    </li>
                    <li>Suggesting improvements to the regulatory framework</li>
                  </ul>
                </li>
                <li>
                  <strong>Standards organizations</strong> and accessibility
                  experts:
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Providing technical expertise on accessibility standards
                    </li>
                    <li>
                      Identifying areas where standards need to be developed or
                      updated
                    </li>
                    <li>Assessing the effectiveness of existing standards</li>
                  </ul>
                </li>
              </ul>
              <p>
                This multi-stakeholder approach ensures that reviews consider
                diverse perspectives and lead to balanced and effective
                improvements.
              </p>
            </div>
          </section>

          <section aria-labelledby="implications-heading">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="implications"
              tabIndex={-1}
            >
              Implications for Organizations.
            </h2>
            <div className="space-y-4">
              <p>
                For organizations subject to the EAA, periodic reviews have
                several important implications:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Documentation practices</strong> - Organizations
                  should:
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Maintain comprehensive records of accessibility measures
                    </li>
                    <li>
                      Document challenges encountered and solutions implemented
                    </li>
                    <li>
                      Track costs associated with accessibility implementation
                    </li>
                    <li>
                      Collect data on user feedback and accessibility complaints
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Engagement opportunities</strong> - Organizations can:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Participate in public consultations on the EAA</li>
                    <li>Provide input through industry associations</li>
                    <li>Share best practices and success stories</li>
                    <li>
                      Highlight implementation challenges requiring guidance
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Adaptation planning</strong> - Organizations should:
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Monitor review outcomes for potential changes to
                      requirements
                    </li>
                    <li>Anticipate expanded scope in future amendments</li>
                    <li>Plan for evolving accessibility standards</li>
                    <li>
                      Adjust compliance strategies based on review findings
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Internal reviews</strong> - Organizations can benefit
                  from:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Conducting their own periodic accessibility reviews</li>
                    <li>
                      Aligning internal review cycles with EAA review timelines
                    </li>
                    <li>
                      Using Commission review findings to benchmark their
                      practices
                    </li>
                    <li>
                      Incorporating review recommendations into accessibility
                      strategies
                    </li>
                  </ul>
                </li>
              </ul>
              <p>
                By actively engaging with the periodic review process,
                organizations can both influence the development of
                accessibility requirements and better prepare for future changes
                to the regulatory landscape.
              </p>
            </div>
          </section>

          <footer>
            <ChapterNavigation currentPageId="6.4-periodic-reviews" />
          </footer>
        </div>
      </div>
    </section>
  )
}
