import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { ANNEXES_LINKS } from '../../constants/links'
import { EAARelationshipDiagram } from '../../components/EAARelationshipDiagram'

export const metadata: Metadata = {
  title:
    'Annex IV: Assessment of Disproportionate Burden - European Accessibility Act',
  description:
    'Learn about the criteria and assessment process for claiming disproportionate burden exemption under the European Accessibility Act (EAA).',
}

export default function DisproportionateBurdenAssessment() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 className="text-4xl font-bold mb-[23px]">
            Annex IV: Assessment of Disproportionate Burden.
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
                  href="#assessment-criteria"
                  id="assessment-criteria-link"
                >
                  Assessment Criteria.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#documentation-requirements"
                  id="documentation-requirements-link"
                >
                  Documentation Requirements.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#periodic-reassessment"
                  id="periodic-reassessment-link"
                >
                  Periodic Reassessment.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#microenterprises"
                  id="microenterprises-link"
                >
                  Special Provisions for Microenterprises.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#guiding-principles"
                  id="guiding-principles-link"
                >
                  Guiding Principles.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#practical-assessment-steps"
                  id="practical-assessment-steps-link"
                >
                  Practical Assessment Steps.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#limitations"
                  id="limitations-link"
                >
                  Limitations.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#relationship-other-annexes"
                  id="relationship-other-annexes-link"
                >
                  Relationship with Other Annexes.
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div
        className="lg:col-span-5 prose prose-lg dark:prose-invert pb-4 pt-2"
        id="eaa-content"
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
                Annex IV helps businesses decide if making their products
                accessible would cost too much money. This part of the European
                Accessibility Act (EAA) explains when a business can be excused
                from some accessibility rules.
              </p>
              <p>
                Sometimes making products accessible is very expensive for a
                business. The law recognizes this. Annex IV creates a fair way
                to decide when costs are too high compared to the benefits. It
                makes sure decisions are based on facts, not just opinions.
              </p>
            </div>
          </section>

          <section aria-labelledby="assessment-criteria">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="assessment-criteria"
              tabIndex={-1}
            >
              Assessment Criteria.
            </h2>
            <div className="space-y-4">
              <p>
                Businesses must use these criteria when checking if
                accessibility costs too much:
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                1. Ratio of Net Costs to Overall Costs.
              </h3>
              <p>
                Businesses must compare the cost of making things accessible to
                their total business costs. These costs include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  One-time costs to redesign products or services to be
                  accessible.
                </li>
                <li>Ongoing costs to maintain accessibility features.</li>
                <li>Costs for training staff about accessibility.</li>
                <li>Costs for testing with people who have disabilities.</li>
              </ul>
              <p>
                These costs should be compared to the total cost of making and
                selling the product.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                2. Estimated Costs and Benefits for the Business.
              </h3>
              <p>
                The assessment must include what the business will spend and
                gain. It should consider benefits for people with disabilities,
                including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>How often people use the product or service.</li>
                <li>How many people with disabilities would benefit.</li>
                <li>
                  How much more money the business might make from being
                  accessible.
                </li>
                <li>How long the product or service will last.</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                3. Comparing Net Costs with Organization Size.
              </h3>
              <p>
                The assessment must compare the costs of meeting accessibility
                requirements with:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>For Very Small Businesses:</strong> The total
                  resources of the business, making sure costs won't put them
                  out of business.
                </li>
                <li>
                  <strong>For Larger Businesses:</strong> The percentage of
                  money spent on accessibility compared to their total sales.
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="documentation-requirements">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="documentation-requirements"
              tabIndex={-1}
            >
              Documentation Requirements.
            </h2>
            <div className="space-y-4">
              <p>
                When claiming costs are too high, businesses must keep detailed
                records. These records should include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Detailed Cost Breakdown:</strong> A list of all
                  expected costs for making each accessibility feature that
                  might be too expensive.
                </li>
                <li>
                  <strong>Benefit Analysis:</strong> An assessment of how people
                  with disabilities would benefit, with numbers when possible.
                </li>
                <li>
                  <strong>Alternatives Considered:</strong> Notes about partial
                  solutions that were considered and why they were still too
                  expensive.
                </li>
                <li>
                  <strong>Financial Information:</strong> Money details that
                  show why the costs are too high for the size of the business.
                </li>
                <li>
                  <strong>Expert Input:</strong> Any opinions from experts or
                  feedback from stakeholders.
                </li>
              </ul>
              <p>
                Businesses must keep these records for at least five years after
                they stop selling the product or providing the service.
              </p>
            </div>
          </section>

          <section aria-labelledby="periodic-reassessment">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="periodic-reassessment"
              tabIndex={-1}
            >
              Periodic Reassessment.
            </h2>
            <div className="space-y-4">
              <p>
                Businesses must check their cost assessment again in these
                situations:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>When they change a service.</li>
                <li>When they change or redesign a product.</li>
                <li>When requested by an authority.</li>
                <li>At least every five years.</li>
              </ul>
              <p>
                They need to check if anything has changed that might affect
                their previous decision. Changes might include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Lower costs due to new technology.</li>
                <li>New tools that make accessibility easier.</li>
                <li>Changes in the business's financial situation.</li>
                <li>Changes to the product that might affect accessibility.</li>
                <li>
                  Changes in what users need and expect regarding accessibility.
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="microenterprises">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="microenterprises"
              tabIndex={-1}
            >
              Special Provisions for Microenterprises.
            </h2>
            <div className="space-y-4">
              <p>
                The EAA has special rules for very small businesses providing
                services. These businesses are exempt from:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Meeting the accessibility requirements.</li>
                <li>Doing the cost assessment.</li>
              </ul>
              <p>However, these important points apply:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  This exemption only applies to very small businesses providing
                  services, not those making or selling products.
                </li>
                <li>
                  A very small business has fewer than 10 employees and makes
                  less than €2 million per year.
                </li>
                <li>
                  Authorities can still ask for proof that a business qualifies
                  as very small.
                </li>
              </ul>
              <p>
                Even with this exemption, very small businesses should consider
                adding accessibility features when possible. This can help them
                reach more customers and prepare for future growth.
              </p>
            </div>
          </section>

          <section aria-labelledby="guiding-principles">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="guiding-principles"
              tabIndex={-1}
            >
              Guiding Principles for Assessment.
            </h2>
            <div className="space-y-4">
              <p>
                When checking if accessibility costs too much, businesses should
                follow these principles:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Check Each Requirement Separately:</strong> Look at
                  each accessibility requirement individually, not all at once.
                </li>
                <li>
                  <strong>Use Real Evidence:</strong> Base decisions on facts,
                  not guesses about costs or benefits.
                </li>
                <li>
                  <strong>Seek Limited Exemptions:</strong> Try to make as many
                  accessibility features as possible, asking for exemptions only
                  when truly needed.
                </li>
                <li>
                  <strong>Consider Alternatives:</strong> Think about partial
                  solutions or different approaches that might cost less.
                </li>
                <li>
                  <strong>Get Expert Input:</strong> Talk to accessibility
                  experts and disability organizations when possible.
                </li>
                <li>
                  <strong>Think About the Future:</strong> Consider new
                  technology that might make accessibility cheaper over time.
                </li>
                <li>
                  <strong>Be Open:</strong> Be ready to explain your decisions
                  to stakeholders and authorities.
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="practical-assessment-steps">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="practical-assessment-steps"
              tabIndex={-1}
            >
              Practical Assessment Steps.
            </h2>
            <div className="space-y-4">
              <p>
                Businesses can follow these steps to check if accessibility
                requirements cost too much:
              </p>
              <ol className="pl-6 space-y-4">
                <li>
                  <strong>Find Required Accessibility Features:</strong>{' '}
                  Determine which accessibility requirements from Annex I apply
                  to your product or service.
                </li>
                <li>
                  <strong>List Implementation Options:</strong> For each
                  requirement, identify ways to make your product or service
                  meet the requirement.
                </li>
                <li>
                  <strong>Calculate Costs:</strong> Figure out one-time and
                  ongoing costs for each accessibility requirement, including:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Design and development costs.</li>
                    <li>Testing costs.</li>
                    <li>Staff training.</li>
                    <li>Documentation updates.</li>
                    <li>Ongoing maintenance.</li>
                  </ul>
                </li>
                <li>
                  <strong>Calculate Benefits:</strong> Figure out the benefits
                  of each requirement, including:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Potential new customers.</li>
                    <li>Better experience for all users.</li>
                    <li>Competitive advantages.</li>
                    <li>Lower legal risk.</li>
                    <li>Better company reputation.</li>
                  </ul>
                </li>
                <li>
                  <strong>Find Net Burden:</strong> Compare costs against
                  benefits and your company's resources.
                </li>
                <li>
                  <strong>Look for Alternatives:</strong> For requirements that
                  cost too much, try to find cheaper approaches.
                </li>
                <li>
                  <strong>Document Everything:</strong> Keep detailed records of
                  your process, findings, and reasons.
                </li>
                <li>
                  <strong>Plan Future Checks:</strong> Set a schedule to review
                  your assessment regularly.
                </li>
              </ol>
              <p>
                This step-by-step approach helps ensure a thorough assessment
                that meets legal requirements while maximizing accessibility
                within your budget.
              </p>
            </div>
          </section>

          <section aria-labelledby="limitations">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="limitations"
              tabIndex={-1}
            >
              Limitations of the Disproportionate Burden Exemption.
            </h2>
            <div className="space-y-4">
              <p>
                While businesses can claim that accessibility costs too much,
                there are important limits:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Not Automatic:</strong> The exemption is not given
                  automatically. Businesses must prove their case with
                  documentation.
                </li>
                <li>
                  <strong>Will Be Checked:</strong> Authorities can ask for and
                  review the assessment documentation.
                </li>
                <li>
                  <strong>Not Permanent:</strong> The decision is temporary and
                  must be checked again periodically.
                </li>
                <li>
                  <strong>Not for EU-Funded Projects:</strong> Products or
                  services funded by EU programs must be accessible regardless
                  of cost.
                </li>
                <li>
                  <strong>Can't Skip Essential Features:</strong> Businesses
                  cannot use cost as a reason to avoid accessibility features
                  that are basic to the product's function.
                </li>
                <li>
                  <strong>Public Scrutiny:</strong> Businesses using this
                  exemption should be prepared for questions from the public and
                  market pressure.
                </li>
              </ul>
              <p>
                These limits ensure that the cost exemption is used properly and
                doesn't undermine the main goals of the EAA.
              </p>
            </div>
          </section>

          <section aria-labelledby="relationship-other-annexes">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="relationship-other-annexes"
              tabIndex={-1}
            >
              Relationship with Other Annexes.
            </h2>
            <div className="space-y-4">
              <p>Annex IV works together with other parts of the EAA:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Annex I (Accessibility Requirements):</strong> The
                  cost assessment evaluates if implementing these specific
                  accessibility requirements is affordable.
                </li>
                <li>
                  <strong>Annex II (Examples of Implementation):</strong> The
                  examples in Annex II help businesses understand potential
                  approaches and costs when doing their assessment.
                </li>
                <li>
                  <strong>Annex V (Conformity Assessment for Products):</strong>{' '}
                  Products with a cost exemption still need assessment for any
                  accessibility requirements they are implementing.
                </li>
                <li>
                  <strong>Annex VI (Assessment Criteria):</strong> Works
                  directly with Annex IV, providing more detailed criteria for
                  assessing costs.
                </li>
              </ul>
              <p>
                Understanding these connections helps businesses do thorough
                assessments that consider all relevant parts of the EAA.
              </p>

              <EAARelationshipDiagram />
            </div>
          </section>

          <section aria-labelledby="references">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="references"
              tabIndex={-1}
            >
              References.
            </h2>
            <div className="space-y-4">
              <p>
                The criteria for assessing disproportionate burden on this page
                come from Annex VI of the European Accessibility Act, referenced
                by Article 14.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Directive (EU) 2019/882 - Annex VI:</strong> Criteria
                  for Assessment of Disproportionate Burden. This section lists
                  factors to consider when deciding if accessibility
                  requirements cost too much.
                </li>
                <li>
                  <strong>Directive (EU) 2019/882 - Article 14:</strong>{' '}
                  Fundamental Alteration and Disproportionate Burden. This
                  article allows businesses to claim exemption if making
                  products accessible would cost too much or fundamentally
                  change the product.
                </li>
              </ul>
              <p>
                For the full legal text and specific criteria, please see the
                official{' '}
                <a
                  href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32019L0882"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                  aria-labelledby="official-directive-link-4-4"
                >
                  <span id="official-directive-link-4-4" className="sr-only">
                    Directive (EU) 2019/882 (opens in new window)
                  </span>
                  Directive (EU) 2019/882
                  <ExternalLink
                    aria-hidden="true"
                    className="inline-block w-4 h-4 ml-1"
                  />
                </a>
                .
              </p>
            </div>
          </section>

          <footer>
            <nav
              className="flex justify-end items-center mt-10 pt-4 border-t"
              aria-labelledby="footer-nav-heading"
            >
              <h2 id="footer-nav-heading" className="sr-only">
                Chapter navigation.
              </h2>
              <Button asChild id="next-chapter-button">
                <Link
                  href={ANNEXES_LINKS.CONFORMITY_ASSESSMENT.fullPath}
                  className="no-underline"
                  aria-labelledby="next-chapter-label"
                >
                  <span id="next-chapter-label">
                    Annex V: Conformity Assessment for Products.
                  </span>
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
