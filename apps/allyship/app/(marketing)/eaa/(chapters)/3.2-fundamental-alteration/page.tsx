import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { ChapterNavigation } from '../../components/ChapterNavigation'

export const metadata: Metadata = {
  title: 'Fundamental Alteration | European Accessibility Act',
  description:
    'When adding accessibility would change what a product really is - explained in plain language with examples.',
}

export default function FundamentalAlterationPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 className="text-4xl font-bold mb-[23px]">
            Fundamental Alteration.
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
                  href="#definition"
                  id="definition-link"
                >
                  What Does It Mean?
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#assessment-criteria"
                  id="assessment-criteria-link"
                >
                  How To Check.
                </a>
              </li>
              <li>
                <a className="underline" href="#examples" id="examples-link">
                  Examples.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#practical-considerations"
                  id="practical-considerations-link"
                >
                  Practical Tips.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#decision-framework"
                  id="decision-framework-link"
                >
                  How To Decide.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#differences-disproportionate"
                  id="differences-disproportionate-link"
                >
                  How It's Different From Cost Concerns.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#best-practices"
                  id="best-practices-link"
                >
                  Best Practices.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#market-surveillance"
                  id="market-surveillance-link"
                >
                  What Authorities Will Check.
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
              Overview.
            </h2>
            <div className="space-y-4">
              <p>
                Sometimes making a product or service accessible might
                completely change what it is. The European Accessibility Act
                (EAA) calls this a "fundamental alteration."
              </p>
              <p>
                The law says you need to make things accessible unless doing so
                would "change the basic nature" of your product or service.
              </p>
              <p>
                This rule recognizes that sometimes adding accessibility
                features might turn your product into something completely
                different. When this happens, you might not have to follow
                certain accessibility requirements.
              </p>
            </div>
          </section>

          <section aria-labelledby="definition">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="definition"
              tabIndex={-1}
            >
              What Does It Mean?
            </h2>
            <div className="space-y-4">
              <p>
                The law doesn't give an exact definition of "fundamental
                alteration." But we can understand it like this:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  It's a change that would turn your product into something else
                  entirely.
                </li>
                <li>
                  It affects what your product is at its core - not just how it
                  looks or works in small ways.
                </li>
                <li>
                  It would change the main purpose or identity of your product.
                </li>
                <li>
                  It's not just a big change - it's a change that makes your
                  product become something different.
                </li>
              </ul>
              <p>
                Unlike "disproportionate burden" (which is about costs),
                fundamental alteration is about keeping your product's identity
                intact.
              </p>
            </div>
          </section>

          <section aria-labelledby="assessment-criteria">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="assessment-criteria"
              tabIndex={-1}
            >
              How To Check.
            </h2>
            <div className="space-y-4">
              <p>
                To figure out if an accessibility requirement would cause a
                fundamental alteration, ask these questions:
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Core Purpose and Functionality.
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Would this change what your product mainly does?</li>
                <li>Would it change how the most important features work?</li>
                <li>Would users still recognize it as the same product?</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Who It's For and How It's Used.
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Would the changes make it for a completely different group of
                  people?
                </li>
                <li>Would it change how most people use your product?</li>
                <li>
                  Would special features that define your product be removed?
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Product Identity.
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Would the changes take away what makes your product unique?
                </li>
                <li>Would people no longer recognize your product?</li>
                <li>
                  Would your product become something basically different?
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="examples">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="examples"
              tabIndex={-1}
            >
              Examples.
            </h2>
            <div className="space-y-4">
              <p>
                Here are some examples to help explain what counts as a
                fundamental alteration:
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Might Be Fundamental Alterations:
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Historical Archive.</strong> An online collection of
                  ancient handwritten documents might not need to provide typed
                  versions of everything. That would change it from showing
                  original sources to showing transcripts.
                </li>
                <li>
                  <strong>Visual Art Experience.</strong> A virtual reality art
                  show designed specifically to explore visual experiences might
                  not need to create non-visual alternatives that would create a
                  completely different art experience.
                </li>
                <li>
                  <strong>Language Learning by Listening.</strong> A language
                  program based entirely on listening might not need to provide
                  text for all spoken content. This would change the core
                  learning method that makes the service unique.
                </li>
                <li>
                  <strong>Professional Equipment.</strong> Specialized equipment
                  made only for trained professionals might not need certain
                  accessibility features if they would affect the precision or
                  special functions.
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Not Fundamental Alterations:
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Online Store.</strong> Adding screen reader support,
                  keyboard navigation, and image descriptions would not change
                  what an online store is.
                </li>
                <li>
                  <strong>Banking App.</strong> Making login methods accessible
                  and adding proper labels to forms would not change what a
                  banking app is.
                </li>
                <li>
                  <strong>E-Book Reader.</strong> Adding text-to-speech,
                  adjustable text sizes, and contrast controls would not change
                  what an e-book reader is.
                </li>
                <li>
                  <strong>Video Streaming.</strong> Adding captions, audio
                  descriptions, and accessible menus would not change what a
                  streaming service is.
                </li>
              </ul>
              <p>
                As you can see, most regular accessibility features don't change
                what a product is - they just make it usable by more people.
              </p>
            </div>
          </section>

          <section aria-labelledby="practical-considerations">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="practical-considerations"
              tabIndex={-1}
            >
              Practical Tips.
            </h2>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mt-6 mb-2">
                You Need Proof.
              </h3>
              <p>
                If you claim a fundamental alteration, you need evidence. This
                means:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Write it down</strong> - explain why specific
                  requirements would change your product's nature.
                </li>
                <li>
                  <strong>Provide evidence</strong> showing how the changes
                  would transform your product.
                </li>
                <li>
                  <strong>Talk to experts</strong> in both accessibility and
                  your product's field.
                </li>
                <li>
                  <strong>Get user feedback</strong> that supports your claim.
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                You Still Need Some Accessibility.
              </h3>
              <p>Even with a fundamental alteration exception:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  You only get exemption from specific requirements that would
                  cause the fundamental change.
                </li>
                <li>
                  You must still follow all other accessibility requirements.
                </li>
                <li>
                  You should look for alternative ways to make your product more
                  accessible.
                </li>
                <li>
                  You should revisit this decision as technology improves.
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Innovation Balance.
              </h3>
              <p>This rule tries to balance:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Keeping unique products</strong> that serve special
                  purposes.
                </li>
                <li>
                  <strong>Making things accessible</strong> from the beginning
                  when possible.
                </li>
                <li>
                  <strong>Allowing specialized products</strong> for specific
                  needs.
                </li>
                <li>
                  <strong>Making most products accessible</strong> to everyone.
                </li>
              </ul>
              <p>
                This exception is not meant to be an easy way out - it's only
                for situations where adding accessibility would truly change
                what your product is.
              </p>
            </div>
          </section>

          <section aria-labelledby="decision-framework">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="decision-framework"
              tabIndex={-1}
            >
              How To Decide.
            </h2>
            <div className="space-y-4">
              <p>
                Follow these steps to decide if you have a fundamental
                alteration:
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Step 1: Describe Your Product's Core.
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Clearly write down what your product is and what it does.
                </li>
                <li>List the features that make it what it is.</li>
                <li>Identify what makes your product different from others.</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Step 2: Check Each Requirement.
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Look at each accessibility requirement separately.</li>
                <li>
                  Note which ones might change your product's core identity.
                </li>
                <li>
                  Focus on how they change what your product is, not just how
                  hard they are to add.
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Step 3: Look for Other Solutions.
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Try to find different ways to make your product accessible.
                </li>
                <li>
                  See if you can add accessibility without changing your
                  product's core.
                </li>
                <li>Ask accessibility experts for creative ideas.</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Step 4: Document Your Decision.
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Write down your reasons for any fundamental alteration claim.
                </li>
                <li>
                  List which specific requirements cause problems and why.
                </li>
                <li>Keep evidence that supports your decision.</li>
                <li>
                  Describe any alternative accessibility features you're adding.
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="differences-disproportionate">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="differences-disproportionate"
              tabIndex={-1}
            >
              How It's Different From Cost Concerns.
            </h2>
            <div className="space-y-4">
              <p>
                It's important to understand the difference between fundamental
                alteration and disproportionate burden (cost concerns):
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300 mt-4">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        What's Different.
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Fundamental Alteration.
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Disproportionate Burden.
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">
                        Main Concern.
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        What your product is.
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        How much it costs.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">
                        Key Question.
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Would this change what our product is?
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Is this too expensive for our business?
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">
                        How You Check.
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Look at how functions would change.
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Calculate costs and benefits.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">
                        How Long It Lasts.
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Usually doesn't change over time.
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        May change as costs go down or business grows.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">
                        Business Size.
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Applies to businesses of any size.
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Considers how big your business is.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4">
                You might use both exceptions for different things, but you
                should evaluate them separately and have proper evidence for
                each.
              </p>
            </div>
          </section>

          <section aria-labelledby="best-practices">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="best-practices"
              tabIndex={-1}
            >
              Best Practices.
            </h2>
            <div className="space-y-4">
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Start early with accessibility.</strong> Think about
                  it when you design your product to avoid problems later.
                </li>
                <li>
                  <strong>Be specific.</strong> Only claim fundamental
                  alteration for specific requirements, not as a way to avoid
                  all accessibility.
                </li>
                <li>
                  <strong>Keep good records.</strong> Document your assessment
                  and decisions clearly.
                </li>
                <li>
                  <strong>Get expert help.</strong> Talk to accessibility
                  experts and people who know your product area.
                </li>
                <li>
                  <strong>Try new ideas.</strong> Look for creative ways to make
                  things accessible without changing their core.
                </li>
                <li>
                  <strong>Add alternatives.</strong> When you can't meet a
                  specific requirement, try different ways to make your product
                  accessible.
                </li>
                <li>
                  <strong>Review regularly.</strong> Check your decisions as
                  technology changes.
                </li>
                <li>
                  <strong>Be transparent.</strong> Tell users what accessibility
                  features you have and why some might be missing.
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="relationship-annexes">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="relationship-annexes"
              tabIndex={-1}
            >
              How This Connects to Other EAA Parts.
            </h2>
            <div className="space-y-4">
              <p>
                The fundamental alteration rule connects with other parts of the
                EAA:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Accessibility Requirements.</strong> You might be
                  excused from specific requirements, but only those that would
                  truly change your product's nature.
                </li>
                <li>
                  <strong>Examples Section.</strong> The examples in the EAA can
                  help show which approaches wouldn't change your product's
                  nature.
                </li>
                <li>
                  <strong>Physical Accessibility.</strong> Building requirements
                  might connect with fundamental alteration in certain
                  situations.
                </li>
                <li>
                  <strong>Cost Exceptions.</strong> You need to know whether
                  your issue is about costs or about changing your product's
                  nature.
                </li>
                <li>
                  <strong>Product Assessment.</strong> You should document any
                  fundamental alteration claims when you assess your product.
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="market-surveillance">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="market-surveillance"
              tabIndex={-1}
            >
              What Authorities Will Check.
            </h2>
            <div className="space-y-4">
              <p>
                Government authorities will carefully check any fundamental
                alteration claims. Make sure you:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Have good evidence.</strong> Be ready to show why you
                  believe an accessibility requirement would change your
                  product's nature.
                </li>
                <li>
                  <strong>Show you tried.</strong> Prove that you seriously
                  looked at accessibility, not just tried to avoid it.
                </li>
                <li>
                  <strong>Follow all other requirements.</strong> Show that
                  you've followed all accessibility rules that don't cause
                  fundamental alteration.
                </li>
                <li>
                  <strong>Offer alternatives.</strong> Show other accessibility
                  features you've added where direct compliance would change
                  your product's nature.
                </li>
              </ul>
              <p>
                Authorities will be especially skeptical if similar products
                have successfully implemented the accessibility features you're
                claiming would cause fundamental alteration.
              </p>
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
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>EAA Article 14(2).</strong> This part of the law
                  states that accessibility requirements don't apply if they
                  would change the basic nature of your product or service.
                </li>
                <li>
                  <strong>EAA Recital 53.</strong> This explains more about what
                  fundamental alteration means and how it's different from cost
                  concerns.
                </li>
              </ul>
              <p>
                You can check the official EAA text for the complete legal
                details.
              </p>
            </div>
          </section>

          <footer>
            <ChapterNavigation currentPageId="3.2-fundamental-alteration" />
          </footer>
        </div>
      </div>
    </section>
  )
}
