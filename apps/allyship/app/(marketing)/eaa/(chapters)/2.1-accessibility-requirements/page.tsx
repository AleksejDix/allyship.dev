import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import {
  INTRODUCTION_LINKS,
  OBLIGATIONS_LINKS,
  ANNEXES_LINKS,
  EXTERNAL_LINKS,
} from '../../constants/links'
import { SeeAlso } from '../../components/see-also'

export const metadata: Metadata = {
  title: 'Accessibility Requirements | European Accessibility Act',
  description:
    'Key rules for making products and services accessible under the European Accessibility Act, including main principles and rules for different sectors.',
}

export default function AccessibilityRequirementsPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 id="page-title" className="text-4xl font-bold mb-[23px]">
            Accessibility Requirements.
          </h1>

          <nav aria-labelledby="page-sections-heading">
            <h2 id="page-sections-heading" className="sr-only">
              Page sections.
            </h2>
            <ul className="space-y-1 text-lg">
              <li>
                <a
                  className="underline"
                  href="#general-principles"
                  id="general-principles-link"
                >
                  General Principles.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#products-requirements"
                  id="products-requirements-link"
                >
                  Product Requirements.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#services-requirements"
                  id="services-requirements-link"
                >
                  Service Requirements.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#specific-sectors"
                  id="specific-sectors-link"
                >
                  Sector Requirements.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#annex-reference"
                  id="annex-reference-link"
                >
                  Annexes.
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div
        className="lg:col-span-5 prose prose-lg dark:prose-invert py-4 pt-2"
        id="eaa-content"
        aria-labelledby="page-title"
      >
        <div className="space-y-8">
          <section aria-labelledby="general-principles">
            <h2
              className="text-2xl font-semibold mb-4 mt-0 scroll-mt-6"
              id="general-principles"
              tabIndex={-1}
            >
              General Principles.
            </h2>
            <div className="space-y-4">
              <p>
                Products and services covered by this law must be designed for
                people with disabilities to use. They must also include clear
                information about how they work and their accessibility
                features.
              </p>
              <p>
                The accessibility rules follow four key principles from the{' '}
                <a
                  href={EXTERNAL_LINKS.W3C_WCAG}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1"
                >
                  Web Content Accessibility Guidelines (WCAG)
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
                :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Perceivable:</strong> Users must be able to find and
                  access information using their senses.
                </li>
                <li>
                  <strong>Operable:</strong> All users must be able to use
                  controls and navigate interfaces.
                </li>
                <li>
                  <strong>Understandable:</strong> Users must be able to
                  understand the information and how to use the interface.
                </li>
                <li>
                  <strong>Robust:</strong> Content must work with different
                  technologies, including assistive tools.
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="products-requirements">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="products-requirements"
              tabIndex={-1}
            >
              Product Requirements.
            </h2>
            <div className="space-y-4">
              <p>
                For products covered by this law (see{' '}
                <Link
                  href={INTRODUCTION_LINKS.SCOPE.fullPath}
                  className="underline"
                >
                  Scope and Application
                </Link>
                ), accessibility rules include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Information on the product (labels, instructions, warnings)
                  must meet these standards:
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Available through more than one sense (like sight and
                      touch).
                    </li>
                    <li>Easy to understand.</li>
                    <li>Presented in ways users can detect.</li>
                    <li>
                      Shown in text that is large enough and clear to read.
                    </li>
                  </ul>
                </li>
                <li>
                  User interfaces must be accessible so people with disabilities
                  can understand and use them.
                </li>
                <li>
                  Products must work with assistive devices like hearing aids,
                  cochlear implants, and listening systems.
                </li>
                <li>
                  Support services (help desks, call centers, technical support)
                  must provide information on product accessibility.
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="services-requirements">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="services-requirements"
              tabIndex={-1}
            >
              Service Requirements.
            </h2>
            <div className="space-y-4">
              <p>These are the requirements that services must follow:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Provide information about how the service works and its
                  accessibility features.
                </li>
                <li>
                  Have websites that are accessible for all users to find, use,
                  and understand, with content that adapts to different needs.
                </li>
                <li>
                  Include practices and policies that address the needs of
                  people with disabilities.
                </li>
                <li>
                  Have mobile apps that are accessible for all users to find,
                  use, and understand.
                </li>
                <li>
                  Make electronic ID, security, and payment systems that are
                  easy to find, use, understand, and work with assistive
                  technologies.
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="specific-sectors">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="specific-sectors"
              tabIndex={-1}
            >
              Specific Sector Requirements.
            </h2>
            <div className="space-y-4">
              <h3 className="text-xl font-medium mb-2">
                Electronic Communications.
              </h3>
              <p>Communication services must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Offer text in real time along with voice calls.</li>
                <li>
                  Provide complete conversation options when voice and video are
                  both used.
                </li>
                <li>
                  Make sure emergency communications with voice, text, and video
                  work together at the same time.
                </li>
              </ul>

              <h3 className="text-xl font-medium mb-2 mt-6">
                Access to Audio-Visual Media Services.
              </h3>
              <p>Media services must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Make electronic program guides usable, reliable, and able to
                  provide information about accessibility.
                </li>
                <li>
                  Ensure all parts of the service, including apps, are
                  accessible to people with disabilities.
                </li>
              </ul>

              <h3 className="text-xl font-medium mb-2 mt-6">E-Books.</h3>
              <p>E-books must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Support screen readers and other assistive technology.</li>
                <li>
                  Protect accessibility features when using security measures
                  like digital rights management.
                </li>
                <li>Include metadata about accessibility features.</li>
                <li>
                  Make sure text and images can be properly read and understood
                  with assistive technology.
                </li>
              </ul>

              <h3 className="text-xl font-medium mb-2 mt-6">E-Commerce.</h3>
              <p>E-commerce services must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Provide information about the accessibility of products being
                  sold.
                </li>
                <li>Make shopping websites and mobile apps accessible.</li>
                <li>
                  Ensure checkout, payment, and account creation processes are
                  accessible.
                </li>
              </ul>

              <h3 className="text-xl font-medium mb-2 mt-6">
                Banking Services.
              </h3>
              <p>Banking services must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Make consumer banking websites accessible.</li>
                <li>
                  Provide identification methods that work for people with
                  disabilities.
                </li>
                <li>Make banking apps accessible.</li>
                <li>Ensure ATMs can be used by people with disabilities.</li>
              </ul>

              <h3 className="text-xl font-medium mb-2 mt-6">
                Transport Services.
              </h3>
              <p>Transport services must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Provide information about service accessibility through
                  websites and mobile apps.
                </li>
                <li>
                  Make self-service terminals like ticketing kiosks accessible.
                </li>
                <li>
                  Offer accessible ways to check-in and get boarding passes.
                </li>
                <li>
                  Provide accessible information about schedules, routes, and
                  service disruptions.
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="annex-reference">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="annex-reference"
              tabIndex={-1}
            >
              Annexes.
            </h2>
            <div className="space-y-4">
              <p>
                The detailed accessibility requirements are found in the annexes
                of the European Accessibility Act:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Annex I:</strong> The main accessibility requirements
                  for products and services.
                </li>
                <li>
                  <strong>Annex II:</strong> Examples of how to meet the
                  requirements in Annex I.
                </li>
                <li>
                  <strong>Annex III:</strong> Requirements for the built
                  environment where services are provided.
                </li>
                <li>
                  <strong>Annex IV:</strong> The procedure for checking if
                  products conform to the requirements.
                </li>
                <li>
                  <strong>Annex V:</strong> Information to include when claiming
                  an exception due to disproportionate burden.
                </li>
                <li>
                  <strong>Annex VI:</strong> Criteria to assess if a requirement
                  would cause a fundamental change or disproportionate burden.
                </li>
              </ul>
              <p className="mt-4">
                <Link
                  href={ANNEXES_LINKS.OVERVIEW.fullPath}
                  className="text-blue-600 hover:underline inline-flex items-center"
                >
                  Learn more about the annexes
                  <ArrowRight className="ml-1" size={16} aria-hidden="true" />
                </Link>
              </p>
            </div>
          </section>

          <SeeAlso
            links={[
              {
                href: INTRODUCTION_LINKS.SCOPE.fullPath,
                label: 'Scope and Application',
              },
              {
                href: OBLIGATIONS_LINKS.OVERVIEW.fullPath,
                label: 'Obligations Overview',
              },
            ]}
          />
        </div>
      </div>
    </section>
  )
}
