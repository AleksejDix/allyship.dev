import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { ANNEXES_LINKS } from '../../constants/links'

export const metadata: Metadata = {
  title: 'Annex III: Built Environment | European Accessibility Act.',
  description:
    'Plain language guide to the built environment accessibility rules in the European Accessibility Act.',
}

export default function BuiltEnvironmentPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 className="text-4xl font-bold mb-[23px]">
            Annex III: Built Environment.
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
                  href="#specific-requirements"
                  id="specific-requirements-link"
                >
                  Specific Requirements.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#entrances-and-exits"
                  id="entrances-and-exits-link"
                >
                  Entrances and Exits.
                </a>
              </li>
              <li>
                <a className="underline" href="#paths" id="paths-link">
                  Indoor and Outdoor Paths.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#facilities"
                  id="facilities-link"
                >
                  Facilities and Services.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#information"
                  id="information-link"
                >
                  Information and Signage.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#emergencies"
                  id="emergencies-link"
                >
                  Safety and Emergencies.
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
                Annex III of the European Accessibility Act covers the built
                environment. This means the physical spaces where services are
                provided, such as buildings, walkways, and facilities.
              </p>

              <p>
                The accessibility of the built environment is optional, not
                mandatory. Member States can choose to include these
                requirements, but they don't have to.
              </p>

              <p>
                If Member States decide to require accessible built
                environments, they should follow the rules in Annex III. These
                rules make it easier for people with disabilities to access and
                use the services.
              </p>
            </div>
          </section>

          <section aria-labelledby="specific-requirements">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="specific-requirements"
              tabIndex={-1}
            >
              Specific Requirements.
            </h2>
            <div className="space-y-4">
              <p>The built environment needs to meet these key requirements:</p>

              <ul>
                <li>Use the spaces without special tools or assistance.</li>
                <li>Have information available in multiple formats.</li>
                <li>Include alternatives to visual information.</li>
                <li>Present visual information with proper contrast.</li>
                <li>
                  Allow for options to change how information is presented.
                </li>
                <li>Include alternatives to sound-based information.</li>
                <li>Have proper spacing for controls and features.</li>
                <li>Allow operation with limited strength or movement.</li>
                <li>Avoid triggering seizures.</li>
                <li>Protect privacy when using accessibility features.</li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="entrances-and-exits">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="entrances-and-exits"
              tabIndex={-1}
            >
              Entrances and Exits.
            </h2>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-2">
                Requirements for Accessible Entrances.
              </h3>
              <p>
                For people to enter and move through a building, these features
                should be made accessible:
              </p>
              <ul>
                <li>
                  Parking areas with accessible spaces close to entrances.
                </li>
                <li>Routes to the building that are accessible to everyone.</li>
                <li>Main entrances that people with disabilities can use.</li>
                <li>
                  Clear signs showing where accessible entrances are located.
                </li>
                <li>Door designs that are easy for everyone to use.</li>
                <li>Alternatives to revolving doors and turnstiles.</li>
                <li>
                  Entrances that are protected from weather when possible.
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Emergency Exits.
              </h3>
              <p>Emergency exits need to be accessible with these features:</p>
              <ul>
                <li>Clearly marked exits that are easy to find.</li>
                <li>Emergency exit routes without steps when possible.</li>
                <li>Safe waiting areas for people who need evacuation help.</li>
                <li>Emergency communication systems that work for everyone.</li>
                <li>Doors that can be opened easily during emergencies.</li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="paths">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="paths"
              tabIndex={-1}
            >
              Indoor and Outdoor Paths.
            </h2>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-2">
                Hallways and Corridors.
              </h3>
              <p>Indoor pathways should include:</p>
              <ul>
                <li>Wide enough paths for wheelchair users.</li>
                <li>Smooth, non-slip flooring.</li>
                <li>Good lighting throughout all areas.</li>
                <li>No objects sticking out that people might bump into.</li>
                <li>Resting areas for people who need them.</li>
                <li>Visual and tactile guides along routes.</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Stairs and Ramps.
              </h3>
              <p>For level changes:</p>
              <ul>
                <li>Ramps with proper slope for wheelchair users.</li>
                <li>Stairs with handrails on both sides.</li>
                <li>Visual markings on step edges.</li>
                <li>
                  Tactile warning surfaces at the top and bottom of stairs.
                </li>
                <li>Elevators as alternatives to stairs when needed.</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Outdoor Areas.
              </h3>
              <p>Outdoor spaces should include:</p>
              <ul>
                <li>Accessible paths connecting all important areas.</li>
                <li>Even surfaces without hazards.</li>
                <li>Proper drainage to prevent puddles.</li>
                <li>Seating areas that are accessible to everyone.</li>
                <li>Shaded areas for protection from the sun.</li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="facilities">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="facilities"
              tabIndex={-1}
            >
              Facilities and Services.
            </h2>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-2">Service Areas.</h3>
              <p>For areas where services are provided:</p>
              <ul>
                <li>
                  Service counters at different heights for standing and seated
                  users.
                </li>
                <li>Waiting areas with accessible seating options.</li>
                <li>Queue management systems that work for everyone.</li>
                <li>
                  Assistive listening systems for people with hearing loss.
                </li>
                <li>Space for service animals to rest.</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">Restrooms.</h3>
              <p>Accessible restrooms need:</p>
              <ul>
                <li>At least one fully accessible restroom on each floor.</li>
                <li>Doors wide enough for wheelchairs.</li>
                <li>Enough space for wheelchair users to move around.</li>
                <li>Support rails near toilets.</li>
                <li>Sinks that wheelchair users can reach.</li>
                <li>Accessible mirrors, soap dispensers, and hand dryers.</li>
                <li>Emergency call systems.</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Interactive Elements.
              </h3>
              <p>For interactive devices and controls:</p>
              <ul>
                <li>Machines placed at heights that everyone can reach.</li>
                <li>Clear instructions that are easy to understand.</li>
                <li>Controls that can be used with limited hand strength.</li>
                <li>Interface options for people with different abilities.</li>
                <li>
                  Privacy screens for people entering personal information.
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="information">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="information"
              tabIndex={-1}
            >
              Information and Signage.
            </h2>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-2">Wayfinding.</h3>
              <p>To help people navigate:</p>
              <ul>
                <li>Clear, consistent signs throughout the building.</li>
                <li>Logical layout that is easy to understand.</li>
                <li>Tactile maps at key locations.</li>
                <li>Color-coding to help with navigation.</li>
                <li>Landmarks that help people orient themselves.</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Signage Standards.
              </h3>
              <p>Signs should have:</p>
              <ul>
                <li>Large, easy-to-read text.</li>
                <li>Good contrast between text and background.</li>
                <li>Braille and raised letters for important signs.</li>
                <li>Consistent placement at predictable heights.</li>
                <li>Non-glare surfaces and good lighting.</li>
                <li>Universal symbols that are widely recognized.</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Digital Information.
              </h3>
              <p>For digital displays and information:</p>
              <ul>
                <li>Screens positioned where everyone can see them.</li>
                <li>Text large enough to read from a distance.</li>
                <li>Audio announcements to supplement visual information.</li>
                <li>
                  Information available through mobile devices when possible.
                </li>
                <li>
                  Interactive displays that work for people with disabilities.
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="emergencies">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="emergencies"
              tabIndex={-1}
            >
              Safety and Emergencies.
            </h2>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-2">Alarm Systems.</h3>
              <p>For emergency notifications:</p>
              <ul>
                <li>Both visual and audible alarm signals.</li>
                <li>Flashing lights visible throughout the building.</li>
                <li>Alarm sounds that can be heard everywhere.</li>
                <li>Vibrating alert options where appropriate.</li>
                <li>Clear instructions about what to do in emergencies.</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Evacuation Planning.
              </h3>
              <p>Emergency plans should include:</p>
              <ul>
                <li>Multiple evacuation routes that are accessible.</li>
                <li>Clear emergency exit signs with tactile information.</li>
                <li>Evacuation chairs on upper floors.</li>
                <li>Areas of refuge where people can wait safely for help.</li>
                <li>Training for staff on helping people with disabilities.</li>
                <li>Regular drills that include everyone.</li>
              </ul>
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
                The built environment requirements come from Annex III of the
                European Accessibility Act.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Directive (EU) 2019/882 - Annex III.</strong> The
                  accessibility of the built environment. This annex describes
                  how to make physical spaces accessible.
                </li>
              </ul>
              <p>
                For the full legal text, please refer to the official{' '}
                <a
                  href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32019L0882"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                  aria-labelledby="official-directive-link-4-3"
                >
                  <span id="official-directive-link-4-3" className="sr-only">
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
                  href={ANNEXES_LINKS.IMPLEMENTATION_EXAMPLES.fullPath}
                  className="no-underline"
                  aria-labelledby="prev-chapter-label"
                >
                  <ArrowRight
                    size={16}
                    className="rotate-180 mr-1"
                    aria-hidden="true"
                  />
                  <span id="prev-chapter-label">
                    Annex II: Implementation Examples.
                  </span>
                </Link>
              </Button>
              <Button asChild id="next-chapter-button">
                <Link
                  href={ANNEXES_LINKS.DISPROPORTIONATE_BURDEN.fullPath}
                  className="no-underline"
                  aria-labelledby="next-chapter-label"
                >
                  <span id="next-chapter-label">
                    Annex IV: Disproportionate Burden Assessment.
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
