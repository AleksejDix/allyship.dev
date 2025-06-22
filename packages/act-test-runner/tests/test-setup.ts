/**
 * Simple test setup for vitest browser mode
 */

import { beforeEach } from 'vitest'

// Clean up after each test
beforeEach(() => {
  if (typeof document !== 'undefined') {
    document.body.innerHTML = ''
  }
})
