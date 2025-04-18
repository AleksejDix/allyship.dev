import React from 'react'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import EaaTimeline from './components/EaaTimeline'

export default function EaaIndexPage() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4">European Accessibility Act</h1>
        <p className="text-xl text-muted-foreground">
          A comprehensive guide to understanding and implementing the EAA
          requirements
        </p>
      </div>

      {/* Book-style chapter structure */}
      <div className="mb-16 max-w-4xl">
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6">Foreword</h2>
          <p className="mb-4">
            The European Accessibility Act (EAA), formally Directive (EU)
            2019/882, establishes harmonized accessibility requirements for
            products and services across the European Union, eliminating
            barriers for persons with disabilities and improving the functioning
            of the internal market.
          </p>
        </section>

        <div className="my-8 border-t border-gray-200" aria-hidden="true"></div>

        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-sm font-medium tracking-widest uppercase">
              Chapter 1
            </h2>
            <h3 className="text-2xl font-semibold mt-2">
              <Link href="/eaa" className="hover:text-blue-600">
                Introduction
              </Link>
            </h3>
          </div>

          <ul className="space-y-2 mb-6 pl-2 border-l-2 border-slate-200 list-none">
            <li>
              <Link
                href="/eaa/purpose-and-definitions"
                className="text-lg hover:text-blue-600"
              >
                Purpose & Definitions
              </Link>
            </li>
            <li>
              <Link href="/eaa/scope" className="text-lg hover:text-blue-600">
                Scope & Application
              </Link>
            </li>
            <li>
              <Link
                href="/eaa/free-movement"
                className="text-lg hover:text-blue-600"
              >
                Free Movement
              </Link>
            </li>
          </ul>

          <div
            className="my-8 border-t border-gray-200"
            aria-hidden="true"
          ></div>

          <div className="mb-8">
            <h4 className="text-xl font-medium mb-4">
              Key Implementation Dates
            </h4>
            <EaaTimeline />
          </div>
        </section>

        <div className="my-8 border-t border-gray-200" aria-hidden="true"></div>

        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-sm font-medium tracking-widest uppercase">
              Chapter 2
            </h2>
            <h3 className="text-2xl font-semibold mt-2">
              <Link
                href="/eaa/accessibility-requirements"
                className="hover:text-blue-600"
              >
                Requirements
              </Link>
            </h3>
          </div>

          <ul className="space-y-2 mb-6 pl-2 border-l-2 border-slate-200 list-none">
            <li>
              <Link
                href="/eaa/existing-union-law"
                className="text-lg hover:text-blue-600"
              >
                Existing Union Law
              </Link>
            </li>
            <li>
              <Link
                href="/eaa/harmonized-standards"
                className="text-lg hover:text-blue-600"
              >
                Harmonized Standards
              </Link>
            </li>
          </ul>
        </section>

        <div className="my-8 border-t border-gray-200" aria-hidden="true"></div>

        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-sm font-medium tracking-widest uppercase">
              Chapter 3
            </h2>
            <h3 className="text-2xl font-semibold mt-2">
              <Link href="/eaa/obligations" className="hover:text-blue-600">
                Obligations
              </Link>
            </h3>
          </div>

          <ul className="space-y-2 mb-6 pl-2 border-l-2 border-slate-200 list-none">
            <li>
              <Link
                href="/eaa/obligations-manufacturers"
                className="text-lg hover:text-blue-600"
              >
                Obligations of Manufacturers
              </Link>
            </li>
            <li>
              <Link
                href="/eaa/obligations-importers"
                className="text-lg hover:text-blue-600"
              >
                Obligations of Importers
              </Link>
            </li>
            <li>
              <Link
                href="/eaa/obligations-distributors"
                className="text-lg hover:text-blue-600"
              >
                Obligations of Distributors
              </Link>
            </li>
            <li>
              <Link
                href="/eaa/obligations-service-providers"
                className="text-lg hover:text-blue-600"
              >
                Obligations of Service Providers
              </Link>
            </li>
          </ul>
        </section>

        <div className="my-8 border-t border-gray-200" aria-hidden="true"></div>

        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-sm font-medium tracking-widest uppercase">
              Chapter 4
            </h2>
            <h3 className="text-2xl font-semibold mt-2">
              <Link href="/eaa/conformity" className="hover:text-blue-600">
                Compliance
              </Link>
            </h3>
          </div>

          <ul className="space-y-2 mb-6 pl-2 border-l-2 border-slate-200 list-none">
            <li>
              <Link
                href="/eaa/eu-declaration"
                className="text-lg hover:text-blue-600"
              >
                EU Declaration of Conformity
              </Link>
            </li>
            <li>
              <Link
                href="/eaa/ce-marking"
                className="text-lg hover:text-blue-600"
              >
                CE Marking
              </Link>
            </li>
            <li>
              <Link
                href="/eaa/market-surveillance"
                className="text-lg hover:text-blue-600"
              >
                Market Surveillance for Products
              </Link>
            </li>
            <li>
              <Link
                href="/eaa/service-compliance"
                className="text-lg hover:text-blue-600"
              >
                Compliance of Services
              </Link>
            </li>
            <li>
              <Link
                href="/eaa/non-compliance"
                className="text-lg hover:text-blue-600"
              >
                Non-Compliance Procedures
              </Link>
            </li>
          </ul>
        </section>

        <div className="my-8 border-t border-gray-200" aria-hidden="true"></div>

        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-sm font-medium tracking-widest uppercase">
              Chapter 5
            </h2>
            <h3 className="text-2xl font-semibold mt-2">
              <Link
                href="/eaa/fundamental-alteration"
                className="hover:text-blue-600"
              >
                Exceptions
              </Link>
            </h3>
          </div>
        </section>

        <div className="my-8 border-t border-gray-200" aria-hidden="true"></div>

        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-sm font-medium tracking-widest uppercase">
              Appendices
            </h2>
            <h3 className="text-2xl font-semibold mt-2">
              <Link href="/eaa/annexes" className="hover:text-blue-600">
                Annexes
              </Link>
            </h3>
          </div>

          <ul className="space-y-2 mb-6 pl-2 border-l-2 border-slate-200 list-none">
            <li>
              <Link
                href="/eaa/annexes/accessibility-requirements"
                className="text-lg hover:text-blue-600"
              >
                Annex I - Accessibility Requirements
              </Link>
            </li>
            <li>
              <Link
                href="/eaa/annexes/implementation-examples"
                className="text-lg hover:text-blue-600"
              >
                Annex II - Examples of Implementation
              </Link>
            </li>
            <li>
              <Link
                href="/eaa/annexes/built-environment"
                className="text-lg hover:text-blue-600"
              >
                Annex III - Requirements for Built Environment
              </Link>
            </li>
            <li>
              <Link
                href="/eaa/annexes/disproportionate-burden-assessment"
                className="text-lg hover:text-blue-600"
              >
                Annex IV - Assessment of Disproportionate Burden
              </Link>
            </li>
            <li>
              <Link
                href="/eaa/annexes/conformity-assessment"
                className="text-lg hover:text-blue-600"
              >
                Annex V - Conformity Assessment for Products
              </Link>
            </li>
            <li>
              <Link
                href="/eaa/annexes/disproportionate-burden-criteria"
                className="text-lg hover:text-blue-600"
              >
                Annex VI - Criteria for Disproportionate Burden
              </Link>
            </li>
          </ul>
        </section>
      </div>

      <div className="my-8 border-t border-gray-200" aria-hidden="true"></div>

      <section className="mb-8">
        <div className="border-l-4 border-blue-500 pl-4 py-2">
          <h2 className="text-xl font-semibold mb-4">Need More Information?</h2>
          <p className="mb-4">
            For the official text of the European Accessibility Act and
            additional resources:
          </p>
          <ul className="space-y-2 list-none">
            <li>
              <a
                href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32019L0882"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center gap-1"
                aria-labelledby="official-directive-link"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                <span id="official-directive-link">
                  Official Directive (EU) 2019/882 text
                  <span className="sr-only">(opens in new window)</span>
                </span>
              </a>
            </li>
            <li>
              <a
                href="https://ec.europa.eu/social/main.jsp?catId=1202"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center gap-1"
                aria-labelledby="ec-resource-link"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                <span id="ec-resource-link">
                  European Commission EAA resource page
                  <span className="sr-only">(opens in new window)</span>
                </span>
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="text-sm text-muted-foreground border-t pt-4">
        <p>
          Source: Directive (EU) 2019/882 of the European Parliament and of the
          Council of 17 April 2019 on the accessibility requirements for
          products and services.
        </p>
        <p className="mt-1">
          Last updated:{' '}
          {new Date().toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
    </div>
  )
}
