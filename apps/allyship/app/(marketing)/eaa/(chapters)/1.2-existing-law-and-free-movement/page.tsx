import React from 'react'
import { Metadata } from 'next'
import { ChapterNavigation } from '../../components/ChapterNavigation'

export const metadata: Metadata = {
  title: 'Existing Law & Free Movement | European Accessibility Act',
  description:
    'How the European Accessibility Act works with existing EU regulations and enables free movement of accessible products and services across the single market.',
}

export default function ExistingLawAndFreeMovementPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 className="text-4xl font-bold mb-[23px]">
            Existing Law & Free Movement
          </h1>

          <nav aria-labelledby="page-sections-heading">
            <h2 id="page-sections-heading" className="sr-only">
              Page sections
            </h2>
            <ul className="space-y-1 text-lg">
              <li>
                <a
                  className="underline"
                  href="#existing-rules"
                  id="existing-rules-link"
                >
                  Existing Transport Regulations
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#additional-requirements"
                  id="additional-requirements-link"
                >
                  Additional EAA Requirements
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#free-movement-principle"
                  id="free-movement-principle-link"
                >
                  Free Movement Principle
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
              <li>
                <a
                  className="underline"
                  href="#market-barriers"
                  id="market-barriers-link"
                >
                  Removing Trade Barriers
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="lg:col-span-5 prose prose-lg dark:prose-invert pb-4 pt-2">
        <div id="eaa-content" className="space-y-8">
          {/* Part 1: Existing Law Section */}
          <section>
            <h2
              className="text-3xl font-semibold mb-6 mt-0 scroll-mt-6 border-b pb-2"
              id="existing-law-section"
              tabIndex={-1}
            >
              Existing Union Law
            </h2>

            <section aria-labelledby="existing-rules">
              <h3
                className="text-2xl font-semibold mb-4 mt-0 scroll-mt-6"
                id="existing-rules"
                tabIndex={-1}
              >
                Existing Transport Regulations.
              </h3>
              <div className="space-y-4">
                <p>
                  Some services already follow other EU laws about providing
                  accessible information. If they follow these laws, they also
                  meet the requirements of this Directive:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Regulation (EC) No 261/2004 - Air passenger rights when
                    denied boarding, canceled, or delayed flights.
                  </li>
                  <li>
                    Regulation (EC) No 1107/2006 - Rights of disabled persons
                    when traveling by air.
                  </li>
                  <li>
                    Regulation (EC) No 1371/2007 - Rail passenger rights and
                    obligations.
                  </li>
                  <li>
                    Regulation (EU) No 1177/2010 - Rights of passengers
                    traveling by sea and inland waterway.
                  </li>
                  <li>
                    Regulation (EU) No 181/2011 - Rights of bus and coach
                    passengers.
                  </li>
                  <li>
                    Acts based on Directive 2008/57/EC - Railway system
                    interoperability.
                  </li>
                </ul>
                <p>
                  If this Directive has extra requirements not in those laws,
                  the extra requirements still apply.
                </p>
              </div>
            </section>

            <section aria-labelledby="additional-requirements">
              <h3
                className="text-2xl font-semibold mb-4 scroll-mt-6"
                id="additional-requirements"
                tabIndex={-1}
              >
                Additional EAA Requirements.
              </h3>
              <div className="space-y-4">
                <p>
                  The European Accessibility Act recognizes existing transport
                  regulations. It adds new requirements to make transportation
                  more accessible, such as:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Websites and mobile apps must meet accessibility standards.
                  </li>
                  <li>
                    Self-service terminals need to be accessible to people with
                    disabilities.
                  </li>
                  <li>E-ticketing systems should be usable by everyone.</li>
                  <li>
                    Real-time travel information must be provided in accessible
                    formats.
                  </li>
                  <li>
                    Digital transport documents should be accessible to all
                    users.
                  </li>
                </ul>
                <p>
                  These extra requirements work with existing rules to create
                  better accessibility in passenger transport services.
                </p>
              </div>
            </section>
          </section>

          {/* Part 2: Free Movement Section */}
          <section>
            <h2
              className="text-3xl font-semibold mb-6 mt-10 scroll-mt-6 border-b pb-2"
              id="free-movement-section"
              tabIndex={-1}
            >
              Free Movement Across the EU
            </h2>

            <section aria-labelledby="free-movement-principle">
              <h3
                className="text-2xl font-semibold mb-4 mt-0 scroll-mt-6"
                id="free-movement-principle"
                tabIndex={-1}
              >
                Free Movement Principle.
              </h3>
              <div className="space-y-4">
                <p>
                  Article 6 of the European Accessibility Act states a simple
                  rule:
                </p>
                <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">
                  "EU countries cannot block products or services that meet this
                  law's accessibility requirements from being sold in their
                  country."
                </blockquote>
                <p>
                  When products and services follow the accessibility rules in
                  this law, they can be sold in any EU country without extra
                  barriers.
                </p>
              </div>
            </section>

            <section aria-labelledby="harmonization">
              <h3
                className="text-2xl font-semibold mb-4 scroll-mt-6"
                id="harmonization"
                tabIndex={-1}
              >
                Harmonization Benefits.
              </h3>
              <div className="space-y-4">
                <p>
                  Free movement is key to the EU's single market. Having the
                  same accessibility rules for all EU countries helps with:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Selling products across all EU borders.</li>
                  <li>Making rules clearer for businesses.</li>
                  <li>Lowering costs to create products.</li>
                  <li>Creating better business competition.</li>
                  <li>Giving people more choices at better prices.</li>
                </ul>
              </div>
            </section>

            <section aria-labelledby="market-barriers">
              <h3
                className="text-2xl font-semibold mb-4 scroll-mt-6"
                id="market-barriers"
                tabIndex={-1}
              >
                Removing Trade Barriers.
              </h3>
              <div className="space-y-4">
                <p>
                  Before this law, each country had its own accessibility rules.
                  This created these problems for businesses:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>They had to follow different rules in each country.</li>
                  <li>They needed to change products for each market.</li>
                  <li>They paid more for multiple checks.</li>
                  <li>They dealt with many complex laws.</li>
                </ul>
                <p>
                  With one set of rules, the European Accessibility Act fixes
                  these problems. Now businesses can:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Design one product for all EU countries.</li>
                  <li>Offer their services in all EU countries.</li>
                  <li>Save money on development costs.</li>
                  <li>
                    Focus on creating new ideas instead of studying rules.
                  </li>
                </ul>
              </div>
            </section>
          </section>

          <section aria-labelledby="references" className="mt-12 pt-6 border-t">
            <h2
              id="references"
              className="text-xl font-semibold mb-4 scroll-mt-6"
              tabIndex={-1}
            >
              Source References
            </h2>
            <p className="text-sm text-muted-foreground">
              This page refers to these parts of Directive (EU) 2019/882:
            </p>
            <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1 mt-2">
              <li>
                Article 5 (Existing Union law in the field of passenger
                transport)
              </li>
              <li>Article 6 (Free movement)</li>
              <li>Recitals 1, 5, 6, 8 (Background on market benefits)</li>
              <li>Recital 36 (Context on existing transport regulations)</li>
            </ul>
          </section>

          <footer>
            <ChapterNavigation currentPageId="1.2-existing-law-and-free-movement" />
          </footer>
        </div>
      </div>
    </section>
  )
}
