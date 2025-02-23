import { createTestRunner } from "@/lib/testing/create-test-runner"
import { headingTests } from "@/lib/testing/heading-tests"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

createTestRunner({
  type: "headings",
  suite: headingTests,
  events: {
    complete: "HEADING_ANALYSIS_COMPLETE",
    request: "HEADING_ANALYSIS_REQUEST"
  },
  displayName: "Heading Structure"
})
