"use client"

import { AltTextGenerator } from "@/features/common/components/alt-text-generator"

export function AltTextGeneratorBlock() {
  return (
    <section className="container py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">AI-Powered Alt Text Generator</h2>
          <p className="text-muted-foreground">
            Upload an image and let AI help you generate descriptive alt text
            for better accessibility.
          </p>
        </div>

        <AltTextGenerator />
      </div>
    </section>
  )
}
