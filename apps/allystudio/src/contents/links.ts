import { createTestRunner } from "@/lib/testing/create-test-runner"
import { TEST_CONFIGS } from "@/lib/testing/test-config"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

createTestRunner(TEST_CONFIGS.links)
