import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, List } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { ANNEXES_LINKS } from '../../constants/links'

export const metadata: Metadata = {
  title:
    'Annex VI: Criteria for Disproportionate Burden | European Accessibility Act',
  description:
    'Detailed criteria for assessing disproportionate burden claims under the European Accessibility Act, including evaluation factors, quantitative analysis, and documentation requirements.',
}

export default function CriteriaDisproportionateBurdenPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 className="text-4xl font-bold mb-[23px]">
            Annex VI: Criteria for Disproportionate Burden.
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
                  href="#evaluation-criteria"
                  id="evaluation-criteria-link"
                >
                  Evaluation Criteria.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#net-costs-assessment"
                  id="net-costs-assessment-link"
                >
                  Assessing Net Costs.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#frequency-and-duration"
                  id="frequency-and-duration-link"
                >
                  Frequency and Duration.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#ratios-and-thresholds"
                  id="ratios-and-thresholds-link"
                >
                  Financial Ratios.
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
                  href="#microenterprises"
                  id="microenterprises-link"
                >
                  Provisions for Microenterprises.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#practical-examples"
                  id="practical-examples-link"
                >
                  Practical Examples.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#potential-challenges"
                  id="potential-challenges-link"
                >
                  Challenges.
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
              <li>
                <a
                  className="underline"
                  href="#conclusion"
                  id="conclusion-link"
                >
                  Conclusion.
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="lg:col-span-5 prose prose-lg dark:prose-invert pb-4 pt-2">
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
                Annex VI helps businesses decide if making products accessible
                would cost too much money. This part of the European
                Accessibility Act (EAA) gives clear rules for checking when
                costs are too high. These rules help make sure everyone uses the
                same fair method across the EU.
              </p>
              <p>
                You should use these rules together with the assessment process
                in Annex IV. Annex IV explains how to do the assessment, while
                Annex VI tells you what specific things to look at during your
                check.
              </p>
            </div>
          </section>

          <section aria-labelledby="evaluation-criteria">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="evaluation-criteria"
              tabIndex={-1}
            >
              Evaluation Criteria.
            </h2>
            <div className="space-y-4">
              <p>
                The EAA says you must look at these things when checking if
                accessibility costs too much:
              </p>

              <ol className="pl-6 space-y-4">
                <li>
                  <strong>
                    The ratio of net costs compared to overall costs:
                  </strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Compare what it costs to make things accessible versus
                      your total business costs.
                    </li>
                    <li>
                      This shows if the cost is reasonable for your business
                      size and resources.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>
                    The costs and benefits compared to how much people with
                    disabilities would benefit:
                  </strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Consider how often and how long people use your product or
                      service.
                    </li>
                    <li>
                      This balances what you spend against how much it helps
                      people with disabilities.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>
                    The ratio of costs compared to your business income:
                  </strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      This shows how much the costs would impact your business
                      financially.
                    </li>
                    <li>
                      It helps determine if the costs would harm your business
                      operations.
                    </li>
                  </ul>
                </li>
              </ol>
            </div>
          </section>

          <section aria-labelledby="net-costs-assessment">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="net-costs-assessment"
              tabIndex={-1}
            >
              Assessing Net Costs of Compliance.
            </h2>
            <div className="space-y-4">
              <p>
                When figuring out the net costs, look at both what you'll spend
                and what you might gain:
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-2">Direct Costs.</h3>
              <p>Direct costs for making things accessible include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Design and Development:</strong> Costs to redesign
                  products or services to add accessibility features.
                </li>
                <li>
                  <strong>Implementation:</strong> Production or programming
                  costs for accessibility features.
                </li>
                <li>
                  <strong>Testing:</strong> Costs for checking accessibility
                  with users who have disabilities.
                </li>
                <li>
                  <strong>Training:</strong> Costs to train staff on new
                  accessibility features.
                </li>
                <li>
                  <strong>Documentation:</strong> Costs to update user guides
                  and technical materials.
                </li>
                <li>
                  <strong>Maintenance:</strong> Ongoing costs to keep
                  accessibility features working properly.
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Potential Benefits.
              </h3>
              <p>Benefits that might offset these costs include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Market Expansion:</strong> More customers who can now
                  use your product or service.
                </li>
                <li>
                  <strong>Enhanced Reputation:</strong> Better brand image from
                  being inclusive.
                </li>
                <li>
                  <strong>Reduced Legal Risk:</strong> Less chance of complaints
                  or lawsuits.
                </li>
                <li>
                  <strong>Innovation Benefits:</strong> New ideas that might
                  come from designing for accessibility.
                </li>
                <li>
                  <strong>Public Procurement Opportunities:</strong> Better
                  chances to win government contracts.
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Calculating Net Costs.
              </h3>
              <p>To find the net costs:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  Add up all the direct costs of making things accessible.
                </li>
                <li>Subtract the value of benefits you expect to receive.</li>
                <li>Compare this net cost to your business size and income.</li>
              </ol>
            </div>
          </section>

          <section aria-labelledby="frequency-and-duration">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="frequency-and-duration"
              tabIndex={-1}
            >
              Frequency and Duration of Use.
            </h2>
            <div className="space-y-4">
              <p>
                How often and how long people use your product matters. Products
                used every day by many people with disabilities deserve more
                investment in accessibility.
              </p>

              <p>Here are important factors to consider:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Daily vs. Occasional Use:</strong> Products used daily
                  (like phones or websites) have a higher impact than products
                  used rarely.
                </li>
                <li>
                  <strong>Duration of Use Sessions:</strong> Products used for
                  long periods need better accessibility than those used
                  briefly.
                </li>
                <li>
                  <strong>Number of Users:</strong> Products used by many people
                  with disabilities have a bigger impact.
                </li>
                <li>
                  <strong>Essential Nature:</strong> Products needed for daily
                  living or accessing basic services are more important.
                </li>
              </ul>

              <p>
                The more people who benefit, and the more often they benefit,
                the harder it is to claim the cost is too high.
              </p>
            </div>
          </section>

          <section aria-labelledby="ratios-and-thresholds">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="ratios-and-thresholds"
              tabIndex={-1}
            >
              Financial Ratios and Impact Assessment.
            </h2>
            <div className="space-y-4">
              <p>
                To decide if costs are too high, you need to look at how they
                compare to your business size and income.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Key Financial Ratios.
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Net Cost to Annual Turnover Ratio:</strong> This shows
                  what percentage of your yearly income would go to
                  accessibility costs.
                </li>
                <li>
                  <strong>Net Cost to Operating Profit Ratio:</strong> This
                  shows how much the costs would impact your profits.
                </li>
                <li>
                  <strong>Implementation Cost to Available Resources:</strong>{' '}
                  This shows if you have enough money to make the changes.
                </li>
              </ul>

              <p>
                While not required by the EAA, this framework may help your
                evaluation:
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2">
                        Impact Category.
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Cost/Turnover Ratio Considerations.
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        High Impact.
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Higher ratios may be expected before claiming costs are
                        too high.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        Medium Impact.
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Moderate ratios may need case-by-case evaluation.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        Low Impact.
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Lower ratios might support claims that costs are too
                        high.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                The EAA does not set specific percentage thresholds. Each case
                needs individual assessment based on the business size, type of
                product, and user impact.
              </p>
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
                You must keep good records if you claim making products
                accessible costs too much. Your records should include:
              </p>

              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Clear Cost Breakdown:</strong> Detailed list of all
                  costs for each accessibility requirement.
                </li>
                <li>
                  <strong>User Impact Analysis:</strong> Assessment of how
                  different disabilities would be affected by your decision.
                </li>
                <li>
                  <strong>Financial Analysis:</strong> Comparison of costs to
                  your business size and resources.
                </li>
                <li>
                  <strong>Alternative Options:</strong> What other solutions you
                  considered and why they didn't work.
                </li>
                <li>
                  <strong>Statement of Maximum Efforts:</strong> What
                  accessibility features you will still provide despite the
                  burden.
                </li>
                <li>
                  <strong>Periodic Review Plan:</strong> When and how you will
                  check if the situation has changed.
                </li>
              </ul>

              <p>
                Authorities may ask to see these records to check if your claim
                is valid. Keep these documents for at least 5 years.
              </p>
            </div>
          </section>

          <section aria-labelledby="microenterprises">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="microenterprises"
              tabIndex={-1}
            >
              Provisions for Microenterprises.
            </h2>
            <div className="space-y-4">
              <p>
                The EAA has special rules for very small businesses
                (microenterprises):
              </p>

              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Definition:</strong> A microenterprise has fewer than
                  10 employees and makes less than €2 million per year.
                </li>
                <li>
                  <strong>Services Exemption:</strong> Microenterprises that
                  provide services don't need to meet accessibility
                  requirements.
                </li>
                <li>
                  <strong>Products Not Exempt:</strong> Microenterprises that
                  make, import, or sell products still need to follow the rules.
                </li>
                <li>
                  <strong>Documentation:</strong> If asked, you must prove you
                  qualify as a microenterprise.
                </li>
              </ul>

              <p>
                Even with this exemption, it's good business practice for
                microenterprises to make their services as accessible as
                possible.
              </p>
            </div>
          </section>

          <section aria-labelledby="practical-examples">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="practical-examples"
              tabIndex={-1}
            >
              Practical Examples.
            </h2>
            <div className="space-y-4">
              <p>
                These examples show how to apply the assessment criteria in real
                situations:
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Example 1: E-Commerce Website.
              </h3>
              <div className="bg-gray-100 p-4 rounded mb-4">
                <p className="font-medium">Scenario:</p>
                <p>
                  A medium-sized retailer with €5 million yearly sales needs to
                  make its website accessible. The costs include €75,000 for
                  redesign and €15,000 yearly for maintenance.
                </p>
                <p className="font-medium mt-2">Assessment:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Net costs:</strong> €75,000 initial + €15,000 annual
                    = €90,000 for first year.
                  </li>
                  <li>
                    <strong>Potential offsetting benefits:</strong> Estimated
                    increased sales of €30,000 annually from new customers.
                  </li>
                  <li>
                    <strong>Net first-year cost:</strong> €60,000.
                  </li>
                  <li>
                    <strong>Ratio to turnover:</strong> 1.2% of annual turnover.
                  </li>
                  <li>
                    <strong>Impact category:</strong> High (e-commerce is used
                    daily by many persons with disabilities).
                  </li>
                  <li>
                    <strong>Conclusion:</strong> Given the high impact and
                    relatively low ratio to turnover, this would likely not
                    qualify as a disproportionate burden.
                  </li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Example 2: Specialized Medical Device.
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
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Net costs:</strong> €300,000 initial investment.
                  </li>
                  <li>
                    <strong>Potential offsetting benefits:</strong> Estimated
                    increased sales of €20,000 annually.
                  </li>
                  <li>
                    <strong>Net first-year cost:</strong> €280,000.
                  </li>
                  <li>
                    <strong>Ratio to turnover:</strong> 18.7% of annual
                    turnover.
                  </li>
                  <li>
                    <strong>Impact category:</strong> Medium (specialized device
                    used by a moderate number of persons with disabilities).
                  </li>
                  <li>
                    <strong>Conclusion:</strong> With a significant ratio to
                    turnover and medium impact, this might qualify as a
                    disproportionate burden. The manufacturer should document
                    the assessment thoroughly and consider alternative measures
                    to maximize accessibility within their constraints.
                  </li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Example 3: Mobile Banking Application.
              </h3>
              <div className="bg-gray-100 p-4 rounded">
                <p className="font-medium">Scenario:</p>
                <p>
                  A medium-sized bank with annual turnover of €50 million needs
                  to make its mobile banking application accessible. The
                  estimated cost is €200,000 for redesign and development, with
                  annual maintenance of €30,000.
                </p>
                <p className="font-medium mt-2">Assessment:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Net costs:</strong> €200,000 initial + €30,000
                    annual = €230,000 for first year.
                  </li>
                  <li>
                    <strong>Potential offsetting benefits:</strong> Estimated
                    increased customer retention and acquisition worth €100,000
                    annually.
                  </li>
                  <li>
                    <strong>Net first-year cost:</strong> €130,000.
                  </li>
                  <li>
                    <strong>Ratio to turnover:</strong> 0.26% of annual
                    turnover.
                  </li>
                  <li>
                    <strong>Impact category:</strong> High (banking services are
                    essential and used regularly by many persons with
                    disabilities).
                  </li>
                  <li>
                    <strong>Conclusion:</strong> Given the low ratio to turnover
                    and high impact, this would not qualify as a
                    disproportionate burden.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section aria-labelledby="potential-challenges">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="potential-challenges"
              tabIndex={-1}
            >
              Potential Challenges in Assessment.
            </h2>
            <div className="space-y-4">
              <p>
                When doing these assessments, you might face these challenges:
              </p>

              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Quantifying User Benefits:</strong> It can be hard to
                  put a number on how much people with disabilities will
                  benefit.
                </li>
                <li>
                  <strong>Estimating Market Impact:</strong> It's difficult to
                  predict exactly how many new customers you might gain.
                </li>
                <li>
                  <strong>Rapid Technological Change:</strong> Technology costs
                  and solutions change quickly, making long-term assessment
                  harder.
                </li>
                <li>
                  <strong>Varying Implementation Options:</strong> There might
                  be multiple ways to meet requirements, each with different
                  costs.
                </li>
                <li>
                  <strong>Organizational Knowledge Gaps:</strong> Your staff
                  might not have enough expertise in accessibility to make
                  accurate cost estimates.
                </li>
              </ul>

              <p>To address these challenges:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Consult with accessibility experts for better cost estimates.
                </li>
                <li>
                  Talk to people with disabilities to understand the real impact
                  of your products.
                </li>
                <li>
                  Look at industry data and case studies to improve your
                  estimates.
                </li>
                <li>
                  Document your assumptions clearly so they can be reviewed.
                </li>
                <li>
                  Consider phased implementation if full compliance is too
                  costly at once.
                </li>
              </ul>
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
              <p>Annex VI works together with other parts of the EAA:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Annex I (Accessibility Requirements):</strong> Defines
                  the accessibility requirements that you need to check if you
                  can afford to implement.
                </li>
                <li>
                  <strong>
                    Annex IV (Disproportionate Burden Assessment):
                  </strong>{' '}
                  Provides the method for doing the assessment, while Annex VI
                  gives you specific criteria to apply.
                </li>
                <li>
                  <strong>Annex V (Conformity Assessment for Products):</strong>{' '}
                  Relates to how products prove compliance with accessibility
                  requirements, which may change based on disproportionate
                  burden claims.
                </li>
              </ul>
              <p>
                Understanding these connections is important for businesses to
                correctly assess and document when accessibility costs too much.
              </p>
            </div>
          </section>

          <section aria-labelledby="conclusion">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="conclusion"
              tabIndex={-1}
            >
              Conclusion.
            </h2>
            <div className="space-y-4">
              <p>
                Annex VI helps you check if making your products accessible
                would cost too much. It asks you to look at the costs compared
                to your business size, and to consider how much people with
                disabilities would benefit.
              </p>
              <p>
                Remember that claiming costs are too high should be the
                exception, not the rule. Always try to make your products as
                accessible as possible within your budget. Only claim exemption
                after careful assessment with good documentation.
              </p>
              <p>
                Review your assessment regularly as technology changes, costs
                decrease, and new solutions become available. This helps ensure
                accessibility improves over time even when you've claimed some
                costs are too high.
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
                  href={ANNEXES_LINKS.OVERVIEW.fullPath}
                  className="no-underline"
                  aria-labelledby="next-chapter-label"
                >
                  <span id="next-chapter-label">Back to Annexes Overview.</span>
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
