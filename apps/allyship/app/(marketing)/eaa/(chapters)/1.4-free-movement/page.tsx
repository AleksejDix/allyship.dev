import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import {
  INTRODUCTION_LINKS,
  REQUIREMENTS_LINKS,
  OBLIGATIONS_LINKS,
  EXTERNAL_LINKS,
} from '../../constants/links'
import { ArrowLeft, ArrowRight, ExternalLink, List } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'

export const metadata: Metadata = {
  title: 'Free Movement | European Accessibility Act',
  description:
    'How the European Accessibility Act ensures free movement of accessible products and services across the EU single market while eliminating barriers to trade.',
}

export default function FreeMovementPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-20 text-left lg:text-right">
          <Button asChild variant="secondary">
            <Link
              className="no-underline"
              href={INTRODUCTION_LINKS.OVERVIEW.fullPath}
              aria-labelledby="toc-button-label"
              id="toc-button"
            >
              <List size={16} aria-hidden="true" />
              <span id="toc-button-label">EAA Table of Contents</span>
            </Link>
          </Button>

          <h1 className="text-4xl font-bold mb-[23px]">Free Movement</h1>

          <nav aria-labelledby="page-sections-heading">
            <h2 id="page-sections-heading" className="sr-only">
              Page sections
            </h2>
            <ul className="space-y-1 text-lg">
              <li>
                <a
                  className="underline"
                  href="#free-movement-principle"
                  id="principle-link"
                >
                  The Principle of Free Movement
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#harmonization"
                  id="harmonization-link"
                >
                  Harmonization and Single Market
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#market-barriers"
                  id="barriers-link"
                >
                  Eliminating Market Barriers
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#ce-marking"
                  id="ce-marking-link"
                >
                  CE Marking and Free Movement
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <div className="lg:col-span-5 prose prose-lg dark:prose-invert">
        <div className="space-y-8">
          <section aria-labelledby="free-movement-principle">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-20"
              id="free-movement-principle"
              tabIndex={-1}
            >
              The Principle of Free Movement
            </h2>
            <div className="space-y-4">
              <p>
                Article 6 of the European Accessibility Act establishes a key
                principle regarding the free movement of accessible products and
                services within the European Union:
              </p>
              <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">
                "Member States shall not impede, for reasons related to
                accessibility requirements, the making available on the market
                in their territory of products or the provision of services in
                their territory that comply with this Directive."
              </blockquote>
              <p>
                This provision ensures that once products and services meet the
                accessibility requirements set out in the Directive, they can
                freely circulate throughout the EU market without facing
                additional barriers related to accessibility.
              </p>
            </div>
          </section>

          <section aria-labelledby="harmonization">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-20"
              id="harmonization"
              tabIndex={-1}
            >
              Harmonization and Single Market
            </h2>
            <div className="space-y-4">
              <p>
                The free movement principle is a cornerstone of the EU's single
                market. By harmonizing accessibility requirements across all
                Member States, the European Accessibility Act facilitates:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cross-border trade in accessible products and services</li>
                <li>Greater legal certainty for economic operators</li>
                <li>
                  Economies of scale in the production of accessible products
                </li>
                <li>Increased competitiveness of EU businesses</li>
                <li>
                  Wider choice and better prices for consumers with disabilities
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="market-barriers">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-20"
              id="market-barriers"
              tabIndex={-1}
            >
              Eliminating Market Barriers
            </h2>
            <div className="space-y-4">
              <p>
                Prior to the European Accessibility Act, divergent national
                accessibility requirements created significant barriers for
                economic operators. Manufacturers and service providers had to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Understand and comply with different sets of requirements in
                  each Member State
                </li>
                <li>Adapt products and services for each national market</li>
                <li>
                  Bear additional costs for compliance with multiple regulatory
                  regimes
                </li>
                <li>
                  Navigate complex legal frameworks when operating across
                  borders
                </li>
              </ul>
              <p>
                By establishing a common set of accessibility requirements, the
                European Accessibility Act removes these barriers, allowing
                economic operators to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Design and manufacture products for the entire EU market
                </li>
                <li>
                  Provide services across Member States with legal certainty
                </li>
                <li>Reduce compliance costs and administrative burdens</li>
                <li>
                  Focus resources on innovation rather than regulatory
                  compliance
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="ce-marking">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-20"
              id="ce-marking"
              tabIndex={-1}
            >
              CE Marking and Free Movement
            </h2>
            <div className="space-y-4">
              <p>
                For products covered by the European Accessibility Act, the CE
                marking plays a crucial role in facilitating free movement. When
                a manufacturer affixes the CE marking to a product, they declare
                that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The product complies with all applicable accessibility
                  requirements
                </li>
                <li>
                  An appropriate conformity assessment has been carried out
                </li>
                <li>
                  The product can be legally placed on the market throughout the
                  EU
                </li>
              </ul>
              <p>
                This system of CE marking provides a visible indication of
                compliance, simplifying market surveillance and enabling free
                movement of accessible products across the EU.
              </p>
            </div>
          </section>

          <footer>
            <nav
              className="flex justify-between items-center mt-10 pt-4 border-t"
              aria-labelledby="footer-nav-heading"
            >
              <h2 id="footer-nav-heading" className="sr-only">
                Chapter navigation
              </h2>
              <Button asChild id="prev-chapter-button">
                <Link
                  href={INTRODUCTION_LINKS.EXISTING_LAW.fullPath}
                  className="no-underline"
                  aria-labelledby="prev-chapter-label"
                >
                  <ArrowLeft size={16} aria-hidden="true" />
                  <span id="prev-chapter-label">EAA Existing Union Law</span>
                </Link>
              </Button>
              <Button asChild id="next-chapter-button">
                <Link
                  href={OBLIGATIONS_LINKS.OVERVIEW.fullPath}
                  className="no-underline"
                  aria-labelledby="next-chapter-label"
                >
                  <span id="next-chapter-label">
                    EAA Obligations of Economic Operators
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
