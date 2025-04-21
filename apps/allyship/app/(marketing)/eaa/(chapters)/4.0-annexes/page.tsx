import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, List } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import {
  INTRODUCTION_LINKS,
  ANNEXES_LINKS,
  EXCEPTIONS_LINKS,
} from '../../constants/links'

export const metadata: Metadata = {
  title: 'Annexes Overview | European Accessibility Act',
  description:
    'Plain language overview of the six annexes of the European Accessibility Act (EAA) with simple explanations of requirements, examples, and assessment methods.',
}

export default function AnnexesPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 className="text-4xl font-bold mb-[23px]">
            Annexes of the European Accessibility Act.
          </h1>

          <nav aria-labelledby="page-sections-heading">
            <h2 id="page-sections-heading" className="sr-only">
              Page sections.
            </h2>
            <ul className="space-y-1 text-lg">
              <li>
                <a className="underline" href="#overview" id="overview-link">
                  Overview of the Annexes.
                </a>
              </li>
              <li>
                <a className="underline" href="#annex-i" id="annex-i-link">
                  Annex I: Accessibility Requirements.
                </a>
              </li>
              <li>
                <a className="underline" href="#annex-ii" id="annex-ii-link">
                  Annex II: Examples of Implementation.
                </a>
              </li>
              <li>
                <a className="underline" href="#annex-iii" id="annex-iii-link">
                  Annex III: Requirements for Built Environment.
                </a>
              </li>
              <li>
                <a className="underline" href="#annex-iv" id="annex-iv-link">
                  Annex IV: Disproportionate Burden.
                </a>
              </li>
              <li>
                <a className="underline" href="#annex-v" id="annex-v-link">
                  Annex V: Conformity Assessment.
                </a>
              </li>
              <li>
                <a className="underline" href="#annex-vi" id="annex-vi-link">
                  Annex VI: Criteria for Exceptions.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#importance"
                  id="importance-link"
                >
                  Importance of the Annexes.
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
              Overview of the Annexes.
            </h2>
            <div className="space-y-4">
              <p>
                The European Accessibility Act has six annexes. These annexes
                give details about the rules, examples, and ways to check
                products and services.
              </p>
              <p>
                The annexes are important parts of the EAA. They help companies,
                testing groups, and officials understand what to do.
              </p>
            </div>
          </section>

          <section aria-labelledby="annex-i">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="annex-i"
              tabIndex={-1}
            >
              Annex I: Accessibility Requirements.
            </h2>
            <div className="space-y-4">
              <p>
                This annex explains what products and services must do to be
                accessible. It lists different rules for different types of
                products and services.
              </p>
              <p>Here are the main parts of this annex.</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Rules for all products.</li>
                <li>Rules for product packaging and instructions.</li>
                <li>
                  Rules for making user interfaces and features easy to use.
                </li>
                <li>Rules for all services.</li>
                <li>
                  Special rules for online shops, banks, media, and other
                  services.
                </li>
              </ul>
              <p className="mt-2">
                <Link
                  href={ANNEXES_LINKS.ACCESSIBILITY_REQUIREMENTS.fullPath}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Annex I: Accessibility Requirements.
                </Link>
              </p>
            </div>
          </section>

          <section aria-labelledby="annex-ii">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="annex-ii"
              tabIndex={-1}
            >
              Annex II: Examples of Implementation.
            </h2>
            <div className="space-y-4">
              <p>
                This annex gives examples of how to meet the accessibility rules
                in Annex I. These examples help companies understand how to make
                their products and services accessible.
              </p>
              <p>Here are the types of examples included.</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Examples for making products accessible.</li>
                <li>Examples for making services accessible.</li>
                <li>
                  Ways to provide information that everyone can understand.
                </li>
                <li>Examples of accessible user interfaces.</li>
                <li>Examples for specific areas like banking or shopping.</li>
              </ul>
              <p className="mt-2">
                <Link
                  href={ANNEXES_LINKS.IMPLEMENTATION_EXAMPLES.fullPath}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Annex II: Implementation Examples.
                </Link>
              </p>
            </div>
          </section>

          <section aria-labelledby="annex-iii">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="annex-iii"
              tabIndex={-1}
            >
              Annex III: Requirements for Built Environment.
            </h2>
            <div className="space-y-4">
              <p>
                This annex explains how to make physical spaces accessible where
                services are provided. Countries can choose to follow these
                rules to improve accessibility.
              </p>
              <p>Here are the areas covered in this annex.</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>How to use spaces and facilities.</li>
                <li>How to make entrances to buildings accessible.</li>
                <li>How to create clear paths inside service areas.</li>
                <li>How to make signs and directions clear.</li>
                <li>How to make service facilities usable for everyone.</li>
              </ul>
              <p className="mt-2">
                <Link
                  href={ANNEXES_LINKS.BUILT_ENVIRONMENT.fullPath}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Annex III: Built Environment.
                </Link>
              </p>
            </div>
          </section>

          <section aria-labelledby="annex-iv">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="annex-iv"
              tabIndex={-1}
            >
              Annex IV: Disproportionate Burden.
            </h2>
            <div className="space-y-4">
              <p>
                This annex explains how to decide if making something accessible
                would cost too much or be too difficult. Companies can use these
                rules to ask for exceptions.
              </p>
              <p>
                Here are the factors to consider when checking for too much
                burden.
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  How much it costs compared to the company's total costs and
                  income.
                </li>
                <li>
                  How the costs compare to the benefits for people with
                  disabilities.
                </li>
                <li>
                  The size of the company, its resources, and what kind of
                  company it is.
                </li>
                <li>
                  How changes would affect the company versus how they would
                  help people with disabilities.
                </li>
                <li>How often people use the product or service.</li>
              </ul>
              <p className="mt-2">
                <Link
                  href={ANNEXES_LINKS.DISPROPORTIONATE_BURDEN.fullPath}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Annex IV: Disproportionate Burden Assessment.
                </Link>
              </p>
            </div>
          </section>

          <section aria-labelledby="annex-v">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="annex-v"
              tabIndex={-1}
            >
              Annex V: Conformity Assessment.
            </h2>
            <div className="space-y-4">
              <p>
                This annex explains how companies must check if their products
                meet the accessibility rules. It describes the steps
                manufacturers need to follow.
              </p>
              <p>Here are the main parts of the assessment process.</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>What technical documents you need to create.</li>
                <li>How to control the manufacturing process.</li>
                <li>
                  How to check if your product meets the accessibility rules.
                </li>
                <li>How to keep track of your product.</li>
                <li>How to declare that your product follows the rules.</li>
              </ul>
              <p className="mt-2">
                <Link
                  href={ANNEXES_LINKS.CONFORMITY_ASSESSMENT.fullPath}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Annex V: Conformity Assessment.
                </Link>
              </p>
            </div>
          </section>

          <section aria-labelledby="annex-vi">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="annex-vi"
              tabIndex={-1}
            >
              Annex VI: Criteria for Exceptions.
            </h2>
            <div className="space-y-4">
              <p>
                This annex gives more details about when companies can claim
                exceptions. It explains how to assess if making changes would
                fundamentally alter a product or be too much burden.
              </p>
              <p>Here are the criteria covered in this annex.</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  How to decide if a change would fundamentally alter a product.
                </li>
                <li>More ways to check if costs are too high.</li>
                <li>How to assess impact on the organization.</li>
                <li>How to evaluate claims for exceptions.</li>
                <li>What documents you need when claiming an exception.</li>
              </ul>
              <p className="mt-2">
                <Link
                  href={ANNEXES_LINKS.ASSESSMENT_CRITERIA.fullPath}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Annex VI: Criteria for Exceptions.
                </Link>
              </p>
            </div>
          </section>

          <section aria-labelledby="importance">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="importance"
              tabIndex={-1}
            >
              Importance of the Annexes.
            </h2>
            <div className="space-y-4">
              <p>
                The annexes explain how to put the general rules of the EAA into
                practice. They help the following groups.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Companies.</strong> They learn what accessibility
                  features they must add to their products and services.
                </li>
                <li>
                  <strong>Testing organizations.</strong> They learn how to
                  check products against accessibility rules.
                </li>
                <li>
                  <strong>Market authorities.</strong> They learn how to check
                  if products follow the accessibility rules.
                </li>
                <li>
                  <strong>Service providers.</strong> They learn how to make
                  their services meet accessibility standards.
                </li>
                <li>
                  <strong>People with disabilities.</strong> They learn about
                  their rights regarding accessible products and services.
                </li>
              </ul>
              <p>
                The main text of the EAA creates the legal framework. The
                annexes provide the practical details needed for implementation.
                Together, they ensure accessibility for people with disabilities
                across the European Union.
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
                  href={ANNEXES_LINKS.ACCESSIBILITY_REQUIREMENTS.fullPath}
                  className="no-underline"
                  aria-labelledby="next-chapter-label"
                >
                  <span id="next-chapter-label">
                    Annex I: Accessibility Requirements.
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
