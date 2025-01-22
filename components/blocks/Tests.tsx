"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle, LoaderCircle, XCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"

const initialTests: Test[] = [
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    link: "https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html",
    status: "passed",
  },
  {
    criterion: "1.2.1 Audio-only and Video-only (Prerecorded)",
    level: "A",
    link: "https://www.w3.org/WAI/WCAG21/Understanding/audio-only-and-video-only-prerecorded.html",
    status: "passed",
  },
  {
    criterion: "1.2.2 Captions (Prerecorded)",
    level: "A",
    link: "https://www.w3.org/WAI/WCAG21/Understanding/captions-prerecorded.html",
    status: "failed",
  },
  {
    criterion: "1.2.3 Audio Description or Media Alternative (Prerecorded)",
    level: "A",
    link: "https://www.w3.org/WAI/WCAG21/Understanding/audio-description-or-media-alternative-prerecorded.html",
    status: "passed",
  },
  {
    criterion: "1.2.4 Captions (Live)",
    level: "AA",
    link: "https://www.w3.org/WAI/WCAG21/Understanding/captions-live.html",
    status: "failed",
  },
  {
    criterion: "1.2.5 Audio Description (Prerecorded)",
    level: "AA",
    link: "https://www.w3.org/WAI/WCAG21/Understanding/audio-description-prerecorded.html",
    status: "failed",
  },
  {
    criterion: "1.2.6 Sign Language (Prerecorded)",
    level: "AAA",
    link: "https://www.w3.org/WAI/WCAG21/Understanding/sign-language-prerecorded.html",
    status: "pending",
  },
  {
    criterion: "1.2.7 Extended Audio Description (Prerecorded)",
    level: "AAA",
    link: "https://www.w3.org/WAI/WCAG21/Understanding/extended-audio-description-prerecorded.html",
    status: "pending",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    link: "https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html",
    status: "pending",
  },
  {
    criterion: "1.3.2 Meaningful Sequence",
    level: "A",
    link: "https://www.w3.org/WAI/WCAG21/Understanding/meaningful-sequence.html",
    status: "pending",
  },
  {
    criterion: "1.3.3 Sensory Characteristics",
    level: "A",
    link: "https://www.w3.org/WAI/WCAG21/Understanding/sensory-characteristics.html",
    status: "pending",
  },
  {
    criterion: "1.4.1 Use of Color",
    level: "A",
    link: "https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html",
    status: "pending",
  },
  {
    criterion: "1.4.2 Audio Control",
    level: "A",
    link: "https://www.w3.org/WAI/WCAG21/Understanding/audio-control.html",
    status: "pending",
  },
  {
    criterion: "1.4.3 Contrast (Minimum)",
    level: "AA",
    link: "https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html",
    status: "pending",
  },
  {
    criterion: "1.4.4 Resize Text",
    level: "AA",
    link: "https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html",
    status: "pending",
  },
  {
    criterion: "1.4.5 Images of Text",
    level: "AA",
    link: "https://www.w3.org/WAI/WCAG21/Understanding/images-of-text.html",
    status: "pending",
  },
  {
    criterion: "1.4.6 Contrast (Enhanced)",
    level: "AAA",
    link: "https://www.w3.org/WAI/WCAG21/Understanding/contrast-enhanced.html",
    status: "pending",
  },
  {
    criterion: "1.4.7 Low or No Background Audio",
    level: "AAA",
    link: "https://www.w3.org/WAI/WCAG21/Understanding/low-or-no-background-audio.html",
    status: "pending",
  },
  {
    criterion: "1.4.8 Visual Presentation",
    level: "AAA",
    link: "https://www.w3.org/WAI/WCAG21/Understanding/visual-presentation.html",
    status: "pending",
  },
  {
    criterion: "1.4.9 Images of Text (No Exception)",
    level: "AAA",
    link: "https://www.w3.org/WAI/WCAG21/Understanding/images-of-text-no-exception.html",
    status: "pending",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    link: "https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html",
    status: "pending",
  },
  {
    criterion: "2.1.2 No Keyboard Trap",
    level: "A",
    link: "https://www.w3.org/WAI/WCAG21/Understanding/no-keyboard-trap.html",
    status: "pending",
  },
  {
    criterion: "2.1.4 Character Key Shortcuts",
    level: "A",
    link: "https://www.w3.org/WAI/WCAG21/Understanding/character-key-shortcuts.html",
    status: "pending",
  },
  {
    criterion: "2.2.1 Timing Adjustable",
    level: "A",
    link: "https://www.w3.org/WAI/WCAG21/Understanding/timing-adjustable.html",
    status: "pending",
  },
  {
    criterion: "2.2.2 Pause, Stop, Hide",
    level: "A",
    link: "https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html",
    status: "pending",
  },
  {
    criterion: "2.3.1 Three Flashes or Below Threshold",
    level: "A",
    link: "https://www.w3.org/WAI/WCAG21/Understanding/three-flashes-or-below-threshold.html",
    status: "pending",
  },
  {
    criterion: "2.4.1 Bypass Blocks",
    level: "A",
    link: "https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html",
    status: "pending",
  },
  {
    criterion: "2.4.2 Page Titled",
    level: "A",
    link: "https://www.w3.org/WAI/WCAG21/Understanding/page-titled.html",
    status: "pending",
  },
  {
    criterion: "2.4.3 Focus Order",
    level: "A",
    link: "https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html",
    status: "pending",
  },
  {
    criterion: "2.4.4 Link Purpose (In Context)",
    level: "A",
    link: "https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html",
    status: "pending",
  },
  {
    criterion: "2.4.5 Multiple Ways",
    level: "AA",
    link: "https://www.w3.org/WAI/WCAG21/Understanding/multiple-ways.html",
    status: "pending",
  },
  {
    criterion: "2.4.6 Headings and Labels",
    level: "AA",
    link: "https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels.html",
    status: "pending",
  },
  {
    criterion: "2.4.7 Focus Visible",
    level: "AA",
    link: "https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html",
    status: "pending",
  },
  {
    criterion: "3.1.1 Language of Page",
    level: "A",
    link: "https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html",
    status: "pending",
  },
  {
    criterion: "3.3.1 Error Identification",
    level: "A",
    link: "https://www.w3.org/WAI/WCAG21/Understanding/error-identification.html",
    status: "pending",
  },
]

