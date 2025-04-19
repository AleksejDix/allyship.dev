import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, List } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { INTRODUCTION_LINKS } from '../../constants/links'

export const metadata: Metadata = {
  title: 'Existing Union Law | European Accessibility Act',
  description:
    'Understand how the EAA interacts with existing EU regulations on passenger transport accessibility and what additional requirements apply.',
}

export default function ExistingLawPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 className="text-4xl font-bold mb-[23px]">
            Existing Union Law in the Field of Passenger Transport
          </h1>

          <nav aria-labelledby="page-sections-heading">
            <h2 id="page-sections-heading" className="sr-only">
              Page sections
            </h2>
            <ul className="space-y-1 text-lg">
              <li>
                <a
                  className="underline"
                  href="#compliance-rules"
                  id="compliance-rules-link"
                >
                  Compliance with Existing Law
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#existing-regs"
                  id="existing-regs-link"
                >
                  Existing Accessibility Regulations
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#additional-requirements"
                  id="additional-requirements-link"
                >
                  Additional Requirements
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="lg:col-span-5 prose prose-lg dark:prose-invert pt-2 pb-4">
        <div className="space-y-8">
          <section aria-labelledby="compliance-rules">
            <h2
              className="text-2xl font-semibold mb-4 mt-0 scroll-mt-6"
              id="compliance-rules"
              tabIndex={-1}
            >
              Compliance with Existing Law
            </h2>
            <div className="space-y-4">
              <p>
                Services complying with the requirements on the provision of
                accessible information and of information on accessibility laid
                down in the following Regulations shall be deemed to comply with
                the corresponding requirements of this Directive:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Regulation (EC) No 261/2004</li>
                <li>Regulation (EC) No 1107/2006</li>
                <li>Regulation (EC) No 1371/2007</li>
                <li>Regulation (EU) No 1177/2010</li>
                <li>Regulation (EU) No 181/2011</li>
                <li>
                  Relevant acts adopted on the basis of Directive 2008/57/EC
                </li>
              </ul>
              <p>
                Where this Directive provides for requirements additional to
                those provided in those Regulations and those acts, the
                additional requirements shall apply in full.
              </p>
            </div>
          </section>

          <section aria-labelledby="existing-regs">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="existing-regs"
              tabIndex={-1}
            >
              Existing Accessibility Regulations
            </h2>
            <div className="space-y-4">
              <h3 className="text-xl font-medium mb-2">Air Passenger Rights</h3>
              <p>
                Regulation (EC) No 261/2004 establishes common rules on
                compensation and assistance to passengers in the event of denied
                boarding and of cancellation or long delay of flights. It
                includes provisions for assisting persons with reduced mobility.
              </p>

              <p>
                Regulation (EC) No 1107/2006 concerns the rights of disabled
                persons and persons with reduced mobility when travelling by
                air. It prohibits air carriers from refusing reservation or
                boarding to such persons and requires airports and air carriers
                to provide assistance.
              </p>

              <h3 className="text-xl font-medium mb-2 mt-4">
                Rail Passenger Rights
              </h3>
              <p>
                Regulation (EC) No 1371/2007 sets out rights and obligations for
                rail passengers, including specific provisions for persons with
                disabilities or reduced mobility. It covers accessibility,
                assistance, and information provision.
              </p>

              <h3 className="text-xl font-medium mb-2 mt-4">
                Waterborne Transport
              </h3>
              <p>
                Regulation (EU) No 1177/2010 concerns the rights of passengers
                when travelling by sea and inland waterway. It includes
                provisions on non-discrimination, accessibility, information,
                and assistance for persons with disabilities and reduced
                mobility.
              </p>

              <h3 className="text-xl font-medium mb-2 mt-4">
                Bus and Coach Transport
              </h3>
              <p>
                Regulation (EU) No 181/2011 sets out passenger rights in bus and
                coach transport, including specific provisions for disabled
                persons and persons with reduced mobility. It covers
                accessibility of terminals, staff training, and assistance.
              </p>
            </div>
          </section>

          <section aria-labelledby="additional-requirements">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="additional-requirements"
              tabIndex={-1}
            >
              Additional Requirements
            </h2>
            <div className="space-y-4">
              <p>
                While the European Accessibility Act recognizes the existing
                regulations related to passenger transport, it provides
                additional requirements to ensure greater accessibility, such
                as:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  More detailed technical requirements for websites, mobile
                  applications, and self-service terminals
                </li>
                <li>Specific provisions for e-ticketing systems</li>
                <li>Requirements for real-time travel information</li>
                <li>
                  Accessibility of digital documentation related to transport
                  services
                </li>
              </ul>
              <p>
                These additional requirements complement the existing
                regulations to create a more comprehensive framework for
                accessibility in passenger transport services.
              </p>
            </div>
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
                  href={INTRODUCTION_LINKS.FREE_MOVEMENT.fullPath}
                  className="no-underline"
                >
                  Free Movement
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
