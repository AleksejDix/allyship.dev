import React from 'react'
import { Metadata } from 'next'
import { ChapterNavigation } from '../../components/ChapterNavigation'

export const metadata: Metadata = {
  title: 'Foreword | European Accessibility Act Guide',
  description:
    'An introduction to the European Accessibility Act and how to navigate the complex landscape of digital accessibility compliance.',
}

export default async function ForewordPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 className="text-4xl font-bold mb-[23px]">Foreword.</h1>

          <nav aria-labelledby="page-sections-heading">
            <h2 id="page-sections-heading" className="sr-only">
              Page sections.
            </h2>
            <ul className="space-y-1 text-lg">
              <li>
                <a
                  className="underline"
                  href="#introduction"
                  id="introduction-link"
                >
                  Introduction.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#navigating-complexity"
                  id="navigating-complexity-link"
                >
                  Navigating Complexity.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#about-this-guide"
                  id="about-this-guide-link"
                >
                  About This Guide.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#how-to-use"
                  id="how-to-use-link"
                >
                  How to Use This Resource.
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
          <section aria-labelledby="introduction">
            <h2
              className="text-2xl font-semibold mb-4 mt-0 scroll-mt-6"
              id="introduction"
              tabIndex={-1}
            >
              Introduction.
            </h2>
            <div className="space-y-4">
              <p>
                The European Accessibility Act (EAA) is a law known as Directive
                (EU) 2019/882. It sets rules for making products and services
                accessible across the European Union. The law helps people with
                disabilities take part fully in society and use important
                services.
              </p>
              <p>
                This law creates clear guidelines for businesses to make
                accessible products and services. By setting the same rules
                across the EU, the EAA makes it easier for companies to follow
                the rules while helping all people access what they need.
              </p>
            </div>
          </section>

          <section aria-labelledby="navigating-complexity">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="navigating-complexity"
              tabIndex={-1}
            >
              Navigating Complexity.
            </h2>
            <div className="space-y-4">
              <p>
                Following accessibility rules can be hard. Many organizations
                struggle to understand multiple rules, technical standards, and
                how to put them in place. The EAA adds new rules to learn.
              </p>
              <p>
                Accessibility is not just about following rules or meeting legal
                needs. It is about real people. Each rule exists to remove a
                barrier and include more people in your products and services.
              </p>
              <p>
                Remember that making things accessible is an ongoing process. It
                needs constant commitment, learning, and change as technology
                grows and we better understand what people need.
              </p>
            </div>
          </section>

          <section aria-labelledby="about-this-guide">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="about-this-guide"
              tabIndex={-1}
            >
              About This Guide.
            </h2>
            <div className="space-y-4">
              <p>
                This guide makes the European Accessibility Act easier to
                understand and use for all sizes of organizations. We have
                turned complex legal rules into practical advice, examples, and
                steps to help you make things accessible.
              </p>
              <p>Our approach focuses on:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Simple language explanations</strong> that make legal
                  requirements easy to understand without losing their meaning.
                </li>
                <li>
                  <strong>Practical advice</strong> based on real experience and
                  best ways to do things.
                </li>
                <li>
                  <strong>Clear steps to follow the law</strong> that
                  organizations can follow one by one.
                </li>
                <li>
                  <strong>Connecting rules to human needs</strong> to keep focus
                  on the people you design for.
                </li>
              </ul>
              <p>
                While this guide gives helpful information, it is not legal
                advice. Organizations should talk to legal experts to make sure
                they fully follow the EAA and other laws.
              </p>
            </div>
          </section>

          <section aria-labelledby="how-to-use">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="how-to-use"
              tabIndex={-1}
            >
              How to Use This Resource.
            </h2>
            <div className="space-y-4">
              <p>
                You can use this guide in different ways, based on what you need
                and how much you know about accessibility:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Reading from start to finish</strong> gives you a full
                  understanding of the EAA from basics to specific rules.
                </li>
                <li>
                  <strong>Jumping to specific topics</strong> lets you go right
                  to sections that matter to you now.
                </li>
                <li>
                  <strong>Role-specific guidance</strong> helps different team
                  members understand what they need to do.
                </li>
              </ul>
              <p>
                We suggest starting with the overview sections to build basic
                knowledge before looking at specific rules. The sidebar menu
                gives quick access to sections as you work on accessibility in
                your organization.
              </p>
              <p>
                Remember that accessibility works best when it's part of your
                normal processes, not a separate task. Use this guide to inform
                your approach, but adapt it to fit your organization's unique
                needs and workflows.
              </p>
            </div>
          </section>

          <footer>
            <ChapterNavigation currentPageId="0.0-foreword" />
          </footer>
        </div>
      </div>
    </section>
  )
}
