import { Metadata } from "next"

import { ChecklistClient } from "./components/checklist-client"
import { checklistItems } from "./data"

export const metadata: Metadata = {
  title: "Web Accessibility Checklist",
  description:
    "A comprehensive checklist for making your website more accessible",
}

export default function ChecklistPage() {
  return (
    <div className="container max-w-2xl py-12 space-y-8 relative">
      <div className="space-y-4">
        <h1 className="text-5xl font-bold text-pretty font-display">
          Accessibility Checklist
        </h1>
        <p className="text-muted-foreground text-lg">
          Use this checklist to ensure your website meets common accessibility
          standards and best practices.
        </p>
        <p className="text-muted-foreground text-lg">
          By implementing these essential checks on every page of your website,
          you&apos;ll create an exceptionally inclusive experience that goes
          beyond standard accessibility requirements.
        </p>
      </div>

      <ChecklistClient items={checklistItems} totalItems={31} />
    </div>
  )
}
