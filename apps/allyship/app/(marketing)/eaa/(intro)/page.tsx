import React from 'react'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { Metadata } from 'next'
import EaaTimeline from '../components/EaaTimeline'
import {
  INTRODUCTION_LINKS,
  REQUIREMENTS_LINKS,
  OBLIGATIONS_LINKS,
  COMPLIANCE_LINKS,
  EXCEPTIONS_LINKS,
  ANNEXES_LINKS,
  EXTERNAL_LINKS,
} from '../constants/links'

export const metadata: Metadata = {
  title: 'European Accessibility Act | Complete Guide',
  description:
    'Comprehensive guide to understanding and implementing the European Accessibility Act (EAA) requirements for accessible products and services.',
}

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
              <Link
                href={INTRODUCTION_LINKS.OVERVIEW.fullPath}
                className="hover:text-blue-600"
              >
                Introduction
              </Link>
            </h3>
          </div>

          <ul className="space-y-2 mb-6 pl-2 border-l-2 border-slate-200 list-none">
            <li>
              <Link
                href={INTRODUCTION_LINKS.PURPOSE_AND_DEFINITIONS.fullPath}
                className="text-lg hover:text-blue-600"
              >
                {INTRODUCTION_LINKS.PURPOSE_AND_DEFINITIONS.label}
              </Link>
            </li>
            <li>
              <Link
                href={INTRODUCTION_LINKS.SCOPE.fullPath}
                className="text-lg hover:text-blue-600"
              >
                {INTRODUCTION_LINKS.SCOPE.label}
              </Link>
            </li>
            <li>
              <Link
                href={INTRODUCTION_LINKS.FREE_MOVEMENT.fullPath}
                className="text-lg hover:text-blue-600"
              >
                {INTRODUCTION_LINKS.FREE_MOVEMENT.label}
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
                href={REQUIREMENTS_LINKS.ACCESSIBILITY_REQUIREMENTS.fullPath}
                className="hover:text-blue-600"
              >
                Requirements
              </Link>
            </h3>
          </div>

          <ul className="space-y-2 mb-6 pl-2 border-l-2 border-slate-200 list-none">
            <li>
              <Link
                href={INTRODUCTION_LINKS.EXISTING_LAW.fullPath}
                className="text-lg hover:text-blue-600"
              >
                {INTRODUCTION_LINKS.EXISTING_LAW.label}
              </Link>
            </li>
            <li>
              <Link
                href={COMPLIANCE_LINKS.HARMONIZED_STANDARDS.fullPath}
                className="text-lg hover:text-blue-600"
              >
                {COMPLIANCE_LINKS.HARMONIZED_STANDARDS.label}
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
              <Link
                href={OBLIGATIONS_LINKS.OVERVIEW.fullPath}
                className="hover:text-blue-600"
              >
                Obligations
              </Link>
            </h3>
          </div>

          <ul className="space-y-2 mb-6 pl-2 border-l-2 border-slate-200 list-none">
            <li>
              <Link
                href={OBLIGATIONS_LINKS.MANUFACTURERS.fullPath}
                className="text-lg hover:text-blue-600"
              >
                {OBLIGATIONS_LINKS.MANUFACTURERS.label}
              </Link>
            </li>
            <li>
              <Link
                href={OBLIGATIONS_LINKS.IMPORTERS.fullPath}
                className="text-lg hover:text-blue-600"
              >
                {OBLIGATIONS_LINKS.IMPORTERS.label}
              </Link>
            </li>
            <li>
              <Link
                href={OBLIGATIONS_LINKS.DISTRIBUTORS.fullPath}
                className="text-lg hover:text-blue-600"
              >
                {OBLIGATIONS_LINKS.DISTRIBUTORS.label}
              </Link>
            </li>
            <li>
              <Link
                href={OBLIGATIONS_LINKS.SERVICE_PROVIDERS.fullPath}
                className="text-lg hover:text-blue-600"
              >
                {OBLIGATIONS_LINKS.SERVICE_PROVIDERS.label}
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
              <Link
                href={COMPLIANCE_LINKS.CONFORMITY.fullPath}
                className="hover:text-blue-600"
              >
                Compliance
              </Link>
            </h3>
          </div>

          <ul className="space-y-2 mb-6 pl-2 border-l-2 border-slate-200 list-none">
            <li>
              <Link
                href={COMPLIANCE_LINKS.EU_DECLARATION.fullPath}
                className="text-lg hover:text-blue-600"
              >
                {COMPLIANCE_LINKS.EU_DECLARATION.label}
              </Link>
            </li>
            <li>
              <Link
                href={COMPLIANCE_LINKS.CE_MARKING.fullPath}
                className="text-lg hover:text-blue-600"
              >
                {COMPLIANCE_LINKS.CE_MARKING.label}
              </Link>
            </li>
            <li>
              <Link
                href={COMPLIANCE_LINKS.MARKET_SURVEILLANCE.fullPath}
                className="text-lg hover:text-blue-600"
              >
                {COMPLIANCE_LINKS.MARKET_SURVEILLANCE.label}
              </Link>
            </li>
            <li>
              <Link
                href={COMPLIANCE_LINKS.SERVICE_COMPLIANCE.fullPath}
                className="text-lg hover:text-blue-600"
              >
                {COMPLIANCE_LINKS.SERVICE_COMPLIANCE.label}
              </Link>
            </li>
            <li>
              <Link
                href={COMPLIANCE_LINKS.NON_COMPLIANCE.fullPath}
                className="text-lg hover:text-blue-600"
              >
                {COMPLIANCE_LINKS.NON_COMPLIANCE.label}
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
                href={EXCEPTIONS_LINKS.FUNDAMENTAL_ALTERATION.fullPath}
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
              <Link
                href={ANNEXES_LINKS.OVERVIEW.fullPath}
                className="hover:text-blue-600"
              >
                Annexes
              </Link>
            </h3>
          </div>

          <ul className="space-y-2 mb-6 pl-2 border-l-2 border-slate-200 list-none">
            <li>
              <Link
                href={ANNEXES_LINKS.ACCESSIBILITY_REQUIREMENTS.fullPath}
                className="text-lg hover:text-blue-600"
              >
                {ANNEXES_LINKS.ACCESSIBILITY_REQUIREMENTS.label}
              </Link>
            </li>
            <li>
              <Link
                href={ANNEXES_LINKS.IMPLEMENTATION_EXAMPLES.fullPath}
                className="text-lg hover:text-blue-600"
              >
                {ANNEXES_LINKS.IMPLEMENTATION_EXAMPLES.label}
              </Link>
            </li>
            <li>
              <Link
                href={ANNEXES_LINKS.BUILT_ENVIRONMENT.fullPath}
                className="text-lg hover:text-blue-600"
              >
                {ANNEXES_LINKS.BUILT_ENVIRONMENT.label}
              </Link>
            </li>
            <li>
              <Link
                href={ANNEXES_LINKS.DISPROPORTIONATE_BURDEN.fullPath}
                className="text-lg hover:text-blue-600"
              >
                {ANNEXES_LINKS.DISPROPORTIONATE_BURDEN.label}
              </Link>
            </li>
            <li>
              <Link
                href={ANNEXES_LINKS.CONFORMITY_ASSESSMENT.fullPath}
                className="text-lg hover:text-blue-600"
              >
                {ANNEXES_LINKS.CONFORMITY_ASSESSMENT.label}
              </Link>
            </li>
            <li>
              <Link
                href={ANNEXES_LINKS.ASSESSMENT_CRITERIA.fullPath}
                className="text-lg hover:text-blue-600"
              >
                {ANNEXES_LINKS.ASSESSMENT_CRITERIA.label}
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
                href={EXTERNAL_LINKS.OFFICIAL_EAA_TEXT}
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
