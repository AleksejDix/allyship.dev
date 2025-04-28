import React from 'react'
import { Metadata } from 'next'
import { ChapterNavigation } from '../../components/ChapterNavigation'

export const metadata: Metadata = {
  title:
    'Sector-Specific Accessibility Requirements | European Accessibility Act',
  description:
    'Detailed accessibility requirements for specific sectors under the European Accessibility Act, including telecommunications, media, banking, transportation, and e-commerce.',
}

export default function SectorRequirementsPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 id="page-title" className="text-4xl font-bold mb-[23px]">
            Sector-Specific Requirements.
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
                  href="#electronic-communications"
                  id="electronic-communications-link"
                >
                  Electronic Communications.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#audiovisual-media"
                  id="audiovisual-media-link"
                >
                  Audiovisual Media.
                </a>
              </li>
              <li>
                <a className="underline" href="#e-books" id="e-books-link">
                  E-Books.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#e-commerce"
                  id="e-commerce-link"
                >
                  E-Commerce.
                </a>
              </li>
              <li>
                <a className="underline" href="#banking" id="banking-link">
                  Banking.
                </a>
              </li>
              <li>
                <a className="underline" href="#transport" id="transport-link">
                  Transport.
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
                The European Accessibility Act includes specific accessibility
                requirements for various sectors based on their unique services
                and products. While all sectors must comply with the general
                requirements, these sector-specific rules address the unique
                accessibility needs in each domain.
              </p>
              <p>
                These requirements ensure that persons with disabilities can
                access specialized services across all sectors covered by the
                EAA with the same level of access as all other users.
              </p>
            </div>
          </section>

          <section aria-labelledby="electronic-communications">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="electronic-communications"
              tabIndex={-1}
            >
              Electronic Communications.
            </h2>
            <div className="space-y-4">
              <p>
                Electronic communication services, including telephone, video,
                and messaging services, must:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Provide real-time text capability</strong> alongside
                  voice communications, allowing users to communicate through
                  text in real time during calls
                </li>
                <li>
                  <strong>Support total conversation services</strong> when
                  providing both voice and video, enabling simultaneous voice,
                  text, and video communication in one conversation
                </li>
                <li>
                  <strong>Ensure synchronized voice, text, and video</strong>{' '}
                  for emergency communications, making emergency services
                  accessible to people with hearing or speech disabilities
                </li>
                <li>
                  <strong>Make user interfaces accessible</strong> for people
                  with various disabilities to initiate, receive, and end
                  communications
                </li>
                <li>
                  <strong>Support assistive technologies</strong> including
                  hearing aids, telecoils, cochlear implants, and assistive
                  listening devices
                </li>
                <li>
                  <strong>Provide accessibility information</strong> about
                  service compatibility with assistive technologies
                </li>
              </ul>
              <p>
                These requirements ensure that people with disabilities can
                communicate effectively using electronic communication services,
                which are essential for daily life, emergency access, and social
                participation.
              </p>
            </div>
          </section>

          <section aria-labelledby="audiovisual-media">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="audiovisual-media"
              tabIndex={-1}
            >
              Audiovisual Media.
            </h2>
            <div className="space-y-4">
              <p>
                Services providing access to audiovisual media (streaming
                platforms, TV services, etc.) must:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Provide accessible electronic program guides</strong>{' '}
                  that are perceivable, operable, understandable, and robust for
                  users with disabilities
                </li>
                <li>
                  <strong>Ensure complete transmission</strong> of accessibility
                  features (subtitles, audio description, spoken subtitles, sign
                  language interpretation) from content providers to end users
                </li>
                <li>
                  <strong>Make user interfaces accessible</strong> so that
                  people with disabilities can find, select, and view
                  audiovisual content
                </li>
                <li>
                  <strong>
                    Provide information about accessibility features
                  </strong>{' '}
                  available for specific content, helping users find accessible
                  programming
                </li>
                <li>
                  <strong>Make mobile applications accessible</strong> for
                  accessing audiovisual content on mobile devices
                </li>
                <li>
                  <strong>Support content navigation</strong> through accessible
                  menus, search functions, and content guides
                </li>
              </ul>
              <p>
                These requirements ensure that people with disabilities can
                find, access, and enjoy audiovisual content including television
                programs, movies, and streaming media.
              </p>
            </div>
          </section>

          <section aria-labelledby="e-books">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="e-books"
              tabIndex={-1}
            >
              E-Books.
            </h2>
            <div className="space-y-4">
              <p>E-book services and providers must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Provide e-books in accessible formats</strong> with
                  proper structure, content, and flexibility to accommodate
                  different user needs
                </li>
                <li>
                  <strong>Ensure digital files support</strong> proper
                  formatting, content navigation, layout, and flexibility
                </li>
                <li>
                  <strong>Include accessibility metadata</strong> to help users
                  identify accessible features before purchasing or accessing
                  content
                </li>
                <li>
                  <strong>Protect accessibility features</strong> when
                  implementing technical protection measures (like digital
                  rights management systems)
                </li>
                <li>
                  <strong>Make e-book platforms accessible</strong> so users
                  with disabilities can browse, purchase, download, and read
                  content
                </li>
                <li>
                  <strong>Support assistive technologies</strong> including
                  screen readers, refreshable braille displays, and other
                  reading tools
                </li>
                <li>
                  <strong>Allow content customization</strong> including font
                  size, spacing, color, contrast, and layout adjustments
                </li>
              </ul>
              <p>
                These requirements ensure that people with disabilities have
                equal access to literature, educational materials, and other
                written content in digital formats.
              </p>
            </div>
          </section>

          <section aria-labelledby="e-commerce">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="e-commerce"
              tabIndex={-1}
            >
              E-Commerce.
            </h2>
            <div className="space-y-4">
              <p>
                E-commerce services, including online stores and marketplaces,
                must:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Provide accessible identification methods</strong> for
                  creating accounts, logging in, and authenticating users
                </li>
                <li>
                  <strong>Make payment processes accessible</strong> with clear
                  instructions and feedback for all stages of transactions
                </li>
                <li>
                  <strong>Implement accessible security measures</strong> that
                  don't create barriers for people with disabilities
                </li>
                <li>
                  <strong>Provide product accessibility information</strong> to
                  help customers understand whether products meet their
                  accessibility needs
                </li>
                <li>
                  <strong>Make digital shopping interfaces accessible</strong>{' '}
                  for browsing products, reading descriptions, comparing
                  options, and completing purchases
                </li>
                <li>
                  <strong>Ensure product search and filtering</strong> functions
                  are accessible to help users find appropriate products
                </li>
                <li>
                  <strong>Make customer service accessible</strong> through
                  multiple communication channels
                </li>
              </ul>
              <p>
                These requirements ensure that people with disabilities can shop
                online independently, access product information, complete
                transactions, and receive customer support.
              </p>
            </div>
          </section>

          <section aria-labelledby="banking">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="banking"
              tabIndex={-1}
            >
              Banking.
            </h2>
            <div className="space-y-4">
              <p>
                Banking services, including consumer banking and financial
                services, must:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Provide accessible identification methods</strong> for
                  online and mobile banking
                </li>
                <li>
                  <strong>Make electronic document signing accessible</strong>{' '}
                  for contracts and transactions
                </li>
                <li>
                  <strong>Implement accessible security features</strong> that
                  work for people with different abilities
                </li>
                <li>
                  <strong>Ensure banking information is understandable</strong>,
                  not exceeding upper intermediate reading level (approximately
                  B2 level)
                </li>
                <li>
                  <strong>Make banking interfaces accessible</strong> for
                  checking balances, transferring funds, paying bills, and
                  managing accounts
                </li>
                <li>
                  <strong>Ensure ATMs are accessible</strong> with features like
                  text-to-speech, tactile keypads, and headphone jacks
                </li>
                <li>
                  <strong>Provide accessible financial documents</strong>{' '}
                  including statements, contracts, and notices
                </li>
                <li>
                  <strong>Offer accessible customer support</strong> through
                  multiple communication channels
                </li>
              </ul>
              <p>
                These requirements ensure that people with disabilities can
                independently manage their finances, access banking services,
                and complete financial transactions securely.
              </p>
            </div>
          </section>

          <section aria-labelledby="transport">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="transport"
              tabIndex={-1}
            >
              Transport.
            </h2>
            <div className="space-y-4">
              <p>
                Air, bus, rail, and waterborne passenger transport services
                must:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Provide accessible websites and mobile apps</strong>{' '}
                  for information, booking, check-in, and ticketing
                </li>
                <li>
                  <strong>Make self-service terminals accessible</strong>,
                  including ticketing machines, check-in kiosks, and payment
                  terminals
                </li>
                <li>
                  <strong>
                    Provide accessible real-time travel information
                  </strong>{' '}
                  about schedules, delays, platform changes, and service
                  disruptions
                </li>
                <li>
                  <strong>
                    Ensure electronic ticketing and boarding passes
                  </strong>{' '}
                  are accessible to people with different disabilities
                </li>
                <li>
                  <strong>Make information about accessibility features</strong>{' '}
                  of transport services and vehicles easily available
                </li>
                <li>
                  <strong>Provide booking systems</strong> that allow people to
                  specify accessibility needs
                </li>
                <li>
                  <strong>Ensure identification and payment systems</strong>{' '}
                  used during travel are accessible
                </li>
              </ul>
              <p>
                These requirements ensure that people with disabilities can plan
                trips, purchase tickets, check in, board vehicles, and receive
                important travel information independently.
              </p>
              <p>
                Note that these requirements cover digital services related to
                transportation. Physical accessibility of stations, vehicles,
                and infrastructure is covered by other EU legislation.
              </p>
            </div>
          </section>

          <footer>
            <ChapterNavigation currentPageId="2.4-sector-specific" />
          </footer>
        </div>
      </div>
    </section>
  )
}
