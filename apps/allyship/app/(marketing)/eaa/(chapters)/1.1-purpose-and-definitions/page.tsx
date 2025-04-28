import React from 'react'
import { Metadata } from 'next'
import { ChapterNavigation } from '../../components/ChapterNavigation'

export const metadata: Metadata = {
  title: 'Purpose and Definitions - European Accessibility Act',
  description:
    'Understanding the purpose of the European Accessibility Act (EAA) and key definitions including persons with disabilities and functional limitations.',
}

export default function PurposeAndDefinitionsPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 className="text-4xl font-bold mb-[23px]">
            Purpose and Definitions
          </h1>

          <nav aria-labelledby="page-sections-heading">
            <h2 id="page-sections-heading" className="sr-only">
              Page sections
            </h2>
            <ul className="space-y-1 text-lg">
              <li>
                <a className="underline" href="#purpose" id="purpose-link">
                  Purpose.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#disability-definition"
                  id="disability-link"
                >
                  Persons with Disabilities
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#functional-limitations"
                  id="functional-link"
                >
                  Functional Limitations
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#internal-market-issues"
                  id="internal-market-link"
                >
                  Internal Market Issues
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#consumer-issues"
                  id="consumer-issues-link"
                >
                  Consumer Issues
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#harmonization"
                  id="harmonization-link"
                >
                  Harmonization Benefits
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <div className="lg:col-span-5 prose prose-lg dark:prose-invert pt-2 pb-4">
        <div id="eaa-content" className="space-y-8">
          <section aria-labelledby="purpose">
            <h2
              className="text-2xl font-semibold mb-4 mt-0 scroll-mt-6"
              id="purpose"
              tabIndex={-1}
            >
              <span className="sr-only">Section:</span>
              Purpose.
            </h2>
            <div className="space-y-4">
              <p>
                This law makes the EU market work better. It creates the same
                rules for accessible products and services in all EU countries.
                These rules help remove barriers that stop accessible products
                and services from moving between countries.
              </p>
              <p>
                With these rules, more accessible products and services will be
                available for everyone. People will also have better access to
                important information.
              </p>
            </div>
          </section>

          <section aria-labelledby="disability-definition">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="disability-definition"
              tabIndex={-1}
            >
              <span className="sr-only">Section:</span>
              Persons with Disabilities.
            </h2>
            <div className="space-y-4">
              <p>
                This law follows the United Nations agreement on rights for
                people with disabilities. The EU joined this agreement in 2011.
                All EU countries have agreed to follow it.
              </p>
              <p>
                The UN agreement states that people with disabilities include
                those with long-term physical, mental, intellectual, or sensory
                challenges. These challenges, along with various barriers, can
                make it hard for them to fully take part in society.
              </p>
              <p>
                This law helps everyone participate equally. It makes regular
                products and services more accessible. These products and
                services are designed to meet the needs of people with
                disabilities.
              </p>
            </div>
          </section>

          <section aria-labelledby="functional-limitations">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="functional-limitations"
              tabIndex={-1}
            >
              <span className="sr-only">Section:</span>
              Persons with Functional Limitations.
            </h2>
            <div className="space-y-4">
              <p>
                Other people will also benefit from this law. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Older people.</li>
                <li>Pregnant women.</li>
                <li>People traveling with luggage.</li>
              </ul>
              <p>
                "People with functional limitations" means anyone who has
                trouble using or accessing things. These limitations can be due
                to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Physical issues.</li>
                <li>Mental issues.</li>
                <li>Intellectual issues.</li>
                <li>Sensory issues.</li>
                <li>Age-related problems.</li>
                <li>Other physical conditions.</li>
              </ul>
              <p>
                These limitations can be permanent or temporary. When these
                people face barriers, they have a harder time using products and
                services. Products and services need to be designed for their
                needs.
              </p>
            </div>
          </section>

          <section aria-labelledby="internal-market-issues">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="internal-market-issues"
              tabIndex={-1}
            >
              <span className="sr-only">Section:</span>
              Internal Market Issues.
            </h2>
            <div className="space-y-4">
              <p>
                Different EU countries have different laws about accessible
                products and services. These differences create problems:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>They block selling products between countries.</li>
                <li>They make fair competition harder.</li>
              </ul>
              <p>
                After the UN agreement took effect, these differences became
                more obvious. These barriers are especially hard for small and
                medium-sized businesses. They cannot easily follow all the
                different rules across countries.
              </p>
              <p>
                Because each country has different rules, small businesses avoid
                selling in other countries. Each country has its own
                requirements. The rules differ in what they cover and how
                detailed they are. Companies have to spend extra money to create
                accessible products for each country.
              </p>
            </div>
          </section>

          <section aria-labelledby="consumer-issues">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="consumer-issues"
              tabIndex={-1}
            >
              <span className="sr-only">Section:</span>
              Consumer Issues.
            </h2>
            <div className="space-y-4">
              <p>
                People who need accessible products, services, and assistive
                technology face high prices. This happens because:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Not enough companies make these products.</li>
                <li>There is not enough competition to lower prices.</li>
                <li>
                  Different rules in each country mean good ideas about new
                  technology are not shared well.
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="harmonization">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="harmonization"
              tabIndex={-1}
            >
              <span className="sr-only">Section:</span>
              Harmonization Benefits.
            </h2>
            <div className="space-y-4">
              <p>
                Creating the same rules across the EU will help the market work
                better. These rules will:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Unite the market for accessible products and services.</li>
                <li>Lower costs through larger production.</li>
                <li>Make it easier to sell across borders.</li>
                <li>
                  Help businesses focus on creating new ideas instead of
                  managing different rules.
                </li>
              </ul>
              <p>
                We have already seen benefits from making accessibility rules
                the same across the EU. This has worked well for elevator
                regulations and transportation rules.
              </p>
            </div>
          </section>

          <section aria-labelledby="references" className="mt-12 pt-6 border-t">
            <h2
              id="references"
              className="text-xl font-semibold mb-4 scroll-mt-6"
              tabIndex={-1}
            >
              <span className="sr-only">Section:</span>
              Source References.
            </h2>
            <p className="text-sm text-muted-foreground">
              This page primarily references the following sections of Directive
              (EU) 2019/882:
            </p>
            <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1 mt-2">
              <li>Article 1 (Subject matter)</li>
              <li>
                Article 3, Point 1 (Definition: persons with disabilities)
              </li>
              <li>Recital 1 (Purpose and Internal Market)</li>
              <li>Recital 3 (Definition Alignment with UN CRPD)</li>
              <li>Recital 4 (Persons with Functional Limitations)</li>
              <li>Recital 5, 6 (Internal Market Barriers)</li>
              <li>Recital 7 (Consumer Issues)</li>
              <li>Recital 8, 9 (Benefits of Harmonization)</li>
            </ul>
          </section>

          <footer>
            <ChapterNavigation currentPageId="1.1-purpose-and-definitions" />
          </footer>
        </div>
      </div>
    </section>
  )
}
