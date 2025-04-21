import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, List, ExternalLink } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { INTRODUCTION_LINKS, ANNEXES_LINKS } from '../../constants/links'

export const metadata: Metadata = {
  title: 'Annex II: Implementation Examples | European Accessibility Act.',
  description:
    'Plain language guide to examples of how to implement accessibility requirements from the European Accessibility Act.',
}

export default function ImplementationExamplesPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 className="text-4xl font-bold mb-[23px]">
            Annex II: Implementation Examples.
          </h1>

          <nav aria-labelledby="page-sections-heading">
            <h2 id="page-sections-heading" className="sr-only">
              Page sections.
            </h2>
            <ul className="space-y-1 text-lg">
              <li>
                <a className="underline" href="#overview" id="overview-link">
                  Overview.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#requirement-based-examples"
                  id="requirement-based-examples-link"
                >
                  Requirement-Based Examples.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#product-based-examples"
                  id="product-based-examples-link"
                >
                  Product-Based Examples.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#service-based-examples"
                  id="service-based-examples-link"
                >
                  Service-Based Examples.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#minimum-examples"
                  id="minimum-examples-link"
                >
                  Minimum Requirements Examples.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#implementation-strategies"
                  id="implementation-strategies-link"
                >
                  Implementation Strategies.
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
              Overview.
            </h2>
            <div className="space-y-4">
              <p>
                Annex II of the European Accessibility Act provides examples of
                how to meet the accessibility requirements from Annex I. These
                examples help companies understand what specific changes they
                need to make.
              </p>
              <p>
                The examples in Annex II show possible solutions, but they are
                not the only ways to meet the requirements. Companies can use
                other methods as long as they achieve the same results.
              </p>
            </div>
          </section>

          <section aria-labelledby="requirement-based-examples">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="requirement-based-examples"
              tabIndex={-1}
            >
              Requirement-Based Examples.
            </h2>
            <div className="space-y-4">
              <h3
                className="text-xl font-semibold mb-2"
                id="information-provision"
              >
                Information Provision Examples.
              </h3>
              <p>To make product information accessible, companies can:</p>
              <ul>
                <li>
                  Display text and add image or sound that describes the same
                  information.
                </li>
                <li>Provide text alternatives for any non-text content.</li>
                <li>
                  Provide electronic files that screen readers can read aloud.
                </li>
                <li>Print information in Braille.</li>
                <li>Provide subtitles for videos.</li>
                <li>Use sans-serif fonts with good letter spacing.</li>
                <li>Ensure enough contrast between text and background.</li>
                <li>Avoid having understanding depend only on color.</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2" id="ui-examples">
                User Interface Examples.
              </h3>
              <p>To make user interfaces accessible, companies can:</p>
              <ul>
                <li>Provide audio instructions along with visual feedback.</li>
                <li>Use clear icons with text labels.</li>
                <li>
                  Add speech recognition as an alternative to keyboard input.
                </li>
                <li>Allow larger text display without losing content.</li>
                <li>Add options to change screen brightness and contrast.</li>
                <li>
                  Make controls that can be operated without much physical
                  strength.
                </li>
                <li>
                  Ensure products don't flash in ways that might cause seizures.
                </li>
                <li>Include an option to slow down button response times.</li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="product-based-examples">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="product-based-examples"
              tabIndex={-1}
            >
              Product-Based Examples.
            </h2>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-2" id="self-service">
                Self-Service Terminals.
              </h3>
              <p>
                For ATMs, ticket machines, and check-in kiosks, examples
                include:
              </p>
              <ul>
                <li>
                  Adding headphone jacks to hear audio instructions privately.
                </li>
                <li>
                  Adding text-to-speech functions that read screen text aloud.
                </li>
                <li>
                  Including tactile keypads with raised dots on number keys.
                </li>
                <li>Using high contrast screens with adjustable text size.</li>
                <li>
                  Adding voice control options for people who can't use touch
                  screens.
                </li>
                <li>
                  Making sure people in wheelchairs can reach all controls.
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2" id="e-readers">
                E-Readers.
              </h3>
              <p>For e-readers, examples include:</p>
              <ul>
                <li>Adding text-to-speech capabilities to read text aloud.</li>
                <li>
                  Including options to adjust font size, spacing, and contrast.
                </li>
                <li>
                  Making navigation options compatible with screen readers.
                </li>
                <li>Adding keyboard shortcuts for common functions.</li>
                <li>Ensuring good compatibility with braille displays.</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2" id="smartphones">
                Smartphones.
              </h3>
              <p>For smartphones, examples include:</p>
              <ul>
                <li>
                  Including built-in screen readers that work with all apps.
                </li>
                <li>
                  Adding voice assistant features for hands-free operation.
                </li>
                <li>
                  Making sure physical buttons are easy to feel and press.
                </li>
                <li>Providing system-wide options to enlarge text.</li>
                <li>Including hearing aid compatibility for phone calls.</li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="service-based-examples">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="service-based-examples"
              tabIndex={-1}
            >
              Service-Based Examples.
            </h2>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-2" id="websites">
                Websites and Mobile Apps.
              </h3>
              <p>For online services, examples include:</p>
              <ul>
                <li>
                  Adding proper headings and landmarks for screen reader
                  navigation.
                </li>
                <li>
                  Ensuring that forms have clear labels and error messages.
                </li>
                <li>Adding keyboard navigation for all functions.</li>
                <li>Including alt text for all images.</li>
                <li>Making sure websites meet WCAG 2.1 Level AA standards.</li>
                <li>Testing with actual users who have disabilities.</li>
              </ul>

              <h3
                className="text-xl font-semibold mt-6 mb-2"
                id="communication"
              >
                Communication Services.
              </h3>
              <p>For phone and video services, examples include:</p>
              <ul>
                <li>Adding real-time text options during voice calls.</li>
                <li>Including options for video relay with sign language.</li>
                <li>
                  Making sure emergency calls support text and video options.
                </li>
                <li>Adding clear visual indicators for incoming calls.</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2" id="media">
                Media Services.
              </h3>
              <p>For TV and streaming services, examples include:</p>
              <ul>
                <li>Including closed captions for all audio content.</li>
                <li>Adding audio descriptions for important visual content.</li>
                <li>Making program guides accessible to screen readers.</li>
                <li>Including options for sign language interpretation.</li>
                <li>
                  Creating accessible remote controls with tactile buttons.
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2" id="banking">
                Banking Services.
              </h3>
              <p>For banking services, examples include:</p>
              <ul>
                <li>Providing statements in accessible digital formats.</li>
                <li>
                  Adding multiple ways to verify identity (biometrics,
                  passwords).
                </li>
                <li>Making banking apps compatible with screen readers.</li>
                <li>Using clear, simple language in all communications.</li>
                <li>
                  Offering alternatives to signature-based authentication.
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2" id="e-commerce">
                E-Commerce Services.
              </h3>
              <p>For online shopping, examples include:</p>
              <ul>
                <li>
                  Adding clear product descriptions that don't rely only on
                  images.
                </li>
                <li>
                  Making checkout processes work with keyboard-only navigation.
                </li>
                <li>
                  Ensuring all forms are properly labeled for screen readers.
                </li>
                <li>
                  Including information about product accessibility features.
                </li>
                <li>
                  Providing multiple payment options with accessible interfaces.
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="minimum-examples">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="minimum-examples"
              tabIndex={-1}
            >
              Minimum Requirements Examples.
            </h2>
            <div className="space-y-4">
              <p>
                Annex II also gives examples of basic requirements that would
                allow at minimum:
              </p>
              <ul>
                <li>
                  For people who are blind: Using a screen reader to access
                  digital content or using physical buttons with tactile
                  indicators.
                </li>
                <li>
                  For people with low vision: Using screen magnification or high
                  contrast modes without losing content.
                </li>
                <li>
                  For people who are deaf: Reading captions or using text
                  alternatives for audio content.
                </li>
                <li>
                  For people with hearing loss: Adjusting volume independently
                  or using hearing aid compatibility features.
                </li>
                <li>
                  For people who cannot speak: Entering text commands or using
                  pre-stored phrases for communication.
                </li>
                <li>
                  For people with limited reach or strength: Using speech
                  commands or accessible switch controls.
                </li>
                <li>
                  For people with cognitive limitations: Using simplified
                  interfaces with clear instructions and error correction.
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="implementation-strategies">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="implementation-strategies"
              tabIndex={-1}
            >
              Implementation Strategies.
            </h2>
            <div className="space-y-4">
              <p>
                Based on the examples provided in Annex II, companies should:
              </p>
              <ul>
                <li>
                  Consider accessibility from the beginning of product or
                  service design.
                </li>
                <li>Test with real users who have different disabilities.</li>
                <li>Use existing standards like WCAG 2.1 as a foundation.</li>
                <li>
                  Document how products and services meet the requirements.
                </li>
                <li>Train staff on accessibility needs and solutions.</li>
                <li>
                  Keep up with new accessibility technologies and best
                  practices.
                </li>
                <li>
                  Choose the examples that best fit their specific products or
                  services.
                </li>
              </ul>
              <p>
                Remember that these examples are meant to help you understand
                the requirements, but companies should choose solutions that
                work best for their specific products and services.
              </p>
            </div>
          </section>

          <section aria-labelledby="references">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="references"
              tabIndex={-1}
            >
              References.
            </h2>
            <div className="space-y-4">
              <p>
                The examples on this page come from Annex II of the European
                Accessibility Act.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Directive (EU) 2019/882 - Annex II.</strong> Examples
                  of how to meet the accessibility requirements. This annex
                  provides practical examples related to the requirements in
                  Annex I.
                </li>
              </ul>
              <p>
                For the full legal text and specific examples, please refer to
                the official{' '}
                <a
                  href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32019L0882"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                  aria-labelledby="official-directive-link-4-2"
                >
                  <span id="official-directive-link-4-2" className="sr-only">
                    Directive (EU) 2019/882 (opens in new window).
                  </span>
                  Directive (EU) 2019/882
                  <ExternalLink
                    aria-hidden="true"
                    className="inline-block w-4 h-4 ml-1"
                  />
                </a>
                .
              </p>
            </div>
          </section>

          <footer>
            <nav
              className="flex justify-between items-center mt-10 pt-4 border-t"
              aria-labelledby="footer-nav-heading"
            >
              <h2 id="footer-nav-heading" className="sr-only">
                Chapter navigation.
              </h2>
              <Button asChild variant="outline" id="prev-chapter-button">
                <Link
                  href={ANNEXES_LINKS.ACCESSIBILITY_REQUIREMENTS.fullPath}
                  className="no-underline"
                  aria-labelledby="prev-chapter-label"
                >
                  <ArrowRight
                    size={16}
                    className="rotate-180 mr-1"
                    aria-hidden="true"
                  />
                  <span id="prev-chapter-label">
                    Annex I: Accessibility Requirements.
                  </span>
                </Link>
              </Button>
              <Button asChild id="next-chapter-button">
                <Link
                  href={ANNEXES_LINKS.BUILT_ENVIRONMENT.fullPath}
                  className="no-underline"
                  aria-labelledby="next-chapter-label"
                >
                  <span id="next-chapter-label">
                    Annex III: Built Environment.
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
