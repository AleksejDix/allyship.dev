import React from 'react'
import { Metadata } from 'next'
import { ChapterNavigation } from '../../components/ChapterNavigation'

export const metadata: Metadata = {
  title: 'Introduction | European Accessibility Act Guide',
  description:
    'An overview of what is covered in this European Accessibility Act guide, its scope, and its limitations.',
}

export default function IntroductionPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 className="text-4xl font-bold mb-[23px]">Introduction.</h1>

          <nav aria-labelledby="page-sections-heading">
            <h2 id="page-sections-heading" className="sr-only">
              Page sections.
            </h2>
            <ul className="space-y-1 text-lg">
              <li>
                <a className="underline" href="#about-eaa" id="about-eaa-link">
                  About the EAA.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#what-we-cover"
                  id="what-we-cover-link"
                >
                  What This Guide Covers.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#what-we-dont-cover"
                  id="what-we-dont-cover-link"
                >
                  What This Guide Doesn't Cover.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#how-to-use"
                  id="how-to-use-link"
                >
                  How to Use This Guide.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#who-should-read"
                  id="who-should-read-link"
                >
                  Who Should Read This Guide.
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
          <section aria-labelledby="about-eaa">
            <h2
              className="text-2xl font-semibold mb-4 mt-0 scroll-mt-6"
              id="about-eaa"
              tabIndex={-1}
            >
              About the EAA.
            </h2>
            <div className="space-y-4">
              <p>
                The European Accessibility Act (EAA) is an important law that
                makes products and services accessible in the European market.
                It removes barriers created by different rules in EU countries
                and improves access for people with disabilities.
              </p>
              <p>
                The official name is Directive (EU) 2019/882 of the European
                Parliament and Council. It creates a system that ensures
                accessible products and services across the EU market. This law
                makes a big change in how accessibility works in the European
                Union.
              </p>
              <p>
                The EAA is not just about following rules. It's a chance to
                create products and services that work better for everyone,
                especially the 87 million people with disabilities in the EU.
              </p>
            </div>
          </section>

          <section aria-labelledby="what-we-cover">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="what-we-cover"
              tabIndex={-1}
            >
              What This Guide Covers.
            </h2>
            <div className="space-y-4">
              <p>
                This guide gives a complete and practical explanation of the
                European Accessibility Act. We cover:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Main requirements and scope</strong> of the EAA,
                  including which products and services must follow the rules.
                </li>
                <li>
                  <strong>Key definitions and concepts</strong> that are
                  important to understand the law.
                </li>
                <li>
                  <strong>Specific duties</strong> for different business roles
                  (manufacturers, importers, distributors, service providers).
                </li>
                <li>
                  <strong>How to check compliance</strong> and how to document
                  that you follow the rules.
                </li>
                <li>
                  <strong>Exceptions</strong>, including when changes would be
                  too costly or change the product too much.
                </li>
                <li>
                  <strong>Timeline for following the rules</strong> and key
                  dates for compliance.
                </li>
                <li>
                  <strong>Real examples</strong> to show how these requirements
                  work in actual situations.
                </li>
                <li>
                  <strong>How the EAA connects to other laws</strong> such as
                  the Web Accessibility Directive.
                </li>
              </ul>
              <p>
                Each section uses plain language and focuses on practical use
                rather than legal details.
              </p>
            </div>
          </section>

          <section aria-labelledby="what-we-dont-cover">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="what-we-dont-cover"
              tabIndex={-1}
            >
              What This Guide Doesn't Cover.
            </h2>
            <div className="space-y-4">
              <p>While this guide covers a lot, it does have some limits:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Legal advice</strong> — We try to be accurate, but
                  this guide is not legal advice and should not replace talking
                  with qualified legal experts.
                </li>
                <li>
                  <strong>Country-specific details</strong> — We focus on the
                  EU-wide law rather than how individual countries have put it
                  into their national laws.
                </li>
                <li>
                  <strong>Detailed technical standards</strong> — We mention
                  relevant standards, but don't provide full technical details.
                </li>
                <li>
                  <strong>Other accessibility laws</strong> — This guide focuses
                  on the EAA rather than other accessibility rules (though we
                  note important connections).
                </li>
                <li>
                  <strong>How to make technical solutions</strong> — We explain
                  what needs to be accessible but don't give detailed guidance
                  on how to build technical solutions.
                </li>
              </ul>
              <p>
                For these areas, we suggest looking at specialized resources,
                technical documents, or talking to professional advisors.
              </p>
            </div>
          </section>

          <section aria-labelledby="how-to-use">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="how-to-use"
              tabIndex={-1}
            >
              How to Use This Guide.
            </h2>
            <div className="space-y-4">
              <p>
                This guide is flexible. You can read it from start to finish or
                look at specific sections as needed:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Introduction and Purpose</strong> — Start here to
                  understand why the EAA matters.
                </li>
                <li>
                  <strong>Scope and Requirements</strong> — These sections help
                  you figure out if and how the EAA applies to your products or
                  services.
                </li>
                <li>
                  <strong>Obligations chapters</strong> — Find the specific
                  section that matches your role in the supply chain.
                </li>
                <li>
                  <strong>Compliance sections</strong> — Learn about the
                  practical steps to show and document that you follow the
                  rules.
                </li>
                <li>
                  <strong>Examples</strong> — Look at these for specific details
                  and real-world applications.
                </li>
              </ul>
              <p>
                Use the table of contents, section links, and chapter navigation
                to quickly find the information that matters most to you.
              </p>
            </div>
          </section>

          <section aria-labelledby="who-should-read">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="who-should-read"
              tabIndex={-1}
            >
              Who Should Read This Guide.
            </h2>
            <div className="space-y-4">
              <p>
                This guide is written for many different people involved in
                making products and services accessible:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Business leaders and decision-makers</strong> who need
                  to understand what the EAA means for their organizations.
                </li>
                <li>
                  <strong>Legal and compliance teams</strong> working to make
                  sure their organizations follow the rules.
                </li>
                <li>
                  <strong>Product managers and designers</strong> who need to
                  build accessibility into their products.
                </li>
                <li>
                  <strong>Developers and engineers</strong> implementing
                  technical accessibility solutions.
                </li>
                <li>
                  <strong>UX and accessibility specialists</strong> guiding
                  organizations toward better accessibility practices.
                </li>
                <li>
                  <strong>Procurement professionals</strong> who need to check
                  if products they buy follow the rules.
                </li>
              </ul>
              <p>
                This guide is also useful for anyone who wants to learn about
                how the EU is making digital products and services more
                accessible for everyone.
              </p>
            </div>
          </section>

          <footer>
            <ChapterNavigation currentPageId="1.0-introduction" />
          </footer>
        </div>
      </div>
    </section>
  )
}
