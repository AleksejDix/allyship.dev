import { Metadata } from "next"

import { FocusStyles } from "@/components/bookmarklet/focus-styles"

export const metadata: Metadata = {
  title: "Focus Styles Validator Bookmarklet - Visual Accessibility Tool",
  description:
    "Validate focus indicators and keyboard navigation to improve web accessibility. Essential for WCAG 2.1 compliance testing.",
}

export default function FormLabelBookmarkletPage() {
  return (
    <div className="container max-w-4xl py-12">
      <header className="flex flex-col items-center space-y-4 text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Focus Styles Validation Tool
        </h1>
        <p className="text-muted-foreground text-lg">
          Instantly check if all interactive elements have visible focus
          indicators
        </p>
      </header>

      {/* New prominent Call to Action section */}
      <section className="mb-16 text-center">
        <div className="p-8 rounded-lg border border-border bg-primary/5 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
          <p className="mb-6 text-lg">
            Drag this button to your bookmarks bar:
          </p>
          <FocusStyles />
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
                <strong>2.4.7 Focus Visible (Level AA)</strong> - Ensure
                keyboard focus indicator is visible
              </li>
              <li>
                <strong>2.1.1 Keyboard (Level A)</strong> - Verify all
                functionality is operable through keyboard
              </li>
              <li>
                <strong>1.4.11 Non-text Contrast (Level AA)</strong> - Validate
                focus indicators meet contrast requirements
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
              <h3 className="font-semibold mb-2">Focus Detection</h3>
              <p className="text-muted-foreground">
                Highlights elements missing visible focus indicators
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card text-card-foreground shadow-sm">
              <h3 className="font-semibold mb-2">Contrast Analysis</h3>
              <p className="text-muted-foreground">
                Checks if focus indicators meet WCAG contrast requirements
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card text-card-foreground shadow-sm">
              <h3 className="font-semibold mb-2">Interactive Element Scan</h3>
              <p className="text-muted-foreground">
                Identifies all keyboard-focusable elements on the page
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card text-card-foreground shadow-sm">
              <h3 className="font-semibold mb-2">Focus Order Report</h3>
              <p className="text-muted-foreground">
                Shows the tab order and highlights any navigation issues
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
              <li>Click the bookmarklet to check focus indicators</li>
              <li>
                Use Tab key to navigate and review highlighted focus issues
              </li>
            </ol>
          </div>
        </section>
      </div>
    </div>
  )
}
