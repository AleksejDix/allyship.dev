import { Metadata } from "next"
import { ScanJobCreate } from "@/features/scans/components/scan-create"

export const metadata: Metadata = {
  title: "Accessibility Scanner",
  description: "Allyship's automated static accessibility scanning tool",
}

export default function AutomatedScanningPage() {
  return (
    <div className="container max-w-2xl py-8 md:py-12 space-y-8 relative">
      <div className="space-y-4 md:text-center">
        <h1 className="text-4xl font-bold md:text-7xl max-w-2xl tracking-tighter text-pretty">
          Accessibility Scanner
        </h1>
        <p className="text-pretty text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-xl md:mx-auto">
          Allyship&apos;s automated static accessibility scanning tool helps you
          identify accessibility issues on your website. Which is a great way to
          start your accessibility journey.
        </p>
      </div>
      <ScanJobCreate />
    </div>
  )
}
