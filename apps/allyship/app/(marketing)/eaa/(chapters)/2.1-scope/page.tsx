import React from 'react'
import { Metadata } from 'next'
import { ChapterNavigation } from '../../components/ChapterNavigation'

export const metadata: Metadata = {
  title: 'Scope and Application - European Accessibility Act',
  description:
    'Understanding what products and services must follow the European Accessibility Act and who is exempt from these rules.',
}

export default function ScopePage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 className="text-4xl font-bold mb-[23px]">
            Scope and Application
          </h1>

          <nav aria-labelledby="page-sections-heading">
            <h2 id="page-sections-heading" className="sr-only">
              Page sections
            </h2>
            <ul className="space-y-1 text-lg">
              <li>
                <a
                  className="underline"
                  href="#products-covered"
                  id="products-covered-link"
                >
                  Products Covered
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#services-covered"
                  id="services-covered-link"
                >
                  Services Covered
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#microenterprises"
                  id="microenterprises-link"
                >
                  Small Business Exemption
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#built-environment"
                  id="built-environment-link"
                >
                  Buildings and Spaces
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#emergency-services"
                  id="emergency-services-link"
                >
                  Emergency Services
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#specifications"
                  id="specifications-link"
                >
                  Extra Rules
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div
        className="lg:col-span-5 prose prose-lg dark:prose-invert pt-2 pb-4"
        id="eaa-content"
      >
        <div className="space-y-8">
          <section aria-labelledby="products-covered">
            <h2
              className="text-2xl font-semibold mb-4 mt-0 scroll-mt-6"
              id="products-covered"
              tabIndex={-1}
            >
              Products Covered.
            </h2>
            <div className="space-y-4">
              <p>
                This law applies to products sold after June 28, 2025. These
                products include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Computer systems and operating systems for home use.</li>
                <li>Payment terminals (both hardware and software).</li>
                <li>Self-service machines for services.</li>
              </ul>
              <p>Self-service machines include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>ATMs for banking.</li>
                <li>Machines that print tickets.</li>
                <li>Machines that give you a number in line at banks.</li>
                <li>Check-in machines at airports and hotels.</li>
                <li>Information kiosks in public places.</li>
              </ul>
              <p>The law also covers:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Electronic devices you can interact with.</li>
                <li>E-readers for digital books.</li>
              </ul>
              <p>
                The law does not cover screens built into vehicles, airplanes,
                ships, or trains. These have different rules.
              </p>
            </div>
          </section>

          <section aria-labelledby="services-covered">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="services-covered"
              tabIndex={-1}
            >
              Services Covered.
            </h2>
            <div className="space-y-4">
              <p>
                This law also applies to services offered after June 28, 2025.
                These services include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Phone, internet, and messaging services.</li>
                <li>Services that let you watch TV, films, and other media.</li>
                <li>Parts of travel services.</li>
              </ul>
              <p>Travel services include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Websites for booking travel.</li>
                <li>Mobile apps for travel services.</li>
                <li>Online ticket systems.</li>
                <li>Services that provide travel information.</li>
              </ul>
              <p>Other covered services include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Banking services for consumers.</li>
                <li>E-books and the software to read them.</li>
                <li>Online shopping websites and apps.</li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="microenterprises">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="microenterprises"
              tabIndex={-1}
            >
              Small Business Exemption.
            </h2>
            <div className="space-y-4">
              <p>
                Very small businesses that provide services do not have to
                follow these accessibility rules. These are businesses with
                fewer than 10 employees.
              </p>
              <p>
                EU countries must create guides to help these small businesses
                understand the laws. These guides must be created with help from
                experts and relevant groups.
              </p>
            </div>
          </section>

          <section aria-labelledby="built-environment">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="built-environment"
              tabIndex={-1}
            >
              Buildings and Spaces.
            </h2>
            <div className="space-y-4">
              <p>
                Each EU country can decide if buildings where these services are
                provided must also be accessible. These rules help people with
                disabilities use services more easily.
              </p>
            </div>
          </section>

          <section aria-labelledby="emergency-services">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="emergency-services"
              tabIndex={-1}
            >
              Emergency Services.
            </h2>
            <div className="space-y-4">
              <p>
                EU countries must make sure emergency call centers that answer
                '112' calls follow specific accessibility rules. Each country
                can set up their emergency systems in the way that works best
                for them.
              </p>
            </div>
          </section>

          <section aria-labelledby="specifications">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="specifications"
              tabIndex={-1}
            >
              Extra Rules.
            </h2>
            <div className="space-y-4">
              <p>
                The European Commission can create more detailed rules when
                needed. These extra rules help make sure products and services
                work together properly and are truly accessible.
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
              This page is based on these parts of Directive (EU) 2019/882:
            </p>
            <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1 mt-2">
              <li>Article 2 (Scope)</li>
              <li>Article 4, Paragraphs 4, 5, 6, 8, 9</li>
              <li>Recitals 18, 19, 25-28, 30-35, 39, 41, 42, 44-46, 49, 70</li>
            </ul>
          </section>

          <footer>
            <ChapterNavigation currentPageId="2.1-scope" />
          </footer>
        </div>
      </div>
    </section>
  )
}
