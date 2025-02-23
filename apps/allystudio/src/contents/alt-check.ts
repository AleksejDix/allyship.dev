import { altTests } from "@/lib/testing/alt-tests"
import { createTestRunner } from "@/lib/testing/create-test-runner"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

createTestRunner({
  type: "alt",
  suite: altTests,
  events: {
    complete: "ALT_ANALYSIS_COMPLETE",
    request: "ALT_ANALYSIS_REQUEST"
  },
  displayName: "Alt Text Analysis"
})
