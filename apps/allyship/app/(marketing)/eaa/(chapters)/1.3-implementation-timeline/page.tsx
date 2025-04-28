import React from 'react'
import { Metadata } from 'next'

import DefaultEaaTimeline from '../../components/EaaTimeline'
import { ChapterNavigation } from '../../components/ChapterNavigation'

export const metadata: Metadata = {
  title: 'Implementation Timeline | European Accessibility Act Guide',
  description:
    'Key dates and implementation deadlines for the European Accessibility Act (EAA) and what they mean for organizations.',
}

export default function TimelinePage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 className="text-4xl font-bold mb-[23px]">
            Implementation Timeline.
          </h1>

          <nav aria-labelledby="page-sections-heading">
            <h2 id="page-sections-heading" className="sr-only">
              Page sections.
            </h2>
            <ul className="space-y-1 text-lg">
              <li>
                <a className="underline" href="#key-dates" id="key-dates-link">
                  Key Dates.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#adoption-phase"
                  id="adoption-phase-link"
                >
                  Adoption Phase.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#implementation-phase"
                  id="implementation-phase-link"
                >
                  Implementation Phase.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#transition-periods"
                  id="transition-periods-link"
                >
                  Transition Periods.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#planning-guide"
                  id="planning-guide-link"
                >
                  Planning Guide.
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
          <section aria-labelledby="key-dates">
            <h2
              className="text-2xl font-semibold mb-4 mt-0 scroll-mt-6"
              id="key-dates"
              tabIndex={-1}
            >
              Key Dates.
            </h2>
            <div className="space-y-4">
              <p>
                The European Accessibility Act follows a step-by-step timeline
                with several important deadlines. Understanding these dates will
                help you plan how your organization will follow the rules.
              </p>

              <div className="mb-8 not-prose">
                <DefaultEaaTimeline />
              </div>

              <p>
                These deadlines are the main milestones in putting the EAA into
                practice. Each phase has specific requirements for different
                groups involved in making things accessible.
              </p>
            </div>
          </section>

          <section aria-labelledby="adoption-phase">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="adoption-phase"
              tabIndex={-1}
            >
              Adoption Phase.
            </h2>
            <div className="space-y-4">
              <p>
                <strong>April 17, 2019:</strong> The European Parliament and
                Council officially adopted the European Accessibility Act as
                Directive (EU) 2019/882. This was the start of the
                implementation process.
              </p>
              <p>
                <strong>Key activities during this phase:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Publishing the law in the Official Journal of the European
                  Union.
                </li>
                <li>Raising awareness among EU countries.</li>
                <li>Early planning to put the law into national rules.</li>
                <li>
                  Talking with interested groups at EU and national levels.
                </li>
              </ul>
              <p>
                This phase created the foundation for a unified approach to
                accessibility across the European Union.
              </p>
            </div>
          </section>

          <section aria-labelledby="implementation-phase">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="implementation-phase"
              tabIndex={-1}
            >
              Implementation Phase.
            </h2>
            <div className="space-y-4">
              <p>
                <strong>June 28, 2022:</strong> Deadline for EU Member States to
                put the EAA into their national laws. By this date, all EU
                countries had to adopt and publish the laws, rules, and
                procedures needed to follow the EAA.
              </p>
              <p>
                <strong>What this means:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Each member country created its own legal system for putting
                  the EAA in place.
                </li>
                <li>Countries set up ways to enforce the rules.</li>
                <li>
                  Specific national requirements may differ while still
                  following the main EAA rules.
                </li>
                <li>
                  Organizations should look at both the EU law and their
                  specific national versions.
                </li>
              </ul>
              <p>
                The process created a network of national laws that put the
                EAA's requirements in place while allowing for some
                country-specific adjustments.
              </p>
            </div>
          </section>

          <section aria-labelledby="transition-periods">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="transition-periods"
              tabIndex={-1}
            >
              Transition Periods.
            </h2>
            <div className="space-y-4">
              <p>
                <strong>June 28, 2025:</strong> The date when the accessibility
                requirements become fully required. From this date, all new
                products sold and services provided must follow the
                accessibility requirements of the EAA.
              </p>
              <p>
                <strong>What this means:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Products designed, made, and sold after this date must be
                  accessible.
                </li>
                <li>
                  Services provided to consumers after this date must be
                  accessible.
                </li>
                <li>
                  Authorities will start checking if products and services
                  follow the rules.
                </li>
                <li>
                  Products or services that don't follow the rules may be
                  restricted or removed from the market.
                </li>
              </ul>

              <p>
                <strong>June 28, 2030:</strong> End of the extra time period for
                service providers. Until this date, service providers can keep
                using products that were legally used before June 28, 2025.
              </p>
              <p>
                <strong>Additional details:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Service contracts signed before June 28, 2025, can continue
                  unchanged until they end or for a maximum of 5 years.
                </li>
                <li>
                  Self-service machines legally used before June 28, 2025, can
                  continue to be used until the end of their useful life, but
                  not longer than 20 years.
                </li>
              </ul>
              <p>
                These transition periods give a gradual approach to full
                compliance, giving organizations time to adapt while ensuring
                progress toward accessible products and services.
              </p>
            </div>
          </section>

          <section aria-labelledby="planning-guide">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="planning-guide"
              tabIndex={-1}
            >
              Planning Guide.
            </h2>
            <div className="space-y-4">
              <p>
                Here's a practical guide to help your organization prepare for
                each phase of EAA implementation:
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                Now Until June 2025.
              </h3>
              <p>
                <strong>Assessment and planning phase:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Make a list of all your products and services that the EAA
                  covers.
                </li>
                <li>
                  Check current accessibility levels against EAA requirements.
                </li>
                <li>
                  Find gaps where your products or services don't meet the
                  rules.
                </li>
                <li>
                  Create a step-by-step plan to fix these gaps before June 2025.
                </li>
                <li>
                  Start training staff on accessibility requirements and best
                  practices.
                </li>
                <li>
                  Begin updating design and development processes to include
                  accessibility from the start.
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                June 2025 Milestone.
              </h3>
              <p>
                <strong>Full compliance deadline:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  All new products must meet accessibility requirements when
                  placed on the market.
                </li>
                <li>
                  All services must be accessible when provided to consumers.
                </li>
                <li>
                  Products designed or made before this date but released later
                  must still follow the rules.
                </li>
                <li>
                  Have documentation ready that shows how you follow the
                  accessibility requirements.
                </li>
                <li>
                  Make sure your technical files and declarations are complete
                  and accurate.
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                June 2025 - June 2030.
              </h3>
              <p>
                <strong>Transition management:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Review service contracts signed before June 2025 and plan for
                  updates when they expire (or by June 2030 at the latest).
                </li>
                <li>
                  Start planning replacement of any non-accessible self-service
                  terminals used before June 2025.
                </li>
                <li>
                  Keep tracking and fixing accessibility issues that users
                  report.
                </li>
                <li>
                  Continue improving accessibility in all products and services.
                </li>
                <li>
                  Check that suppliers and partners also follow the EAA
                  requirements.
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">
                Beyond June 2030.
              </h3>
              <p>
                <strong>Full implementation:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  All services, including those using pre-2025 products, must be
                  fully accessible.
                </li>
                <li>
                  All service contracts must include accessibility provisions.
                </li>
                <li>
                  Self-service terminals from before June 2025 should be
                  replaced with accessible versions if they've reached the end
                  of their useful life.
                </li>
                <li>
                  Maintain ongoing compliance as accessibility standards and
                  technologies evolve.
                </li>
              </ul>

              <div className="bg-muted p-4 rounded-md mt-6">
                <p className="font-medium">
                  <strong>Pro tip:</strong> Don't wait until the deadline to
                  start planning. Organizations that begin early will:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Spread costs over a longer period.</li>
                  <li>
                    Have more time to test and refine accessibility solutions.
                  </li>
                  <li>
                    Build expertise and processes that make ongoing compliance
                    easier.
                  </li>
                  <li>
                    Gain market advantage by serving customers with disabilities
                    sooner.
                  </li>
                  <li>Reduce the risk of non-compliance penalties.</li>
                </ul>
              </div>
            </div>
          </section>

          <footer>
            <ChapterNavigation currentPageId="1.3-implementation-timeline" />
          </footer>
        </div>
      </div>
    </section>
  )
}