type TestCasesProps = {
  tests: Test[]
}

const TestCases = (props: TestCasesProps) => {
  const [tests, setTests] = useState(props.tests)

  useEffect(() => {
    setTests(props.tests)
  }, [props.tests])

  return (
    <div className="space-y-2">
      {tests.map((test) => (
        <div key={test.criterion}>
          <div
            className={cn(
              test.status === "passed" && "text-green-500",
              test.status === "pending" && "text-yellow-500",
              test.status === "failed" && "text-red-500",
              "flex items-center space-x-2 justify-between",
              test.level === "AA" && "pl-6",
              test.level === "AAA" && "pl-12"
            )}
          >
            <span className="inline-flex items-center gap-2">
              {test.status === "passed" && <CheckCircle size={16} />}
              {test.status === "pending" && (
                <LoaderCircle className="animate-spin" size={16} />
              )}
              {test.status === "failed" && <XCircle size={16} />}

              <Link href={test.link} className="font-medium">
                {test.criterion}
              </Link>
            </span>
            <span className="font-medium">{test.level}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export const AccessibilityTests = () => {
  const [tests] = useState(initialTests)
  const [value, setValue] = React.useState("All")

  function handleChange(newValue: string) {
    setValue(newValue)
  }

  const filterdList =
    value === "All" ? tests : tests.filter((test) => test.level === value)

  return (
    <div className=" max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div>WCAG 2.1 Success criterions</div>
            <div>
              <ToggleGroup
                type="single"
                onValueChange={handleChange}
                value={value}
              >
                <ToggleGroupItem value="All">All</ToggleGroupItem>
                <ToggleGroupItem value="A">A</ToggleGroupItem>
                <ToggleGroupItem value="AA">AA</ToggleGroupItem>
                <ToggleGroupItem value="AAA">AAA</ToggleGroupItem>
              </ToggleGroup>
            </div>
          </CardTitle>
          <CardDescription>
            Over 100 test cases to ensure your application is accessible
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TestCases tests={[...filterdList]} />
        </CardContent>
        <CardFooter>
          We make sure your application is accessible to all users. New tests
          are added regularly to ensure compliance with the latest standards.
        </CardFooter>
      </Card>
    </div>
  )
}
