"use client"

import { useState } from "react"
import { FileText, Search, Wrench } from "lucide-react"

const steps = [
  {
    icon: <Search size="16" className="text-green-500" />,
    title: "Scan Your Website",
    description:
      "Enter your website URL and let our scanner analyze accessibility issues instantly.",
    mockContent: (
      <div className="p-4">
        <div className="space-y-4">
          <div className="h-24 rounded-md bg-muted-foreground/20 p-3">
            <div className="h-4 w-1/2 bg-muted-foreground/30 rounded mb-2" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-muted-foreground/30 rounded" />
              <div className="h-3 w-4/5 bg-muted-foreground/30 rounded" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-24 rounded-md bg-primary/20" />
            <div className="h-8 w-24 rounded-md bg-muted-foreground/20" />
          </div>

          <div className="absolute z-10 inset-0 animate-scan">
            <div className="absolute top-0 left-0 bottom-0 w-[1px] h-full bg-primary">
              <div className="absolute animate-hide-right top-0 left-[1px] bottom-0 w-8 bg-gradient-to-l from-transparent to-primary/20" />
              <div className="absolute animate-hide-left opacity-0 top-0 right-[1px] bottom-0 w-8 bg-gradient-to-r from-transparent to-primary/20" />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: <FileText size="16" className="text-green-500" />,
    title: "Get an Actionable Report",
    description:
      "Receive a detailed breakdown of issues categorized by severity, with clear explanations.",
    mockContent: (
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="h-6 w-3/4 rounded-md bg-red-500/20" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <div className="h-6 w-2/3 rounded-md bg-orange-500/20" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <div className="h-6 w-4/5 rounded-md bg-green-500/20" />
        </div>
      </div>
    ),
  },
  {
    icon: <Wrench size="16" className="text-green-500" />,
    title: "Fix & Improve Accessibility",
    description:
      "Follow step-by-step guidance to resolve issues and improve your site's usability.",
    mockContent: (
      <div className="p-4 space-y-4">
        <div className="h-24 rounded-md bg-success/20 p-3">
          <div className="h-4 w-1/2 bg-success/30 rounded mb-2" />
          <div className="space-y-2">
            <div className="h-3 w-full bg-success/30 rounded" />
            <div className="h-3 w-4/5 bg-muted-foreground/30 rounded" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-24 rounded-md bg-success/30" />
          <div className="h-8 w-24 rounded-md bg-success/10" />
        </div>
      </div>
    ),
  },
]

export const ScanProcess = () => {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <div className="container  mx-auto py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Side: Interactive Mockup */}

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-pretty font-display sm:text-3xl">
            How Our Accessibility Scanner Works
          </h2>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <button
                key={index}
                className={`  text-sm w-full bg-background text-left font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex flex-col items-center justify-between rounded-lg border px-4 py-3 hover:bg-accent hover:text-accent-foreground transition-all ${
                  activeStep === index ? "border-primary" : "border-border "
                }`}
                onClick={() => setActiveStep(index)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-2 bg-success/10 rounded-md p-2">
                    {" "}
                    {step.icon}
                  </div>
                  <div>
                    <p className="text-lg font-medium">{step.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div
          aria-hidden="true"
          className="relative w-full bg-card rounded-md border border-border overflow-hidden"
        >
          {/* Browser Chrome */}
          <div className="bg-muted border-b border-border p-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
          </div>
          {/* Content Area */}
          <div className="relative aspect-video">
            {steps[activeStep].mockContent}
          </div>
        </div>
      </div>
    </div>
  )
}
