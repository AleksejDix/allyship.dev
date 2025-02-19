import { Metadata } from "next"

import { HeadingOrder } from "@/components/bookmarklet/heading-order"

export const metadata: Metadata = {
  title: "Heading Structure Bookmarklet - Document Outline Visualization Tool",
  description:
    "Visualize HTML heading structure and hierarchy to improve web accessibility and document outline. Essential for WCAG 2.1 compliance testing.",
}

export default function HeadingBookmarkletPage() {
  return (
    <div className="container max-w-4xl py-12">
      <header className="flex flex-col items-center space-y-4 text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Heading Structure Visualization Tool
        </h1>
        <p className="text-muted-foreground text-lg">
          Instantly analyze and visualize heading hierarchy on any webpage
        </p>
      </header>

      {/* New prominent Call to Action section */}
      <section className="mb-16 text-center">
        <div className="p-8 rounded-lg border border-border bg-primary/5 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
          <p className="mb-6 text-lg">
            Drag this button to your bookmarks bar:
          </p>
          <HeadingOrder />
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
                heading structure conveys document organization
              </li>
              <li>
                <strong>2.4.6 Headings and Labels (Level AA)</strong> - Verify
                that headings accurately describe their corresponding sections
              </li>
              <li>
                <strong>2.4.10 Section Headings (Level AAA)</strong> - Validate
                proper section organization using headings
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
              <h3 className="font-semibold mb-2">Visual Hierarchy Map</h3>
              <p className="text-muted-foreground">
                See the complete heading structure and identify gaps in document
                outline
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card text-card-foreground shadow-sm">
              <h3 className="font-semibold mb-2">Level Validation</h3>
              <p className="text-muted-foreground">
                Instantly spot skipped heading levels and structural issues
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card text-card-foreground shadow-sm">
              <h3 className="font-semibold mb-2">Dynamic Analysis</h3>
              <p className="text-muted-foreground">
                Works with dynamic content and single-page applications
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card text-card-foreground shadow-sm">
              <h3 className="font-semibold mb-2">Content Structure Review</h3>
              <p className="text-muted-foreground">
                Evaluate semantic structure and improve content organization
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
              <li>Visit any webpage you want to analyze</li>
              <li>Click the bookmarklet to view heading structure</li>
              <li>Review the visual hierarchy and identify any issues</li>
            </ol>
          </div>
        </section>
      </div>
    </div>
  )
}
