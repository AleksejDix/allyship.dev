import { createTestRunner } from "@/lib/testing/create-test-runner"
import { linkTests } from "@/lib/testing/link-tests"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

createTestRunner({
  type: "links",
  suite: linkTests,
  events: {
    complete: "LINK_ANALYSIS_COMPLETE",
    request: "LINK_ANALYSIS_REQUEST"
  },
  displayName: "Link Accessibility"
})
