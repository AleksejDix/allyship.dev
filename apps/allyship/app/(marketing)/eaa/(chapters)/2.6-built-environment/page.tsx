import React from 'react'
import { Metadata } from 'next'
import { ChapterNavigation } from '../../components/ChapterNavigation'

export const metadata: Metadata = {
  title: 'Built Environment Accessibility | European Accessibility Act',
  description:
    'Understanding the optional requirements for the accessibility of the built environment under the European Accessibility Act.',
}

export default function BuiltEnvironmentPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 className="text-4xl font-bold mb-[23px]">
            Built Environment Accessibility.
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
                  href="#optional-nature"
                  id="optional-nature-link"
                >
                  Optional Nature.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#key-requirements"
                  id="key-requirements-link"
                >
                  Key Requirements.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#implementation"
                  id="implementation-link"
                >
                  Implementation.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#relationship"
                  id="relationship-link"
                >
                  Relationship to Other Laws.
                </a>
              </li>
              <li>
                <a className="underline" href="#benefits" id="benefits-link">
                  Benefits.
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div
        className="lg:col-span-5 prose prose-lg dark:prose-invert pb-4 pt-2"
        id="eaa-content"
      >
        <div className="space-y-8">
          <section aria-labelledby="overview">
            <h2
              className="text-2xl font-semibold mb-4 mt-0 scroll-mt-6"
              id="overview"
              tabIndex={-1}
            >
              Overview of Built Environment Requirements.
            </h2>
            <div className="space-y-4">
              <p>
                The European Accessibility Act includes provisions for the
                accessibility of the built environment, though these are
                optional for Member States to implement. These requirements
                focus on the physical spaces where products and services covered
                by the EAA are provided to the public.
              </p>
              <p>
                The built environment refers to physical structures such as
                buildings, entrances, pathways, and facilities that consumers
                use when accessing services. Making these spaces accessible is
                crucial for ensuring that people with disabilities can fully use
                the products and services covered by the EAA.
              </p>
            </div>
          </section>

          <section aria-labelledby="optional-nature">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="optional-nature"
              tabIndex={-1}
            >
              Optional Nature of These Requirements.
            </h2>
            <div className="space-y-4">
              <p>
                Unlike other provisions of the EAA, the requirements for the
                built environment are not mandatory across all EU Member States.
                Instead:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Member States can decide whether to require compliance with
                  the built environment provisions
                </li>
                <li>
                  If implemented, these requirements apply to new infrastructure
                  or significant renovations
                </li>
                <li>
                  Member States that choose to implement these provisions must
                  base them on the criteria in Annex III of the EAA
                </li>
                <li>
                  The provisions only apply to the built environment used by
                  clients of services covered by the EAA
                </li>
              </ul>
              <p>
                This flexibility allows Member States to align the EAA's built
                environment requirements with their existing national building
                regulations and accessibility laws.
              </p>
            </div>
          </section>

          <section aria-labelledby="key-requirements">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="key-requirements"
              tabIndex={-1}
            >
              Key Requirements for the Built Environment.
            </h2>
            <div className="space-y-4">
              <p>
                According to Annex III of the EAA, the key areas for built
                environment accessibility include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Use of related outdoor spaces and facilities</strong>{' '}
                  owned by the service provider
                </li>
                <li>
                  <strong>Approaches to buildings</strong> including parking,
                  drop-off points, and clear paths
                </li>
                <li>
                  <strong>Building entrances</strong> that are identifiable,
                  accessible, and usable by all people
                </li>
                <li>
                  <strong>Circulation paths</strong> that allow movement through
                  buildings, including corridors and floors
                </li>
                <li>
                  <strong>Service provision spaces</strong> where the actual
                  service is delivered to customers
                </li>
                <li>
                  <strong>Information elements</strong> including signage,
                  wayfinding, and communication systems
                </li>
                <li>
                  <strong>
                    Accessible emergency exits and emergency information
                  </strong>{' '}
                  for all users
                </li>
                <li>
                  <strong>Accessible facilities</strong> such as toilets,
                  service counters, and interactive terminals
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="implementation">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="implementation"
              tabIndex={-1}
            >
              Implementation Considerations.
            </h2>
            <div className="space-y-4">
              <p>
                For Member States that choose to implement built environment
                requirements:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Requirements typically apply to new construction and major
                  renovations
                </li>
                <li>
                  The accessibility requirements should follow the principles of
                  "design for all"
                </li>
                <li>
                  Implementation may be phased, with different timelines than
                  the core EAA requirements
                </li>
                <li>
                  Compliance can often be achieved by following existing
                  harmonized standards for built environment accessibility
                </li>
                <li>
                  Disproportionate burden provisions may apply in some
                  circumstances
                </li>
              </ul>
              <p>
                Service providers should be aware of the specific requirements
                in each Member State where they operate, as these may vary
                considerably.
              </p>
            </div>
          </section>

          <section aria-labelledby="relationship">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="relationship"
              tabIndex={-1}
            >
              Relationship to Other Laws.
            </h2>
            <div className="space-y-4">
              <p>
                The built environment requirements in the EAA exist within a
                broader legal framework:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>National building codes</strong> - Most Member States
                  already have national requirements for built environment
                  accessibility
                </li>
                <li>
                  <strong>European Standard EN 17210</strong> - Provides
                  detailed accessibility and usability guidelines for the built
                  environment
                </li>
                <li>
                  <strong>
                    UN Convention on the Rights of Persons with Disabilities
                  </strong>{' '}
                  - Requires accessibility of the physical environment
                </li>
                <li>
                  <strong>Web Accessibility Directive</strong> - Complements the
                  EAA by covering public sector websites and mobile applications
                </li>
              </ul>
              <p>
                When implementing built environment accessibility, organizations
                should consider all applicable laws in their jurisdiction, not
                just the EAA.
              </p>
            </div>
          </section>

          <section aria-labelledby="benefits">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="benefits"
              tabIndex={-1}
            >
              Benefits of Accessible Built Environments.
            </h2>
            <div className="space-y-4">
              <p>
                Making the built environment accessible provides numerous
                benefits:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Increased market reach</strong> - More customers can
                  access services and products
                </li>
                <li>
                  <strong>Better customer experience</strong> - All users
                  benefit from intuitive, barrier-free environments
                </li>
                <li>
                  <strong>Future-proofing</strong> - Preparing for aging
                  populations and evolving accessibility standards
                </li>
                <li>
                  <strong>Social inclusion</strong> - Creating spaces where
                  everyone feels welcome and can participate
                </li>
                <li>
                  <strong>Legal compliance</strong> - Reducing risk of
                  complaints and litigation
                </li>
                <li>
                  <strong>Environmental sustainability</strong> - Accessible
                  designs often align with sustainable building practices
                </li>
              </ul>
              <p>
                Even if not mandatory in all Member States, implementing built
                environment accessibility is a strategic investment that creates
                more inclusive spaces for everyone.
              </p>
            </div>
          </section>

          <section aria-labelledby="references" className="mt-12 pt-6 border-t">
            <h2
              id="references"
              className="text-xl font-semibold mb-4 scroll-mt-6"
              tabIndex={-1}
            >
              Source References.
            </h2>
            <p className="text-sm text-muted-foreground">
              This page references these sections of Directive (EU) 2019/882:
            </p>
            <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1 mt-2">
              <li>
                Article 4(4). Reference to built environment accessibility.
              </li>
              <li>
                Article 15. Member State option to require built environment
                accessibility.
              </li>
              <li>
                Annex III. Accessibility requirements related to the built
                environment.
              </li>
              <li>
                Recitals 49 and 50. Context on built environment accessibility.
              </li>
            </ul>
          </section>

          <footer>
            <ChapterNavigation currentPageId="2.6-built-environment" />
          </footer>
        </div>
      </div>
    </section>
  )
}
