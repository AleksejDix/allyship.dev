import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, List, ExternalLink } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { INTRODUCTION_LINKS, ANNEXES_LINKS } from '../../constants/links'

export const metadata: Metadata = {
  title: 'Annex II: Implementation Examples | European Accessibility Act',
  description:
    'Examples of how to implement accessibility requirements under the European Accessibility Act (EAA), as outlined in Annex II.',
}

export default function ImplementationExamplesPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 className="text-4xl font-bold mb-[23px]">
            Annex II: Implementation Examples
          </h1>

          <nav aria-labelledby="page-sections-heading">
            <h2 id="page-sections-heading" className="sr-only">
              Page sections
            </h2>
            <ul className="space-y-1 text-lg">
              <li>
                <a className="underline" href="#overview" id="overview-link">
                  Overview of Annex II
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#legal-status"
                  id="legal-status-link"
                >
                  Legal Status of Examples
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#general-implementation"
                  id="general-implementation-link"
                >
                  General Implementation Examples
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#product-specific"
                  id="product-specific-link"
                >
                  Product-Specific Examples
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#service-specific"
                  id="service-specific-link"
                >
                  Service-Specific Examples
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#technical-solutions"
                  id="technical-solutions-link"
                >
                  Technical Solutions
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#practical-application"
                  id="practical-application-link"
                >
                  Practical Application
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#limitations"
                  id="limitations-link"
                >
                  Limitations and Considerations
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#relationship"
                  id="relationship-link"
                >
                  Relationship with Other EAA Sections
                </a>
              </li>
              <li>
                <a className="underline" href="#resources" id="resources-link">
                  Additional Resources
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
              Overview of Annex II
            </h2>
            <div className="space-y-4">
              <p>
                Annex II of the European Accessibility Act (EAA) provides
                non-binding examples of possible solutions that contribute to
                meeting the accessibility requirements outlined in Annex I.
                These examples serve as practical guidance for economic
                operators implementing the EAA.
              </p>
              <p>
                While these examples illustrate ways to achieve compliance, they
                are not exhaustive nor mandatory. Economic operators can choose
                alternative approaches to meet the requirements, provided they
                achieve equivalent or better accessibility outcomes.
              </p>
              <p>
                This page presents these examples organized by product and
                service categories, along with additional context and
                explanations to help with practical implementation.
              </p>
            </div>
          </section>

          <section aria-labelledby="legal-status">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="legal-status"
              tabIndex={-1}
            >
              Legal Status of Examples
            </h2>
            <div className="space-y-4">
              <p>
                It's important to understand the legal status of the examples in
                Annex II:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Non-binding guidance:</strong> The examples provided
                  are illustrative, not prescriptive requirements
                </li>
                <li>
                  <strong>Alternative approaches:</strong> Economic operators
                  can implement different solutions that meet the accessibility
                  requirements
                </li>
                <li>
                  <strong>Minimum standards:</strong> The examples represent
                  viable approaches but may not represent the most advanced
                  accessibility solutions available
                </li>
                <li>
                  <strong>Evolutionary nature:</strong> As technology and
                  accessibility best practices evolve, better approaches may
                  emerge
                </li>
              </ul>
              <p>
                When evaluating compliance, market surveillance authorities will
                assess whether the accessibility requirements are met, not
                whether specific examples from Annex II were followed.
              </p>
            </div>
          </section>

          <section aria-labelledby="general-implementation">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="general-implementation"
              tabIndex={-1}
            >
              General Implementation Examples
            </h2>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mt-6 mb-2">
                Information Provision
              </h3>
              <p>
                Annex II provides examples for making information accessible:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Visual information:</strong> Providing text
                  alternatives that can be recognized by assistive technologies,
                  such as screen readers
                </li>
                <li>
                  <strong>Non-text content:</strong> Providing captions for
                  pre-recorded audio content and audio description for
                  pre-recorded video content
                </li>
                <li>
                  <strong>Text alternatives:</strong> Making electronic files
                  readable through assistive technology using proper structure,
                  formatting, and meaningful sequence
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                User Interface and Design
              </h3>
              <p>For making user interfaces accessible, examples include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Keyboard operability:</strong> Making all
                  functionality available through keyboard interfaces, including
                  for actions that typically require complex gestures
                </li>
                <li>
                  <strong>User control:</strong> Providing user control for any
                  automatic changes of content, automatic scrolling, or time
                  limits on reading
                </li>
                <li>
                  <strong>Customization:</strong> Making font size, color
                  contrast, and layout adjustable to enhance readability
                </li>
                <li>
                  <strong>Alternatives to color:</strong> Using means other than
                  color alone to convey information or indicate an action
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Support Services
              </h3>
              <p>Annex II also covers support services:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Accessible documentation:</strong> Providing product
                  documentation in accessible electronic formats
                </li>
                <li>
                  <strong>Alternative means:</strong> Offering support through
                  multiple channels (e.g., text, voice, video) to accommodate
                  different communication needs
                </li>
                <li>
                  <strong>Clear information:</strong> Ensuring support services
                  provide information about the product's accessibility features
                  and compatibility with assistive technologies
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="product-specific">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="product-specific"
              tabIndex={-1}
            >
              Product-Specific Implementation Examples
            </h2>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mt-6 mb-2">
                Consumer Computer Hardware and Operating Systems
              </h3>
              <p>
                Examples for computer hardware and operating systems include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Hardware identification:</strong> Providing tactile
                  markings on keys and controls to enable identification by
                  touch
                </li>
                <li>
                  <strong>Operating system interfaces:</strong> Offering
                  text-to-speech functionality, screen reader support, and
                  screen magnification
                </li>
                <li>
                  <strong>Adaptive interfaces:</strong> Including options for
                  slowing down key repeat rates and adjusting keyboard response
                  times
                </li>
                <li>
                  <strong>Alternative input methods:</strong> Supporting speech
                  recognition, eye tracking, or head tracking as alternatives to
                  keyboard and mouse
                </li>
                <li>
                  <strong>Integration with assistive technology:</strong>{' '}
                  Providing standard connection ports for assistive technology
                  devices
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Self-Service Terminals
              </h3>
              <p>
                For self-service terminals (ATMs, ticketing machines, etc.),
                examples include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Voice output:</strong> Providing spoken instructions
                  and feedback when a user interacts with the device
                </li>
                <li>
                  <strong>Physical accessibility:</strong> Allowing for
                  headphone connection to receive voice guidance privately and
                  securely
                </li>
                <li>
                  <strong>Input flexibility:</strong> Allowing users to adjust
                  the time during which inputs are valid, or to confirm inputs
                  before finalizing
                </li>
                <li>
                  <strong>Visual customization:</strong> Offering high contrast
                  display modes and visibility enhancement options
                </li>
                <li>
                  <strong>Operational consistency:</strong> Ensuring that
                  keypads have a standard layout with tactile indicators
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">E-Readers</h3>
              <p>For e-readers, examples of implementation include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Text-to-speech:</strong> Providing functionality to
                  convert text to spoken output
                </li>
                <li>
                  <strong>Content access:</strong> Ensuring that protection
                  measures (e.g., DRM) do not block accessibility features
                </li>
                <li>
                  <strong>Text customization:</strong> Allowing users to modify
                  font, size, spacing, and color contrast
                </li>
                <li>
                  <strong>Navigation:</strong> Supporting keyboard navigation
                  and structured content to enable navigation by chapter,
                  section, or page
                </li>
                <li>
                  <strong>Dictionary integration:</strong> Providing built-in
                  dictionaries to support users with learning disabilities
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Smart Devices and Mobile Equipment
              </h3>
              <p>For smartphones, tablets, and other smart devices:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Real-time text capability:</strong> Enabling text
                  communication in real-time during voice calls
                </li>
                <li>
                  <strong>High-quality audio:</strong> Supporting crystal-clear
                  audio for better understanding of speech
                </li>
                <li>
                  <strong>Visual relay services:</strong> Enabling video
                  communication to allow for sign language
                </li>
                <li>
                  <strong>Predictive text input:</strong> Providing intelligent
                  word prediction to reduce typing effort
                </li>
                <li>
                  <strong>Haptic feedback:</strong> Using vibration patterns to
                  convey information and confirmations
                </li>
                <li>
                  <strong>Built-in accessibility:</strong> Including screen
                  readers, voice control, switch control, and other
                  accessibility features
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="service-specific">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="service-specific"
              tabIndex={-1}
            >
              Service-Specific Implementation Examples
            </h2>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mt-6 mb-2">
                E-Commerce Services
              </h3>
              <p>Examples for e-commerce platforms include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Accessible product information:</strong> Providing
                  detailed, accessible product descriptions including text
                  alternatives for images
                </li>
                <li>
                  <strong>Shopping cart procedures:</strong> Ensuring checkout
                  processes are navigable by keyboard and screen readers
                </li>
                <li>
                  <strong>Form identification:</strong> Clearly labeling form
                  fields and providing error identification and correction
                  suggestions
                </li>
                <li>
                  <strong>Order confirmation:</strong> Providing order
                  confirmations in accessible formats with clear structure
                </li>
                <li>
                  <strong>Product filters:</strong> Including accessible
                  filtering options for product searches
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Banking Services
              </h3>
              <p>For banking services, Annex II examples include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Authentication methods:</strong> Offering multiple
                  accessible authentication options
                </li>
                <li>
                  <strong>Statement access:</strong> Providing bank statements
                  in accessible electronic formats
                </li>
                <li>
                  <strong>Transaction verification:</strong> Ensuring that
                  security verification steps are accessible
                </li>
                <li>
                  <strong>Mobile banking:</strong> Designing mobile apps with
                  accessibility features and compatibility with assistive
                  technology
                </li>
                <li>
                  <strong>Consistent navigation:</strong> Maintaining consistent
                  layouts and navigation patterns across digital banking
                  services
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Audiovisual Media Services
              </h3>
              <p>For television and streaming services:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Electronic program guides:</strong> Making program
                  information accessible to screen readers
                </li>
                <li>
                  <strong>Closed captions:</strong> Providing user-customizable
                  captions for all audiovisual content
                </li>
                <li>
                  <strong>Audio description:</strong> Offering audio tracks that
                  describe visual content for viewers with visual impairments
                </li>
                <li>
                  <strong>Sign language:</strong> Supporting sign language
                  interpretation for key content
                </li>
                <li>
                  <strong>User controls:</strong> Providing accessible
                  mechanisms to enable, disable, or adjust accessibility
                  features
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">E-Books</h3>
              <p>Implementation examples for e-book services include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Metadata:</strong> Including accessibility metadata to
                  help users find accessible content
                </li>
                <li>
                  <strong>Content structure:</strong> Using proper heading
                  structure, table of contents, and navigation markers
                </li>
                <li>
                  <strong>Image descriptions:</strong> Providing alternative
                  text for all informative images
                </li>
                <li>
                  <strong>MathML:</strong> Using Mathematical Markup Language
                  for accessible representation of mathematical formulas
                </li>
                <li>
                  <strong>EPUB format:</strong> Providing content in EPUB3
                  format with accessibility features enabled
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Transport Services
              </h3>
              <p>For transport-related e-services:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Journey planning:</strong> Providing accessible
                  information about accessible routes, stations, and connection
                  points
                </li>
                <li>
                  <strong>Ticketing services:</strong> Ensuring that online
                  ticket purchasing and digital tickets are accessible
                </li>
                <li>
                  <strong>Travel updates:</strong> Delivering real-time
                  information about delays or changes in accessible formats
                </li>
                <li>
                  <strong>Map services:</strong> Providing accessible map
                  interfaces with text-based location information
                </li>
                <li>
                  <strong>Booking assistance:</strong> Making it easy to book
                  special assistance through accessible interfaces
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="technical-solutions">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="technical-solutions"
              tabIndex={-1}
            >
              Technical Implementation Solutions
            </h2>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mt-6 mb-2">
                Web Accessibility
              </h3>
              <p>
                Annex II references several technical approaches for web
                content:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Semantic HTML:</strong> Using appropriate HTML
                  elements for their intended purpose (headings, lists, tables,
                  forms)
                </li>
                <li>
                  <strong>ARIA landmarks:</strong> Using ARIA roles to identify
                  regions of a page (navigation, main content, search)
                </li>
                <li>
                  <strong>Focus management:</strong> Ensuring visible focus
                  indicators and logical focus order
                </li>
                <li>
                  <strong>Form validation:</strong> Providing clear error
                  messages and suggestions for correction
                </li>
                <li>
                  <strong>Responsive design:</strong> Creating layouts that
                  adapt to different screen sizes and zoom levels
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Mobile Applications
              </h3>
              <p>For mobile apps, examples include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Platform accessibility APIs:</strong> Using the native
                  accessibility frameworks (iOS UIAccessibility, Android
                  AccessibilityService)
                </li>
                <li>
                  <strong>Touch target size:</strong> Making interactive
                  elements large enough for users with motor impairments
                </li>
                <li>
                  <strong>Gesture alternatives:</strong> Providing alternative
                  means to perform actions that typically require complex
                  gestures
                </li>
                <li>
                  <strong>Screen orientation:</strong> Supporting both portrait
                  and landscape orientations
                </li>
                <li>
                  <strong>Consistent navigation:</strong> Maintaining
                  predictable patterns across the application
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Document Formats
              </h3>
              <p>For electronic documents:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Tagged PDF:</strong> Creating PDFs with proper
                  structure tags for headings, lists, tables, and reading order
                </li>
                <li>
                  <strong>Word processing:</strong> Using built-in heading
                  styles, alternative text for images, and proper table
                  structure
                </li>
                <li>
                  <strong>Spreadsheets:</strong> Adding header rows, avoiding
                  blank cells for formatting, and providing text alternatives
                  for charts
                </li>
                <li>
                  <strong>Presentations:</strong> Using unique slide titles,
                  adding alternative text for images, and ensuring high contrast
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="practical-application">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="practical-application"
              tabIndex={-1}
            >
              Practical Application of Examples
            </h2>
            <div className="space-y-4">
              <p>
                When applying the examples from Annex II, economic operators
                should:
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Consider Context
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Adapt examples to the specific context and purpose of the
                  product or service
                </li>
                <li>
                  Consider how examples apply to different types of content
                  within the same product (e.g., text, images, interactive
                  elements)
                </li>
                <li>
                  Evaluate how examples might need adjustment for
                  industry-specific applications
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Follow Technical Standards
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Align implementation with recognized international standards
                  like WCAG for web content
                </li>
                <li>
                  Leverage platform-specific accessibility guidelines for mobile
                  and desktop applications
                </li>
                <li>
                  Consider harmonized standards that provide presumption of
                  conformity with the EAA
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Test with Real Users
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Validate implementations with people who use assistive
                  technologies
                </li>
                <li>
                  Include users with different disabilities in testing and
                  feedback processes
                </li>
                <li>
                  Use this feedback to refine and improve accessibility
                  implementations
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Document Implementation Approaches
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Record which examples from Annex II were followed and how they
                  were implemented
                </li>
                <li>
                  Document any alternative approaches used to meet accessibility
                  requirements
                </li>
                <li>
                  Maintain this documentation as part of the technical file for
                  conformity assessment
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="limitations">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="limitations"
              tabIndex={-1}
            >
              Limitations and Considerations
            </h2>
            <div className="space-y-4">
              <p>
                While the examples in Annex II provide valuable guidance, there
                are important limitations to consider:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Not comprehensive:</strong> The examples don't cover
                  every possible accessibility scenario or requirement
                </li>
                <li>
                  <strong>Technology evolution:</strong> As technology advances,
                  better approaches to accessibility may emerge beyond what's
                  described in Annex II
                </li>
                <li>
                  <strong>Minimum vs. optimal:</strong> The examples represent
                  viable approaches but not necessarily the most optimal
                  solutions for all contexts
                </li>
                <li>
                  <strong>Integration challenges:</strong> Real-world
                  implementation often requires integrating multiple examples
                  and approaches
                </li>
                <li>
                  <strong>Diverse user needs:</strong> Users with different
                  disabilities may have different or even conflicting
                  accessibility needs
                </li>
              </ul>
              <p>
                Economic operators should view Annex II as a starting point, not
                an exhaustive guide to all accessibility solutions.
              </p>
            </div>
          </section>

          <section aria-labelledby="relationship">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="relationship"
              tabIndex={-1}
            >
              Relationship with Other EAA Sections
            </h2>
            <div className="space-y-4">
              <p>
                Understanding how Annex II relates to other parts of the EAA is
                important:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Annex I:</strong> The examples in Annex II directly
                  correspond to the mandatory requirements in Annex I, providing
                  practical ways to implement them
                </li>
                <li>
                  <strong>Annex III:</strong> When considering the built
                  environment, examples from Annex II may need to be adapted or
                  extended
                </li>
                <li>
                  <strong>Annex IV:</strong> When assessing disproportionate
                  burden, the examples in Annex II can help identify reasonable
                  implementation approaches
                </li>
                <li>
                  <strong>Annex V:</strong> The conformity assessment process
                  should consider how effectively the examples or equivalent
                  solutions have been implemented
                </li>
                <li>
                  <strong>Fundamental alteration:</strong> When considering
                  whether accessibility would require fundamental alteration,
                  comparing with Annex II examples can help determine what
                  constitutes reasonable adaptation
                </li>
              </ul>
              <p>
                Annex II serves as a bridge between the legal requirements and
                practical implementation, helping economic operators understand
                how to apply the EAA in real-world contexts.
              </p>
            </div>
          </section>

          <section aria-labelledby="resources">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="resources"
              tabIndex={-1}
            >
              Additional Resources and References
            </h2>
            <div className="space-y-4">
              <p>Beyond Annex II, economic operators can consult:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Harmonized standards:</strong> Standards that provide
                  presumption of conformity with the EAA
                </li>
                <li>
                  <strong>International guidelines:</strong> Resources like the
                  Web Content Accessibility Guidelines (WCAG) and WAI-ARIA
                </li>
                <li>
                  <strong>Industry guidance:</strong> Sector-specific
                  accessibility resources published by industry associations
                </li>
                <li>
                  <strong>Platform guidelines:</strong> Accessibility
                  documentation provided by major platform vendors (Apple,
                  Google, Microsoft)
                </li>
                <li>
                  <strong>EU guidance:</strong> Additional guidance documents
                  published by the European Commission and related bodies
                </li>
              </ul>
              <p>
                These resources can help expand on the examples provided in
                Annex II, offering more detailed technical guidance and
                industry-specific applications.
              </p>
            </div>
          </section>

          <section aria-labelledby="references">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="references"
              tabIndex={-1}
            >
              References
            </h2>
            <div className="space-y-4">
              <p>
                The implementation examples discussed on this page are drawn
                directly from Annex II of the European Accessibility Act.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Directive (EU) 2019/882 - Annex II:</strong>{' '}
                  Indicative Non-Binding Examples of Possible Solutions That
                  Contribute to Meeting the Accessibility Requirements in Annex
                  I. This annex provides practical examples for achieving
                  compliance.
                </li>
              </ul>
              <p>
                For the full legal text and context, please refer to the
                official{' '}
                <a
                  href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32019L0882"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                  aria-labelledby="official-directive-link-4-2"
                >
                  <span id="official-directive-link-4-2" className="sr-only">
                    Directive (EU) 2019/882 (opens in new window)
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
              className="flex justify-end items-center mt-10 pt-4 border-t"
              aria-labelledby="footer-nav-heading"
            >
              <h2 id="footer-nav-heading" className="sr-only">
                Chapter navigation
              </h2>
              <Button asChild id="next-chapter-button">
                <Link
                  href={ANNEXES_LINKS.BUILT_ENVIRONMENT.fullPath}
                  className="no-underline"
                  aria-labelledby="next-chapter-label"
                >
                  <span id="next-chapter-label">
                    Annex III: Built Environment
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
