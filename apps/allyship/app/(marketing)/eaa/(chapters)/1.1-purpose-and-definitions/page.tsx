import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { INTRODUCTION_LINKS, EXTERNAL_LINKS } from '../../constants/links'
import { ArrowLeft, ArrowRight, ExternalLink, List } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'

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
          <div className="py-2">
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
          </div>

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
                  Purpose
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
      <div className="lg:col-span-5 prose prose-lg dark:prose-invert py-4">
        <div className="space-y-8">
          <section aria-labelledby="purpose">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="purpose"
              tabIndex={-1}
            >
              Purpose
            </h2>
            <div className="space-y-4">
              <p>
                The purpose of this Directive is to contribute to the proper
                functioning of the internal market by approximating laws,
                regulations and administrative provisions of the Member States
                as regards accessibility requirements for certain products and
                services by, in particular, eliminating and preventing barriers
                to the free movement of certain accessible products and services
                arising from divergent accessibility requirements in the Member
                States.
              </p>
              <p>
                This would increase the availability of accessible products and
                services in the internal market and improve the accessibility of
                relevant information.
              </p>
            </div>
          </section>

          <section aria-labelledby="disability-definition">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="disability-definition"
              tabIndex={-1}
            >
              Persons with Disabilities
            </h2>
            <div className="space-y-4">
              <p>
                This Directive defines persons with disabilities in line with
                the United Nations Convention on the Rights of Persons with
                Disabilities, adopted on 13 December 2006 (UN CRPD), to which
                the Union has been a Party since 21 January 2011 and which all
                Member States have ratified.
              </p>
              <p>
                The UN CRPD states that persons with disabilities include those
                who have long-term physical, mental, intellectual or sensory
                impairments which in interaction with various barriers may
                hinder their full and effective participation in society on an
                equal basis with others.
              </p>
              <p>
                This Directive promotes full and effective equal participation
                by improving access to mainstream products and services that,
                through their initial design or subsequent adaptation, address
                the particular needs of persons with disabilities.
              </p>
            </div>
          </section>

          <section aria-labelledby="functional-limitations">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="functional-limitations"
              tabIndex={-1}
            >
              Persons with Functional Limitations
            </h2>
            <div className="space-y-4">
              <p>
                Other persons who experience functional limitations, such as
                elderly persons, pregnant women or persons travelling with
                luggage, would also benefit from this Directive.
              </p>
              <p>
                The concept of 'persons with functional limitations', as
                referred to in this Directive, includes persons who have any
                physical, mental, intellectual or sensory impairments, age
                related impairments, or other human body performance related
                causes, permanent or temporary, which, in interaction with
                various barriers, result in their reduced access to products and
                services, leading to a situation that requires those products
                and services to be adapted to their particular needs.
              </p>
            </div>
          </section>

          <section aria-labelledby="internal-market-issues">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="internal-market-issues"
              tabIndex={-1}
            >
              Internal Market Issues
            </h2>
            <div className="space-y-4">
              <p>
                The disparities between the laws, regulations and administrative
                provisions of Member States concerning the accessibility of
                products and services for persons with disabilities, create
                barriers to the free movement of products and services and
                distort effective competition in the internal market.
              </p>
              <p>
                For some products and services, those disparities are likely to
                increase in the Union after the entry into force of the UN CRPD.
                Economic operators, in particular small and medium-sized
                enterprises (SMEs), are particularly affected by those barriers.
              </p>
              <p>
                Due to the differences in national accessibility requirements,
                individual professionals, SMEs and microenterprises in
                particular are discouraged from entering into business ventures
                outside their own domestic markets. The national, or even
                regional or local, accessibility requirements that Member States
                have put in place currently differ as regards both coverage and
                level of detail. Those differences negatively affect
                competitiveness and growth, due to the additional costs incurred
                in the development and marketing of accessible products and
                services for each national market.
              </p>
            </div>
          </section>

          <section aria-labelledby="consumer-issues">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="consumer-issues"
              tabIndex={-1}
            >
              Consumer Issues
            </h2>
            <div className="space-y-4">
              <p>
                Consumers of accessible products and services and of assistive
                technologies, are faced with high prices due to limited
                competition among suppliers. Fragmentation among national
                regulations reduces potential benefits derived from sharing with
                national and international peers experiences concerning
                responding to societal and technological developments.
              </p>
            </div>
          </section>

          <section aria-labelledby="harmonization">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="harmonization"
              tabIndex={-1}
            >
              Harmonization Benefits
            </h2>
            <div className="space-y-4">
              <p>
                The approximation of national measures at Union level is
                therefore necessary for the proper functioning of the internal
                market in order to put an end to fragmentation in the market of
                accessible products and services, to create economies of scale,
                to facilitate cross-border trade and mobility, as well as to
                help economic operators to concentrate resources on innovation
                instead of using those resources to cover expenses arising from
                fragmented legislation across the Union.
              </p>
              <p>
                The benefits of harmonising accessibility requirements for the
                internal market have been demonstrated by the application of
                Directive 2014/33/EU of the European Parliament and of the
                Council regarding lifts and Regulation (EC) No 661/2009 of the
                European Parliament and of the Council in the area of transport.
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
              <a
                href={EXTERNAL_LINKS.OFFICIAL_EAA_TEXT}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
                aria-labelledby="official-document-link"
                id="official-doc-link"
              >
                <span id="official-document-link" className="sr-only">
                  Official European Accessibility Act document (opens in new
                  window)
                </span>
                <ExternalLink size={14} aria-hidden="true" />
                <span>Official EAA Document</span>
              </a>
              <Button asChild id="next-chapter-button">
                <Link
                  href={INTRODUCTION_LINKS.SCOPE.fullPath}
                  className="no-underline"
                  aria-labelledby="next-chapter-label"
                >
                  <span id="next-chapter-label">EAA Scope and Application</span>
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
