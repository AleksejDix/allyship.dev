import { configure, describe, test, expectA11y, runTests, clear, ACTMetadataPlugin, ACT_RULES, PerformancePlugin, MetricsPlugin, DebuggerPlugin, ScreenshotPlugin } from '../dist/index.js'
import { isValidLanguageTag } from '@aleksejdix/ally-bcp47'

let lastResults = null
let actPlugin = null
let performancePlugin = null
let metricsPlugin = null
let debuggerPlugin = null
let screenshotPlugin = null

// Configuration management
function getConfig() {
  return {
    performance: document.getElementById('performance').checked,
    metrics: document.getElementById('metrics').checked,
    debugger: document.getElementById('debugger').checked,
    allyStudio: document.getElementById('allyStudio').checked ? {} : false,
    reporter: document.getElementById('reporter').value,
    reporterConfig: {
      verbose: document.getElementById('verbose').checked
    },
    bail: document.getElementById('bail').checked,
    timeout: parseInt(document.getElementById('timeout').value)
  }
}

// Debug function to count elements
function debugElementCounts() {
  console.log('🔍 Element Debug Information:')
  console.log('- img elements:', document.querySelectorAll('img').length)
  console.log('- button elements:', document.querySelectorAll('button').length)
  console.log('- a[href] elements:', document.querySelectorAll('a[href]').length)
  console.log('- form controls:', document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea, select').length)
  console.log('- [lang] elements:', document.querySelectorAll('[lang]').length)

  const total =
    document.querySelectorAll('img').length +
    document.querySelectorAll('button').length +
    document.querySelectorAll('a[href]').length +
    document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea, select').length +
    document.querySelectorAll('[lang]').length

  console.log('- Total testable elements:', total)
  console.log('- Expected tests (5 test definitions × total elements):', total * 5)

  // Show some sample elements
  console.log('\n📋 Sample elements found:')
  console.log('Images:', Array.from(document.querySelectorAll('img')).map(el => el.outerHTML.substring(0, 100)))
  console.log('Buttons:', Array.from(document.querySelectorAll('button')).map(el => el.outerHTML.substring(0, 100)))
  console.log('Links:', Array.from(document.querySelectorAll('a[href]')).map(el => el.outerHTML.substring(0, 100)))
  console.log('Form controls:', Array.from(document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea, select')).map(el => el.outerHTML.substring(0, 100)))
  console.log('Lang elements:', Array.from(document.querySelectorAll('[lang]')).map(el => el.outerHTML.substring(0, 100)))
}

// Define accessibility tests
function defineTests() {
  // Images Test Suite - each test defines its own selector
  describe('Image Accessibility', () => {
    test('should have meaningful alt text', ({ element }) => {
      const alt = element.getAttribute('alt')

      if (alt === null) {
        throw new Error('Image is missing alt attribute')
      }

      if (alt.trim() === '') {
        throw new Error('Image has empty alt attribute')
      }

      // Check for generic/meaningless alt text
      const genericTexts = ['image', 'img', 'picture', 'photo', 'graphic']
      if (genericTexts.some(text => alt.toLowerCase().includes(text))) {
        throw new Error(`Alt text "${alt}" is too generic. Provide descriptive text about the image content.`)
      }
    }, 'img') // Each test defines its own selector
  })

  // Buttons Test Suite - each test defines its own selector
  describe('Button Accessibility', () => {
    test('should have accessible name', ({ element }) => {
      const textContent = element.textContent?.trim()
      const ariaLabel = element.getAttribute('aria-label')?.trim()
      const ariaLabelledby = element.getAttribute('aria-labelledby')

      if (!textContent && !ariaLabel && !ariaLabelledby) {
        throw new Error('Button has no accessible name (no text content, aria-label, or aria-labelledby)')
      }

      if (ariaLabel === '') {
        throw new Error('Button has empty aria-label attribute')
      }
    }, 'button') // Each test defines its own selector
  })

  // Links Test Suite - each test defines its own selector
  describe('Link Accessibility', () => {
    test('should have meaningful link text', ({ element }) => {
      const linkText = element.textContent?.trim()
      const ariaLabel = element.getAttribute('aria-label')?.trim()

      if (!linkText && !ariaLabel) {
        throw new Error('Link has no accessible text')
      }

      // Check for generic link text
      const genericTexts = ['click here', 'read more', 'more', 'link', 'here']
      const textToCheck = (ariaLabel || linkText || '').toLowerCase()

      if (genericTexts.some(generic => textToCheck === generic)) {
        throw new Error(`Link text "${ariaLabel || linkText}" is not descriptive. Use text that describes the link destination.`)
      }
    }, 'a[href]') // Each test defines its own selector
  })

  // Form Controls Test Suite - each test defines its own selector
  describe('Form Accessibility', () => {
    test('should have associated label', ({ element }) => {
      const id = element.getAttribute('id')
      const ariaLabel = element.getAttribute('aria-label')
      const ariaLabelledby = element.getAttribute('aria-labelledby')

      // Check for explicit label association
      if (id) {
        const label = document.querySelector(`label[for="${id}"]`)
        if (label) return // Has proper label
      }

      // Check for aria-label
      if (ariaLabel?.trim()) return // Has aria-label

      // Check for aria-labelledby
      if (ariaLabelledby) return // Has aria-labelledby

      // Check if wrapped in label
      const parentLabel = element.closest('label')
      if (parentLabel) return // Wrapped in label

      throw new Error('Form control has no associated label (no id/for relationship, aria-label, aria-labelledby, or wrapping label)')
    }, 'input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea, select') // Each test defines its own selector
  })

  // Language Attributes Test Suite - each test defines its own selector
  describe('Language Attributes', () => {
    test('should have valid language tag', ({ element, skip }) => {
      const lang = element.getAttribute('lang')

      if (lang === null) {
        skip() // Element has no lang attribute
        return
      }

      const trimmedLang = lang.trim()

      if (trimmedLang === '') {
        throw new Error('Language attribute is present but empty. Remove the attribute or provide a valid language tag.')
      }

      if (!isValidLanguageTag(trimmedLang)) {
        throw new Error(`Invalid language tag "${lang}". Must be a valid BCP 47 language tag.`)
      }
    }, '[lang]') // Each test defines its own selector
  })

  // Video Controls Test Suite - each test defines its own selector
  describe('Video Accessibility', () => {
    test('should have accessible controls', ({ element }) => {
      const hasControls = element.hasAttribute('controls')
      const hasCustomControls = element.querySelector('[role="button"], button')

      if (!hasControls && !hasCustomControls) {
        throw new Error('Video must have either native controls attribute or custom accessible controls')
      }

      // Check if video has captions/subtitles
      const hasCaptions = element.querySelector('track[kind="captions"], track[kind="subtitles"]')
      if (!hasCaptions) {
        throw new Error('Video should include captions or subtitles for accessibility')
      }
    }, 'video') // Each test defines its own selector

    test('should have descriptive title or aria-label', ({ element }) => {
      const title = element.getAttribute('title')
      const ariaLabel = element.getAttribute('aria-label')
      const ariaLabelledby = element.getAttribute('aria-labelledby')

      if (!title && !ariaLabel && !ariaLabelledby) {
        throw new Error('Video should have a title, aria-label, or aria-labelledby to describe its content')
      }
    }, 'video') // Each test defines its own selector
  })
}

async function executeTests() {
  const resultsContainer = document.getElementById('results')
  if (!resultsContainer) return

  // Show loading state
  resultsContainer.innerHTML = '<div class="loading">Running accessibility tests...</div>'

  try {
    // Debug element counts before running tests
    debugElementCounts()

    // Configure the runner with current settings
    const config = getConfig()

    // Create and configure plugins
    const plugins = []

    // ACT metadata plugin
    actPlugin = new ACTMetadataPlugin()
    actPlugin.registerRules(ACT_RULES)
    plugins.push(actPlugin)

    // Performance plugin
    if (config.performance) {
      performancePlugin = new PerformancePlugin()
      plugins.push(performancePlugin)
    }

    // Metrics plugin
    if (config.metrics) {
      metricsPlugin = new MetricsPlugin()
      plugins.push(metricsPlugin)
    }

    // Debugger plugin
    if (config.debugger) {
      debuggerPlugin = new DebuggerPlugin({
        logLevel: 'info',
        showElementCounts: true,
        showSampleElements: false
      })
      plugins.push(debuggerPlugin)
    }

    // Screenshot plugin (independent plugin)
    screenshotPlugin = new ScreenshotPlugin({
      enabled: true,
      onFailure: true,
      onPass: false,
      quality: 0.8,
      format: 'png',
      elementPadding: 10,
      fullPage: false
    })
    plugins.push(screenshotPlugin)

    // Add plugins to configuration
    config.plugins = plugins

    configure(config)

    // Clear any existing tests
    clear()

    // Define tests
    defineTests()

    // Run tests and get results
    const results = await runTests()
    lastResults = results

    // Display results
    displayResults(results)

    // Display plugin data
    displayPluginData()
  } catch (error) {
    console.error('Error running tests:', error)
    resultsContainer.innerHTML = `
      <div class="error-details">
        <h3>❌ Error running tests</h3>
        <p>${error.message}</p>
        <pre>${error.stack}</pre>
      </div>
    `
  }
}

function displayPluginData() {
  const container = document.getElementById('plugin-data')
  if (!container) return

  let html = '<div class="plugin-results">'

  // Performance data
  if (performancePlugin) {
    const perfData = performancePlugin.getData()
    if (perfData) {
      const testsPerSecond = (perfData.elementsProcessed / perfData.duration * 1000).toFixed(1)
      html += `
        <div class="plugin-section">
          <h4>🚀 Performance</h4>
          <div class="plugin-stats">
            <span>⚡ Speed: ${testsPerSecond} tests/sec</span>
            <span>⏱️ Duration: ${perfData.duration.toFixed(2)}ms</span>
            ${perfData.memoryUsage ? `<span>💾 Memory Δ: ${performancePlugin.formatMemory(perfData.memoryUsage.used)}</span>` : ''}
          </div>
        </div>
      `
    }
  }

  // Metrics data
  if (metricsPlugin) {
    const metricsData = metricsPlugin.getData()
    html += `
      <div class="plugin-section">
        <h4>📊 Metrics</h4>
        <div class="plugin-stats">
          <span>✅ Passed: ${metricsData.passed}</span>
          <span>❌ Failed: ${metricsData.failed}</span>
          <span>⏭️ Skipped: ${metricsData.skipped}</span>
          <span>📝 Todo: ${metricsData.todo}</span>
          <span>📋 Total: ${metricsData.total}</span>
          <span>📈 Pass Rate: ${metricsData.passRate.toFixed(1)}%</span>
          <span>📦 Suites: ${metricsData.suites}</span>
        </div>
      </div>
    `
  }

  // Debugger data
  if (debuggerPlugin) {
    const debugStats = debuggerPlugin.getElementStats()
    const testCounts = debuggerPlugin.getTestCounts()
    const memoryUsage = debuggerPlugin.getMemoryUsage()
    html += `
      <div class="plugin-section">
        <h4>🐛 Debug Info</h4>
        <div class="plugin-stats">
          <span>🎯 Elements Found: ${Array.from(debugStats.values()).reduce((sum, stat) => sum + stat.count, 0)}</span>
          <span>🧪 Tests Executed: ${testCounts.total}</span>
          <span>📝 Log Entries: ${memoryUsage.logEntries}/${memoryUsage.maxLogSize}</span>
          <span>📊 Element Stats: ${memoryUsage.elementStats}</span>
        </div>
      </div>
    `
  }

  // Screenshot data
  if (screenshotPlugin) {
    const screenshots = screenshotPlugin.getScreenshots()
    const memoryUsage = screenshotPlugin.getMemoryUsage()
    const formatBytes = (bytes) => {
      const units = ['B', 'KB', 'MB', 'GB']
      let size = bytes
      let unitIndex = 0
      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024
        unitIndex++
      }
      return `${Math.round(size * 100) / 100} ${units[unitIndex]}`
    }

    html += `
      <div class="plugin-section">
        <h4>📸 Screenshots</h4>
        <div class="plugin-stats">
          <span>📷 Captured: ${screenshots.length}/${memoryUsage.maxScreenshots}</span>
          <span>💾 Memory Used: ${formatBytes(memoryUsage.totalMemoryUsed)}</span>
          <span>📏 Avg Size: ${formatBytes(memoryUsage.averageScreenshotSize)}</span>
        </div>
        ${screenshots.length > 0 ? `
          <div class="screenshot-gallery">
            ${screenshots.map((result, index) => `
              <div class="screenshot-item ${result.outcome}">
                <div class="screenshot-header">
                  <span class="outcome-badge ${result.outcome}">${getOutcomeIcon(result.outcome)}</span>
                  <span class="test-name">${result.name}</span>
                  <span class="timestamp">${result.screenshot?.timestamp ? new Date(result.screenshot.timestamp).toLocaleTimeString() : ''}</span>
                </div>
                ${result.screenshot?.dataUrl ? `
                  <img
                    src="${result.screenshot.dataUrl}"
                    alt="Screenshot for ${result.name}"
                    class="screenshot-image"
                    onclick="this.classList.toggle('expanded')"
                    title="Click to expand/collapse"
                  />
                ` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `
  }

  html += '</div>'
  container.innerHTML = html
}

function displayResults(results) {
  const container = document.getElementById('results')
  if (!container) return

  // Calculate totals
  const totals = results.reduce((acc, suite) => {
    acc.passed += suite.passed
    acc.failed += suite.failed
    acc.skipped += suite.skipped
    acc.todo += suite.todo
    acc.total += suite.tests.length
    acc.duration += suite.duration
    return acc
  }, { passed: 0, failed: 0, skipped: 0, todo: 0, total: 0, duration: 0 })

  const passRate = totals.total > 0 ? (totals.passed / totals.total * 100).toFixed(1) : '0'

  // Create results HTML with ACT metadata
  let html = `
    <div class="results-summary ${totals.failed > 0 ? 'has-failures' : 'all-passed'}">
      <h3>📊 Test Results Summary</h3>
      <div class="stats-grid">
        <div class="stat">
          <span class="stat-value">${totals.total}</span>
          <span class="stat-label">Total Tests</span>
        </div>
        <div class="stat passed">
          <span class="stat-value">${totals.passed}</span>
          <span class="stat-label">Passed</span>
        </div>
        <div class="stat failed">
          <span class="stat-value">${totals.failed}</span>
          <span class="stat-label">Failed</span>
        </div>
        <div class="stat skipped">
          <span class="stat-value">${totals.skipped}</span>
          <span class="stat-label">Skipped</span>
        </div>
        <div class="stat">
          <span class="stat-value">${passRate}%</span>
          <span class="stat-label">Pass Rate</span>
        </div>
        <div class="stat">
          <span class="stat-value">${totals.duration.toFixed(2)}ms</span>
          <span class="stat-label">Duration</span>
        </div>
      </div>
    </div>
  `

  // Display each suite
  results.forEach(suite => {
    html += `
      <div class="test-suite">
        <h4>${suite.name}</h4>
        <div class="suite-stats">
          ${suite.passed} passed, ${suite.failed} failed, ${suite.skipped} skipped (${suite.duration.toFixed(2)}ms)
        </div>
        <div class="test-results">
    `

    suite.tests.forEach(test => {
      const statusIcon = {
        pass: '✅',
        fail: '❌',
        skip: '⏭️',
        todo: '📝'
      }[test.outcome] || '❓'

      // Display ACT metadata if available
      const metaInfo = test.meta ? `
        <div class="act-metadata">
          <strong>ACT Rule:</strong> ${test.meta.actRule} |
          <strong>WCAG:</strong> ${test.meta.wcagCriteria.join(', ')} |
          <strong>Impact:</strong> ${test.meta.impact} |
          <strong>Tags:</strong> ${test.meta.tags.join(', ')}
          ${test.meta.helpUrl ? `| <a href="${test.meta.helpUrl}" target="_blank">Help ↗</a>` : ''}
        </div>
      ` : ''

      html += `
        <div class="test-result ${test.outcome}" data-test-id="${test.id}">
          <div class="test-header">
            <span class="test-status">${statusIcon}</span>
            <span class="test-name">${test.name}</span>
            <span class="test-duration">${test.duration.toFixed(2)}ms</span>
          </div>
          ${metaInfo}
          <div class="test-message">${test.message}</div>
          ${test.element ? `
            <div class="test-element">
              <strong>Element:</strong> ${test.element.tagName.toLowerCase()}
              <div class="element-details">
                <div><strong>Selector:</strong> ${test.element.selector}</div>
                <div><strong>Text:</strong> "${test.element.textContent?.substring(0, 100) || '(no text)'}"</div>
                <details>
                  <summary>View HTML</summary>
                  <pre><code>${escapeHtml(test.element.outerHTML)}</code></pre>
                </details>
              </div>
            </div>
          ` : ''}
        </div>
      `
    })

    html += '</div></div>'
  })

  container.innerHTML = html

  // Add click handlers for element highlighting
  container.querySelectorAll('.test-result[data-test-id]').forEach(resultEl => {
    resultEl.addEventListener('click', () => {
      const testId = resultEl.dataset.testId
      highlightElement(testId)
    })
  })
}

// Utility function to escape HTML
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function getOutcomeIcon(outcome) {
  switch (outcome) {
    case 'pass': return '✅'
    case 'fail': return '❌'
    case 'skip': return '⏭️'
    case 'todo': return '📝'
    default: return '❓'
  }
}

// Highlight element in the page
function highlightElement(testId) {
  // Clear existing highlights
  clearHighlights()

  // Find the test result to get element info
  if (!lastResults) return

  for (const suite of lastResults) {
    const test = suite.tests.find(t => t.id === testId)
    if (test && test.element) {
      // Try to find the element using the selector
      const elements = document.querySelectorAll(test.element.selector || test.element.tagName.toLowerCase())

      // Find the specific element by matching text content or other attributes
      let targetElement = null
      for (const el of elements) {
        if (el.outerHTML === test.element.outerHTML ||
            (el.textContent?.trim() === test.element.textContent?.trim() && el.tagName.toLowerCase() === test.element.tagName.toLowerCase())) {
          targetElement = el
          break
        }
      }

      if (targetElement) {
        const highlightClass = `highlight-${test.outcome}`
        targetElement.classList.add(highlightClass)
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' })

        // Remove highlight after 3 seconds
        setTimeout(() => {
          targetElement.classList.remove(highlightClass)
        }, 3000)
      }
      break
    }
  }
}

function clearHighlights() {
  // Remove all highlight classes
  document.querySelectorAll('.highlight-pass, .highlight-fail, .highlight-skip').forEach(el => {
    el.classList.remove('highlight-pass', 'highlight-fail', 'highlight-skip')
  })
}

function showConfig() {
  const config = getConfig()
  alert(`Current Configuration:

🔌 Plugins:
  - Performance: ${config.performance ? '✅' : '❌'}
  - Metrics: ${config.metrics ? '✅' : '❌'}
  - Debugger: ${config.debugger ? '✅' : '❌'}
  - AllyStudio: ${config.allyStudio ? '✅' : '❌'}

📊 Reporter: ${config.reporter}
📝 Verbose: ${config.reporterConfig.verbose ? '✅' : '❌'}
🛑 Bail on failure: ${config.bail ? '✅' : '❌'}
⏱️ Timeout: ${config.timeout}ms`)
}

// Export results for external tools
window.exportResults = function() {
  if (!lastResults) {
    alert('No test results to export. Run tests first.')
    return
  }

  const exportData = {
    timestamp: new Date().toISOString(),
    config: getConfig(),
    results: lastResults
  }

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `accessibility-test-results-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  const runButton = document.getElementById('run-tests-btn')
  const clearButton = document.getElementById('clear-highlights-btn')
  const configButton = document.getElementById('show-config-btn')

  if (runButton) {
    runButton.addEventListener('click', executeTests)
  }

  if (clearButton) {
    clearButton.addEventListener('click', clearHighlights)
  }

  if (configButton) {
    configButton.addEventListener('click', showConfig)
  }

  // Auto-run tests on configuration changes
  const configInputs = document.querySelectorAll('#performance, #metrics, #debugger, #allyStudio, #reporter, #verbose, #bail, #timeout')
  configInputs.forEach(input => {
    input.addEventListener('change', () => {
      // Debounce auto-run to avoid too many test runs
      clearTimeout(window.configChangeTimeout)
      window.configChangeTimeout = setTimeout(() => {
        if (lastResults) {
          console.log('Configuration changed, re-running tests...')
          executeTests()
        }
      }, 500)
    })
  })
})
