import React from 'react'
import Link from 'next/link'

export default function PurposeAndDefinitionsPage() {
  return (
    <>
      <Link
        href="/eaa"
        className="inline-flex items-center text-sm text-blue-600 mb-6 hover:underline"
      >
        ← Back to Table of Contents
      </Link>

      <h1 className="text-4xl font-bold mb-8">Purpose and Definitions</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4" id="purpose">
            Purpose
          </h2>
          <div className="space-y-4">
            <p>
              The purpose of this Directive is to contribute to the proper
              functioning of the internal market by approximating laws,
              regulations and administrative provisions of the Member States as
              regards accessibility requirements for certain products and
              services by, in particular, eliminating and preventing barriers to
              the free movement of certain accessible products and services
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

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="disability-definition"
          >
            Persons with Disabilities
          </h2>
          <div className="space-y-4">
            <p>
              This Directive defines persons with disabilities in line with the
              United Nations Convention on the Rights of Persons with
              Disabilities, adopted on 13 December 2006 (UN CRPD), to which the
              Union has been a Party since 21 January 2011 and which all Member
              States have ratified.
            </p>
            <p>
              The UN CRPD states that persons with disabilities include those
              who have long-term physical, mental, intellectual or sensory
              impairments which in interaction with various barriers may hinder
              their full and effective participation in society on an equal
              basis with others.
            </p>
            <p>
              This Directive promotes full and effective equal participation by
              improving access to mainstream products and services that, through
              their initial design or subsequent adaptation, address the
              particular needs of persons with disabilities.
            </p>
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="functional-limitations"
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
              The concept of 'persons with functional limitations', as referred
              to in this Directive, includes persons who have any physical,
              mental, intellectual or sensory impairments, age related
              impairments, or other human body performance related causes,
              permanent or temporary, which, in interaction with various
              barriers, result in their reduced access to products and services,
              leading to a situation that requires those products and services
              to be adapted to their particular needs.
            </p>
          </div>
        </section>

        <section>
          <h2
            className="text-2xl font-semibold mb-4"
            id="internal-market-issues"
          >
            Internal Market Issues
          </h2>
          <div className="space-y-4">
            <p>
              The disparities between the laws, regulations and administrative
              provisions of Member States concerning the accessibility of
              products and services for persons with disabilities, create
              barriers to the free movement of products and services and distort
              effective competition in the internal market.
            </p>
            <p>
              For some products and services, those disparities are likely to
              increase in the Union after the entry into force of the UN CRPD.
              Economic operators, in particular small and medium-sized
              enterprises (SMEs), are particularly affected by those barriers.
            </p>
            <p>
              Due to the differences in national accessibility requirements,
              individual professionals, SMEs and microenterprises in particular
              are discouraged from entering into business ventures outside their
              own domestic markets. The national, or even regional or local,
              accessibility requirements that Member States have put in place
              currently differ as regards both coverage and level of detail.
              Those differences negatively affect competitiveness and growth,
              due to the additional costs incurred in the development and
              marketing of accessible products and services for each national
              market.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="consumer-issues">
            Consumer Issues
          </h2>
          <div className="space-y-4">
            <p>
              Consumers of accessible products and services and of assistive
              technologies, are faced with high prices due to limited
              competition among suppliers. Fragmentation among national
              regulations reduces potential benefits derived from sharing with
              national and international peers experiences concerning responding
              to societal and technological developments.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4" id="harmonization">
            Harmonization Benefits
          </h2>
          <div className="space-y-4">
            <p>
              The approximation of national measures at Union level is therefore
              necessary for the proper functioning of the internal market in
              order to put an end to fragmentation in the market of accessible
              products and services, to create economies of scale, to facilitate
              cross-border trade and mobility, as well as to help economic
              operators to concentrate resources on innovation instead of using
              those resources to cover expenses arising from fragmented
              legislation across the Union.
            </p>
            <p>
              The benefits of harmonising accessibility requirements for the
              internal market have been demonstrated by the application of
              Directive 2014/33/EU of the European Parliament and of the Council
              regarding lifts and Regulation (EC) No 661/2009 of the European
              Parliament and of the Council in the area of transport.
            </p>
          </div>
        </section>

        <nav className="flex justify-between mt-10 pt-4 border-t">
          <Link href="/eaa" className="text-blue-600 hover:underline">
            ← Table of Contents
          </Link>
          <Link href="/eaa/scope" className="text-blue-600 hover:underline">
            Scope and Application →
          </Link>
        </nav>
      </div>
    </>
  )
}
