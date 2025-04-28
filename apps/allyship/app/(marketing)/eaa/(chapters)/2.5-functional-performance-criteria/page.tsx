import React from 'react'
import { Metadata } from 'next'
import { ChapterNavigation } from '../../components/ChapterNavigation'

export const metadata: Metadata = {
  title: 'Functional Performance Criteria | European Accessibility Act',
  description:
    'Understanding the functional performance criteria in the European Accessibility Act that ensure products and services are usable by people with different disabilities.',
}

export default function FunctionalPerformancePage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 id="page-title" className="text-4xl font-bold mb-[23px]">
            Functional Performance Criteria.
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
                  href="#visual-disabilities"
                  id="visual-disabilities-link"
                >
                  Visual Disabilities.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#hearing-disabilities"
                  id="hearing-disabilities-link"
                >
                  Hearing Disabilities.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#physical-disabilities"
                  id="physical-disabilities-link"
                >
                  Physical Disabilities.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#cognitive-disabilities"
                  id="cognitive-disabilities-link"
                >
                  Cognitive Disabilities.
                </a>
              </li>
              <li>
                <a className="underline" href="#privacy" id="privacy-link">
                  Privacy Considerations.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#implementation"
                  id="implementation-link"
                >
                  Implementation Approach.
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
                The Functional Performance Criteria (FPC) are a crucial part of
                <strong> Annex I</strong> of the European Accessibility Act.
                They define outcomes that products and services must achieve to
                be considered accessible to people with disabilities.
              </p>
              <p>
                These criteria ensure that regardless of specific disability,
                all users can effectively interact with products and services
                through at least one accessible method for each function.
              </p>
              <p>
                The FPC serve as a framework when specific technical
                requirements don't fully address all product or service
                features. They help organizations understand the goals of
                accessibility even when detailed technical specifications aren't
                available.
              </p>
            </div>
          </section>

          <section aria-labelledby="visual-disabilities">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="visual-disabilities"
              tabIndex={-1}
            >
              Visual Disabilities.
            </h2>
            <div className="space-y-4">
              <p>
                Products and services must be operable and usable by people with
                the following visual disabilities:
              </p>
              <ul className="list-disc pl-6 space-y-4">
                <li>
                  <strong>Without Vision</strong>
                  <p className="mt-2">
                    Products and services must provide at least one mode of
                    operation that doesn't require vision. This includes:
                  </p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Text-to-speech for textual content</li>
                    <li>Tactile controls and feedback</li>
                    <li>Audio descriptions for visual content</li>
                    <li>Compatibility with screen readers</li>
                    <li>Alternative formats such as braille or audio</li>
                  </ul>
                </li>
                <li>
                  <strong>With Limited Vision</strong>
                  <p className="mt-2">
                    Products and services must provide at least one mode of
                    operation that accommodates users with limited vision. This
                    includes:
                  </p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Magnification without loss of content or functionality
                    </li>
                    <li>Adjustable font sizes</li>
                    <li>Flexible spacing and formatting</li>
                    <li>Adjustable brightness and contrast</li>
                    <li>Alternative color schemes</li>
                  </ul>
                </li>
                <li>
                  <strong>Without Color Perception</strong>
                  <p className="mt-2">
                    Products and services must provide at least one mode of
                    operation that doesn't require user color perception. This
                    includes:
                  </p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Never using color alone to convey information</li>
                    <li>
                      Providing text alternatives for color-coded information
                    </li>
                    <li>Using patterns or shapes in addition to color</li>
                    <li>
                      Ensuring adequate contrast between text and background
                    </li>
                    <li>Allowing user customization of color schemes</li>
                  </ul>
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="hearing-disabilities">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="hearing-disabilities"
              tabIndex={-1}
            >
              Hearing Disabilities.
            </h2>
            <div className="space-y-4">
              <p>
                Products and services must be operable and usable by people with
                the following hearing disabilities:
              </p>
              <ul className="list-disc pl-6 space-y-4">
                <li>
                  <strong>Without Hearing</strong>
                  <p className="mt-2">
                    Products and services must provide at least one mode of
                    operation that doesn't require hearing. This includes:
                  </p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Visual or tactile alternatives to audio signals</li>
                    <li>Captions for audio content</li>
                    <li>Sign language interpretation for spoken content</li>
                    <li>Text-based communication alternatives</li>
                    <li>Visual notifications for alerts and warnings</li>
                  </ul>
                </li>
                <li>
                  <strong>With Limited Hearing</strong>
                  <p className="mt-2">
                    Products and services must provide at least one mode of
                    operation that accommodates users with limited hearing
                    abilities. This includes:
                  </p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Volume controls with amplification beyond standard levels
                    </li>
                    <li>Noise reduction for improved audio clarity</li>
                    <li>Frequency control to enhance speech comprehension</li>
                    <li>
                      Compatibility with hearing aids and cochlear implants
                    </li>
                    <li>
                      Options to separate foreground speech from background
                      sounds
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Without Vocal Capability</strong>
                  <p className="mt-2">
                    Products and services must provide at least one mode of
                    operation that doesn't require the user to generate vocal
                    sounds. This includes:
                  </p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Text or image-based inputs as alternatives to voice
                      commands
                    </li>
                    <li>Real-time text communication options</li>
                    <li>
                      Support for message composition using symbols or
                      prewritten text
                    </li>
                    <li>
                      Alternative ways to make selections and give commands
                    </li>
                    <li>
                      Support for sign language input via camera where
                      applicable
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="physical-disabilities">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="physical-disabilities"
              tabIndex={-1}
            >
              Physical Disabilities.
            </h2>
            <div className="space-y-4">
              <p>
                Products and services must be operable and usable by people with
                the following physical limitations:
              </p>
              <ul className="list-disc pl-6 space-y-4">
                <li>
                  <strong>With Limited Manipulation or Strength</strong>
                  <p className="mt-2">
                    Products and services must provide at least one mode of
                    operation that can be used by people with limited manual
                    dexterity, reach, or strength. This includes:
                  </p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Support for alternative input devices (switch controls,
                      eye tracking, etc.)
                    </li>
                    <li>
                      Voice control options for navigation and interaction
                    </li>
                    <li>Touch-free operation options</li>
                    <li>
                      Sequential key presses as alternatives to simultaneous key
                      combinations
                    </li>
                    <li>Adjustable timing for interactions</li>
                    <li>
                      Large, easy-to-press controls requiring minimal force
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>With Limited Reach</strong>
                  <p className="mt-2">
                    Products and services must accommodate users with limited
                    reach and those who might use assistive devices. This
                    includes:
                  </p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Placing interactive elements within accessible reach
                      ranges
                    </li>
                    <li>Allowing operation from multiple positions</li>
                    <li>Providing remote control options where applicable</li>
                    <li>Support for voice or proximity activation</li>
                    <li>
                      Ensuring compatibility with assistive reaching tools
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>With Photosensitive Seizures</strong>
                  <p className="mt-2">
                    Products and services must provide at least one mode of
                    operation that minimizes the potential for triggering
                    photosensitive seizures. This includes:
                  </p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Avoiding flashing content that exceeds safe thresholds
                    </li>
                    <li>
                      Providing options to disable animations and flashing
                      elements
                    </li>
                    <li>Allowing user control over visual stimuli</li>
                    <li>
                      Warning users about content that might trigger seizures
                    </li>
                    <li>
                      Offering alternative non-visual ways to access the same
                      functionality
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="cognitive-disabilities">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="cognitive-disabilities"
              tabIndex={-1}
            >
              Cognitive Disabilities.
            </h2>
            <div className="space-y-4">
              <p>
                Products and services must be operable and usable by people with
                cognitive limitations:
              </p>
              <ul className="list-disc pl-6 space-y-4">
                <li>
                  <strong>With Limited Cognitive Ability</strong>
                  <p className="mt-2">
                    Products and services must provide features that make them
                    easier to use for people with various cognitive, language,
                    and learning disabilities. This includes:
                  </p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Predictable and consistent patterns of interaction</li>
                    <li>Clear, simple language and instructions</li>
                    <li>Step-by-step guidance for complex processes</li>
                    <li>
                      Multiple ways to access and understand content (text,
                      audio, video)
                    </li>
                    <li>Reduced complexity and cognitive load</li>
                    <li>Error prevention and simple error correction</li>
                    <li>Minimal distractions</li>
                    <li>Support for extended time to complete tasks</li>
                    <li>Memory aids and reminders</li>
                    <li>
                      Options to customize displays to reduce cognitive overload
                    </li>
                  </ul>
                </li>
              </ul>
              <p>
                These requirements help make products and services more
                accessible to people with conditions such as intellectual
                disabilities, autism, dyslexia, ADHD, and memory impairments.
              </p>
            </div>
          </section>

          <section aria-labelledby="privacy">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="privacy"
              tabIndex={-1}
            >
              Privacy Considerations.
            </h2>
            <div className="space-y-4">
              <p>
                The EAA includes a specific functional performance criterion
                related to privacy:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Privacy When Using Accessibility Features</strong>
                  <p className="mt-2">
                    Products and services must provide at least one mode of
                    operation that maintains privacy when users are utilizing
                    accessibility features. This means:
                  </p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Accessibility features should not compromise user privacy
                    </li>
                    <li>
                      Personal headsets must be supported for private audio
                      output
                    </li>
                    <li>
                      Screen reader output should be available through
                      headphones
                    </li>
                    <li>
                      Visual information should be protected from onlookers when
                      needed
                    </li>
                    <li>
                      Authentication and identification methods must be
                      accessible without compromising security
                    </li>
                  </ul>
                </li>
              </ul>
              <p>
                This criterion recognizes that people using accessibility
                features should be able to maintain the same level of privacy as
                other users, particularly in public settings or when dealing
                with sensitive information.
              </p>
            </div>
          </section>

          <section aria-labelledby="implementation">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="implementation"
              tabIndex={-1}
            >
              Implementation Approach.
            </h2>
            <div className="space-y-4">
              <p>
                The functional performance criteria should be used as follows:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>As complementary requirements:</strong> If the
                  specific technical requirements in other sections of the EAA
                  don't adequately cover certain aspects of accessibility, the
                  functional performance criteria should be used to address
                  those gaps.
                </li>
                <li>
                  <strong>As guiding principles:</strong> When designing
                  products and services, these criteria provide a user-centered
                  perspective on accessibility goals, focusing on the outcomes
                  for people with disabilities rather than just technical
                  specifications.
                </li>
                <li>
                  <strong>For innovative solutions:</strong> When new
                  technologies emerge that aren't explicitly covered by existing
                  technical requirements, these criteria can guide the
                  implementation of accessible features.
                </li>
                <li>
                  <strong>For testing and validation:</strong> These criteria
                  can be used to validate that accessibility features truly meet
                  the needs of users with different disabilities.
                </li>
              </ul>
              <p>
                To meet these criteria, manufacturers and service providers
                should:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Consider the full range of user abilities in their design
                  process
                </li>
                <li>Incorporate multiple modes of operation and interaction</li>
                <li>Test with users who have different disabilities</li>
                <li>
                  Document how their products or services meet these performance
                  criteria
                </li>
                <li>
                  Update designs as new accessibility technologies and
                  approaches become available
                </li>
              </ul>
            </div>
          </section>

          <footer>
            <ChapterNavigation currentPageId="2.5-functional-performance-criteria" />
          </footer>
        </div>
      </div>
    </section>
  )
}
