import { Metadata } from "next"

import { FocusTracker } from "@/components/bookmarklet/focus-tracker"

export const metadata: Metadata = {
  title: "Focus Bookmarklet - Tab Order Visualization Tool",
  description:
    "Visualize keyboard navigation paths and improve web accessibility with our focus order visualization tool. Perfect for developers and accessibility testing.",
}

export default function FocusBookmarkletPage() {
  return (
    <div className="container max-w-4xl py-12">
      <header className="flex flex-col items-center space-y-4 text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Focus Order Visualization Tool
        </h1>
        <p className="text-muted-foreground text-lg">
          Instantly visualize keyboard navigation paths on any webpage
        </p>
      </header>

      {/* New prominent Call to Action section */}
      <section className="mb-16 text-center">
        <div className="p-8 rounded-lg border border-border bg-primary/5 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
          <p className="mb-6 text-lg">
            Drag this button to your bookmarks bar:
          </p>
          <FocusTracker />
        </div>
      </section>

      <div className="space-y-12">
        {/* Key Features */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-6">
            Key Features
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg border border-border bg-card text-card-foreground shadow-sm">
              <h3 className="font-semibold mb-2">Real-time Visualization</h3>
              <p className="text-muted-foreground">
                See the exact path users will take when navigating with their
                keyboard
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card text-card-foreground shadow-sm">
              <h3 className="font-semibold mb-2">Scroll-aware Tracking</h3>
              <p className="text-muted-foreground">
                Works seamlessly with scrolled sections and dynamically loaded
                content
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card text-card-foreground shadow-sm">
              <h3 className="font-semibold mb-2">Dynamic DOM Monitoring</h3>
              <p className="text-muted-foreground">
                Automatically detects and visualizes new elements as
                they&apos;re added to the page
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card text-card-foreground shadow-sm">
              <h3 className="font-semibold mb-2">Accessibility Testing</h3>
              <p className="text-muted-foreground">
                Identify unreachable areas and improve keyboard navigation flows
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
              <li>Visit any webpage you want to test</li>
              <li>Click the bookmarklet to activate the visualization</li>
              <li>Use Tab key to see the navigation order in action</li>
            </ol>
          </div>
        </section>
      </div>
    </div>
  )
}
