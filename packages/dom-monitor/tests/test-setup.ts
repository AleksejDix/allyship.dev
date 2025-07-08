/**
 * Test setup for DOM monitor vitest browser mode
 */

import { beforeEach } from "vitest"

// Clean up DOM after each test
beforeEach(() => {
  if (typeof document !== "undefined") {
    document.body.innerHTML = ""
  }
})
