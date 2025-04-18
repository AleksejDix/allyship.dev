import React from 'react'
import Link from 'next/link'

export default function ExistingLawPage() {
  return (
    <>
      <Link
        href="/eaa"
        className="inline-flex items-center text-sm text-blue-600 mb-6 hover:underline"
      >
        ← Back to Table of Contents
      </Link>

      <h1 className="text-4xl font-bold mb-8">
        Existing Union Law in the Field of Passenger Transport
      </h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4" id="compliance-rules">
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
              Where this Directive provides for requirements additional to those
              provided in those Regulations and those acts, the additional
              requirements shall apply in full.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="existing-regs">
            Existing Accessibility Regulations
          </h2>
          <div className="space-y-4">
            <h3 className="text-xl font-medium mb-2">Air Passenger Rights</h3>
            <p>
              Regulation (EC) No 261/2004 establishes common rules on
              compensation and assistance to passengers in the event of denied
              boarding and of cancellation or long delay of flights. It includes
              provisions for assisting persons with reduced mobility.
            </p>

            <p>
              Regulation (EC) No 1107/2006 concerns the rights of disabled
              persons and persons with reduced mobility when travelling by air.
              It prohibits air carriers from refusing reservation or boarding to
              such persons and requires airports and air carriers to provide
              assistance.
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
              when travelling by sea and inland waterway. It includes provisions
              on non-discrimination, accessibility, information, and assistance
              for persons with disabilities and reduced mobility.
            </p>

            <h3 className="text-xl font-medium mb-2 mt-4">
              Bus and Coach Transport
            </h3>
            <p>
              Regulation (EU) No 181/2011 sets out passenger rights in bus and
              coach transport, including specific provisions for disabled
              persons and persons with reduced mobility. It covers accessibility
              of terminals, staff training, and assistance.
            </p>
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="additional-requirements"
          >
            Additional Requirements
          </h2>
          <div className="space-y-4">
            <p>
              While the European Accessibility Act recognizes the existing
              regulations related to passenger transport, it provides additional
              requirements to ensure greater accessibility, such as:
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
              These additional requirements complement the existing regulations
              to create a more comprehensive framework for accessibility in
              passenger transport services.
            </p>
          </div>
        </section>

        <nav className="flex justify-between mt-10 pt-4 border-t">
          <Link
            href="/eaa/accessibility-requirements"
            className="text-blue-600 hover:underline"
          >
            ← Accessibility Requirements
          </Link>
          <Link
            href="/eaa/free-movement"
            className="text-blue-600 hover:underline"
          >
            Free Movement →
          </Link>
        </nav>
      </div>
    </>
  )
}
