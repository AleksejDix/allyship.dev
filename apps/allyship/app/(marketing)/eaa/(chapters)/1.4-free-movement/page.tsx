import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { REQUIREMENTS_LINKS } from '../../constants/links'
import { TextToSpeechButton } from '@/components/accessibility/TextToSpeechButton'

export const metadata: Metadata = {
  title: 'Free Movement | European Accessibility Act',
  description:
    'How the European Accessibility Act helps products and services move freely between EU countries by removing barriers to trade.',
}

export default function FreeMovementPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
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
                  id="free-movement-principle-link"
                >
                  What Free Movement Means
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#harmonization"
                  id="harmonization-link"
                >
                  Same Rules Across EU
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
              <li>
                <a
                  className="underline"
                  href="#ce-marking"
                  id="ce-marking-link"
                >
                  The CE Mark
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="lg:col-span-5 prose prose-lg dark:prose-invert pb-4 pt-2">
        <TextToSpeechButton contentSelector="#eaa-content" />

        <div id="eaa-content" className="space-y-8">
          <section aria-labelledby="free-movement-principle">
            <h2
              className="text-2xl font-semibold mb-4 mt-0 scroll-mt-6"
              id="free-movement-principle"
              tabIndex={-1}
            >
              What Free Movement Means.
            </h2>
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
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="harmonization"
              tabIndex={-1}
            >
              Same Rules Across EU.
            </h2>
            <div className="space-y-4">
              <p>
                Free movement is key to the EU's single market. Having the same
                accessibility rules for all EU countries helps with:
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
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="market-barriers"
              tabIndex={-1}
            >
              Removing Trade Barriers.
            </h2>
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
                <li>Focus on creating new ideas instead of studying rules.</li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="ce-marking">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="ce-marking"
              tabIndex={-1}
            >
              The CE Mark.
            </h2>
            <div className="space-y-4">
              <p>
                The CE mark helps products move freely in the EU. When a company
                puts the CE mark on a product, it means:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The product meets all accessibility rules.</li>
                <li>The company has done all required tests.</li>
                <li>The product can be sold in any EU country.</li>
              </ul>
              <p>
                The CE mark shows that a product follows the rules. It makes
                checking products easier and allows them to be sold across the
                EU.
              </p>
            </div>
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
              <li>Article 6 (Free movement)</li>
              <li>Articles 17, 18 (Rules for CE marking)</li>
              <li>Recitals 1, 5, 6, 8 (Background on market benefits)</li>
            </ul>
          </section>

          <footer>
            <nav
              className="flex justify-end items-center mt-10 pt-4 border-t"
              aria-labelledby="footer-nav-heading"
            >
              <h2 id="footer-nav-heading" className="sr-only">
                Chapter navigation
              </h2>
              <Button asChild>
                <Link
                  href={REQUIREMENTS_LINKS.ACCESSIBILITY_REQUIREMENTS.fullPath}
                  className="no-underline"
                  aria-labelledby="next-chapter-label"
                >
                  <span id="next-chapter-label">
                    Accessibility Requirements
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
