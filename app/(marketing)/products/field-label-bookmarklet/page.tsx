import { Metadata } from "next"

import { FieldLabels } from "@/components/bookmarklet/field-labels"

export const metadata: Metadata = {
  title: "Form Label Validator Bookmarklet - Input Field Accessibility Tool",
  description:
    "Validate form field labels and ARIA attributes to improve web accessibility. Essential for WCAG 2.1 compliance testing.",
}

export default function FormLabelBookmarkletPage() {
  return (
    <div className="container max-w-4xl py-12">
      <header className="flex flex-col items-center space-y-4 text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Form Label Validation Tool
        </h1>
        <p className="text-muted-foreground text-lg">
          Instantly check if all form fields have proper labels and ARIA
          attributes
        </p>
      </header>

      {/* New prominent Call to Action section */}
      <section className="mb-16 text-center">
        <div className="p-8 rounded-lg border border-border bg-primary/5 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
          <p className="mb-6 text-lg">
            Drag this button to your bookmarks bar:
          </p>
          <FieldLabels />
        </div>
      </section>

      <div className="space-y-12">
        {/* WCAG Compliance Section */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-6">
            WCAG Compliance
          </h2>
          <div className="p-6 rounded-lg border border-border bg-card text-card-foreground shadow-sm space-y-4">
            <p className="text-muted-foreground">
              This tool helps ensure compliance with key WCAG 2.1 success
              criteria:
            </p>
            <ul className="list-disc ml-6 text-muted-foreground space-y-2">
              <li>
                <strong>1.3.1 Info and Relationships (Level A)</strong> - Ensure
                form controls have proper labels
              </li>
              <li>
                <strong>2.4.6 Headings and Labels (Level AA)</strong> - Verify
                that form labels are descriptive and meaningful
              </li>
              <li>
                <strong>3.3.2 Labels or Instructions (Level A)</strong> -
                Validate that input fields have clear labels or instructions
              </li>
            </ul>
          </div>
        </section>

        {/* Key Features */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-6">
            Key Features
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg border border-border bg-card text-card-foreground shadow-sm">
              <h3 className="font-semibold mb-2">Label Detection</h3>
              <p className="text-muted-foreground">
                Identifies form fields missing proper labels or ARIA labels
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card text-card-foreground shadow-sm">
              <h3 className="font-semibold mb-2">ARIA Validation</h3>
              <p className="text-muted-foreground">
                Checks for appropriate ARIA attributes and relationships
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card text-card-foreground shadow-sm">
              <h3 className="font-semibold mb-2">Dynamic Form Support</h3>
              <p className="text-muted-foreground">
                Works with dynamically generated forms and input fields
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card text-card-foreground shadow-sm">
              <h3 className="font-semibold mb-2">Accessibility Report</h3>
              <p className="text-muted-foreground">
                Generates detailed report of form accessibility issues
              </p>
            </div>
          </div>
        </section>

        {/* How to Use */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-6">
            How to Use
          </h2>
          <div className="text-muted-foreground">
            <ol className="space-y-4 ml-6 list-decimal">
              <li>Drag the bookmarklet to your browser&apos;s bookmark bar</li>
              <li>Visit any webpage with forms you want to analyze</li>
              <li>Click the bookmarklet to check form field labels</li>
              <li>
                Review the accessibility report for any missing or improper
                labels
              </li>
            </ol>
          </div>
        </section>
      </div>
    </div>
  )
}
