# AllyStudio Integration Example

This example shows how the AllyStudio browser extension integrates with the ACT Test Runner using the plugin architecture.

## Test Runner Side (Package)

The test runner focuses purely on testing and emits events:

```typescript
// packages/act-test-runner/src/api.ts
import { describe, test, expect, runTests } from '@allystudio/act-test-runner'

// Define accessibility tests
describe('Button Accessibility', () => {
  test('should have accessible name', ({ element }) => {
    expect(element).toHaveAccessibleName()
  }, 'button')
})

// Run tests and emit events
const results = await runTests()
```

## AllyStudio Extension Side (Plugin)

The extension listens for events and handles highlighting:

```typescript
// apps/allystudio/src/content-scripts/test-runner-integration.ts

// Listen for test events
window.addEventListener('act-test-runner', (event) => {
  const { type, data } = event.detail

  switch (type) {
    case 'test-start':
      // Clear previous highlights
      layerSystem.clearLayer('accessibility-test-results')
      showProgress(`Testing ${data.category}...`)
      break

    case 'element-tested':
      handleElementTested(data)
      break

    case 'test-progress':
      updateProgress(data.completed, data.total, data.failed)
      break

    case 'test-complete':
      showResults(data.report)
      break
  }
})

function handleElementTested(data) {
  const { element, result, rule, message } = data

  if (result === 'failed') {
    // Use AllyStudio's layer system for highlighting
    layerSystem.addHighlight({
      selector: element.selector,
      message: `${rule}: ${message}`,
      layer: 'accessibility-test-results',
      color: '#ef4444', // Red for failures
      priority: 'high'
    })
  } else if (result === 'passed') {
    // Optional: highlight passed elements in green
    layerSystem.addHighlight({
      selector: element.selector,
      message: `✓ ${rule}: Passed`,
      layer: 'accessibility-test-results',
      color: '#22c55e', // Green for passes
      priority: 'low'
    })
  }
}

function showProgress(message) {
  // Update AllyStudio's progress indicator
  chrome.runtime.sendMessage({
    type: 'update-progress',
    message
  })
}

function updateProgress(completed, total, failed) {
  chrome.runtime.sendMessage({
    type: 'update-progress',
    progress: {
      completed,
      total,
      failed,
      percentage: Math.round((completed / total) * 100)
    }
  })
}

function showResults(report) {
  // Send results to AllyStudio popup/panel
  chrome.runtime.sendMessage({
    type: 'test-results',
    report
  })

  // Show summary notification
  layerSystem.showNotification({
    message: `Tests complete: ${report.summary.rules.passed} passed, ${report.summary.rules.failed} failed`,
    type: report.summary.rules.failed > 0 ? 'error' : 'success'
  })
}
```

## Layer System Integration

The AllyStudio layer system handles the visual highlighting:

```typescript
// apps/allystudio/src/lib/layer-system/accessibility-layer.ts

export class AccessibilityTestLayer extends Layer {
  constructor() {
    super('accessibility-test-results', {
      zIndex: 1000,
      persistent: true
    })
  }

  addHighlight(options) {
    const { selector, message, color, priority } = options

    const elements = document.querySelectorAll(selector)
    elements.forEach(element => {
      const highlight = this.createHighlight(element, {
        color,
        message,
        priority,
        interactive: true
      })

      this.addElement(highlight)
    })
  }

  clearLayer() {
    this.removeAllElements()
  }
}
```

## Benefits of This Architecture

1. **Separation of Concerns**
   - Test runner: Pure testing logic
   - Extension: UI and highlighting

2. **Minimal Dependencies**
   - Test runner has no UI dependencies
   - Extension can use any highlighting approach

3. **Plugin Flexibility**
   - Multiple plugins can listen to the same events
   - Easy to add new visualization features

4. **Performance**
   - Test runner is fast (no UI overhead)
   - Highlighting happens asynchronously

5. **Maintainability**
   - Clear boundaries between components
   - Easy to test each part separately

## Event Flow

```
1. User triggers test → AllyStudio Extension
2. Extension runs → ACT Test Runner
3. Test Runner emits → 'test-start' event
4. Extension receives → Clears highlights
5. Test Runner tests → Individual elements
6. Test Runner emits → 'element-tested' events
7. Extension receives → Adds highlights via Layer System
8. Test Runner emits → 'test-complete' event
9. Extension receives → Shows final results
```

This architecture allows the test runner to be used in any environment (browser, Node.js, other extensions) while keeping AllyStudio's highlighting as a separate, pluggable concern.
