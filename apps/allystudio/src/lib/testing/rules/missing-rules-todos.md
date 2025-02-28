# Missing Accessibility Rules - Implementation TODOs

## Existing Rule Categories

We currently have implemented the following rule categories:

1. **Heading Rules**

   - Heading accessible name checks
   - First heading is H1 validation
   - Heading order and hierarchy validation

2. **Focus Rules**

   - Focus visibility checks for interactive elements
   - Focus order and logical sequence validation

3. **Link Rules**

   - Link accessible name validation
   - Descriptive link text checks
   - Link text length validation
   - Duplicate link text detection

4. **Language of Page Rules**

   - HTML lang attribute presence and validity

5. **Button Accessible Name Rules**

   - Button accessible name validation (native and ARIA buttons)

6. **Image Accessible Name Rules**
   - Image alt text and accessible name validation
   - Decorative image handling

## Missing ACT Rules

The Accessibility Conformance Testing (ACT) Rules framework by W3C includes many rules that are currently missing from our implementation. Below is a comprehensive list of missing rule categories and specific tests that should be added to provide complete WCAG coverage.

## Form Accessibility Rules

### Critical Priority

- [ ] Implement form label association checks (WCAG 3.3.2, 4.1.2)
- [ ] Add input purpose identification validation (WCAG 1.3.5)
- [ ] Implement form error identification and suggestion tests (WCAG 3.3.1, 3.3.3)
- [ ] Add validation for form instructions (WCAG 3.3.2)
- [ ] Implement keyboard accessibility for all form controls (WCAG 2.1.1)

### High Priority

- [ ] Add required field indication checks
- [ ] Implement form submission validation
- [ ] Add checks for proper form grouping (fieldset, legend)
- [ ] Implement autocomplete attribute validation
- [ ] Add ARIA role validation for custom form controls
- [ ] Implement error prevention for important submissions (WCAG 3.3.4)

### Medium Priority

- [ ] Add validation for form controls with implicit roles
- [ ] Implement check for redundant form labels
- [ ] Add validation of custom form controls
- [ ] Implement form timing constraints checks

## Color and Contrast Rules

### Critical Priority

- [ ] Implement text contrast ratio validation (WCAG 1.4.3)
- [ ] Add UI component contrast checks (WCAG 1.4.11)
- [ ] Implement color-only information detection (WCAG 1.4.1)
- [ ] Add contrast for focus indicators (WCAG 1.4.11)
- [ ] Implement validation for text overlaid on background images (WCAG 1.4.3)

### High Priority

- [ ] Add checks for text spacing overrides (WCAG 1.4.12)
- [ ] Implement hover/focus content contrast validation
- [ ] Add check for high contrast mode compatibility
- [ ] Implement graphical object contrast checking
- [ ] Add validation for infographics and data visualization contrast

### Medium Priority

- [ ] Implement color blindness simulation
- [ ] Add contrast tests for non-text content
- [ ] Add validation for reflow/responsive design contrast
- [ ] Implement automated colorimetric testing for common color combinations
- [ ] Add visual boundary detection for adjacent UI elements

## Table Accessibility Rules

### High Priority

- [ ] Implement table headers and data cell association checks (WCAG 1.3.1)
- [ ] Add caption and summary validation
- [ ] Implement layout table detection and appropriate role usage
- [ ] Add complex table accessibility validation
- [ ] Implement table header scope validation
- [ ] Add header/data cell relationship checking
- [ ] Implement row/column header checks for data tables

### Medium Priority

- [ ] Implement check for proper scope attributes
- [ ] Add validation for table headers (th vs td with scope)
- [ ] Implement check for nested tables
- [ ] Add header cell ID uniqueness validation
- [ ] Implement table linearization testing

## ARIA Implementation Rules

### Critical Priority

- [ ] Implement ARIA landmark usage validation
- [ ] Add ARIA role validity checks
- [ ] Implement ARIA state and property validation
- [ ] Add ARIA relationship attribute validation
- [ ] Implement ARIA required attribute checks
- [ ] Add validation for proper use of aria-hidden
- [ ] Implement check for proper heading role usage
- [ ] Add validation of aria-label and aria-labelledby references

### High Priority

- [ ] Implement checks for redundant ARIA attributes
- [ ] Add validation for ARIA required children/parents
- [ ] Implement ARIA hidden usage validation
- [ ] Add check for ARIA role conflicts
- [ ] Implement validation for ARIA attributes on inappropriate elements
- [ ] Add check for valid ARIA attribute values

### Medium Priority

- [ ] Add check for proper ARIA live region usage
- [ ] Implement validation for aria-expanded state on appropriate elements
- [ ] Add validation for aria-selected in selectable widgets
- [ ] Implement check for ARIA presentation role conflicts
- [ ] Add validation for ARIA alert and dialog implementation
- [ ] Implement check for proper ARIA menu implementation

## HTML Structure and Parsing Rules

### Critical Priority

- [ ] Implement valid DOCTYPE declaration check
- [ ] Add HTML validation (no duplicate IDs, proper element nesting)
- [ ] Implement parsing error detection (malformed HTML elements)
- [ ] Add check for empty ID values
- [ ] Implement validation for programmatically determined content structure

### High Priority

- [ ] Add proper list markup checking (ul/ol/dl for structured content)
- [ ] Implement validation for semantic HTML usage
- [ ] Add check for markup versus visual structure consistency
- [ ] Implement validation for proper sectioning element usage

### Medium Priority

- [ ] Add validation for meaningful sequence (DOM order matches visual order)
- [ ] Implement check for proper definition list usage
- [ ] Add validation for element nesting patterns
- [ ] Implement check for validity of custom data attributes

## Pointer and Motion Input Rules

### Critical Priority

- [ ] Implement pointer gesture alternatives check (WCAG 2.5.1)
- [ ] Add validation for motion actuation alternatives (WCAG 2.5.4)
- [ ] Implement target size validation (44×44px minimum) (WCAG 2.5.5)
- [ ] Add check for pointer cancellation (single-point activation) (WCAG 2.5.2)

### High Priority

- [ ] Implement hover/focus trigger validation
- [ ] Add check for content that appears on hover/focus is dismissible
- [ ] Implement validation for pointer interactions
- [ ] Add check for touch target spacing

### Medium Priority

- [ ] Implement complex gesture detection
- [ ] Add validation for device motion usage
- [ ] Implement check for concurrent input method support
- [ ] Add validation for input modality detection and adaption

## Time and Timing Rules

### Critical Priority

- [ ] Implement session timeout warning and extension check (WCAG 2.2.1)
- [ ] Add animation control validation (pause, stop, hide) (WCAG 2.2.2)
- [ ] Implement time limit extension validation (WCAG 2.2.1)
- [ ] Add check for auto-updating content control mechanisms

### High Priority

- [ ] Implement validation for timing adjustability
- [ ] Add check for moving/scrolling content control
- [ ] Implement validation for animation from interactions
- [ ] Add check for proper use of reduced motion queries

### Medium Priority

- [ ] Implement auto-play prevention checking
- [ ] Add validation for carousels and slideshows
- [ ] Implement check for interruption minimization
- [ ] Add validation for transition timing

## Content Adaptation Rules

### Critical Priority

- [ ] Implement text resizing validation (content usable at 200% zoom) (WCAG 1.4.4)
- [ ] Add content reflow checking for narrow viewports (320px) (WCAG 1.4.10)
- [ ] Implement orientation support validation (not restricted to portrait/landscape) (WCAG 1.3.4)
- [ ] Add check for line height and spacing adjustability (WCAG 1.4.12)

### High Priority

- [ ] Implement validation for responsive design breakpoints
- [ ] Add check for content preserving its information when zoomed
- [ ] Implement validation for text spacing override support
- [ ] Add check for content adaptation across different viewport sizes

### Medium Priority

- [ ] Implement check for print stylesheet accessibility
- [ ] Add validation for high contrast mode compatibility
- [ ] Implement check for user preference media query support
- [ ] Add validation for proper use of CSS relative units

## Status Messages Rules

### High Priority

- [ ] Implement status message identification and announcement check (WCAG 4.1.3)
- [ ] Add validation for ARIA live region implementation
- [ ] Implement check for dynamic content change notifications
- [ ] Add validation for proper use of role="status", role="alert", role="log"

### Medium Priority

- [ ] Implement check for proper alert timing and dismissal
- [ ] Add validation for non-intrusive notifications
- [ ] Implement check for status message visibility
- [ ] Add validation for real-time messaging accessibility

## Parsing and Compatibility Rules

### Critical Priority

- [ ] Implement name, role, value determination for all UI components (WCAG 4.1.2)
- [ ] Add status message programmatic determination check (WCAG 4.1.3)
- [ ] Implement validation for consistent implementation across browsers
- [ ] Add check for mandatory attribute presence
- [ ] Implement validation for custom element accessibility

### High Priority

- [ ] Add check for implicit semantics preservation
- [ ] Implement validation for deprecated element/attribute usage
- [ ] Add check for browser compatibility issues
- [ ] Implement validation for correct ARIA implementation

### Medium Priority

- [ ] Add check for proper use of custom elements
- [ ] Implement validation for shadow DOM accessibility
- [ ] Add check for progressive enhancement patterns
- [ ] Implement validation for polyfill usage

## Cognitive Accessibility Rules

### High Priority

- [ ] Implement reading level assessment (WCAG 3.1.5)
- [ ] Add unusual word identification and explanation check (WCAG 3.1.3)
- [ ] Implement validation for abbreviation expansion on first use (WCAG 3.1.4)
- [ ] Add check for consistent navigation and identification (WCAG 3.2.3)
- [ ] Implement validation for predictable page behavior (WCAG 3.2.1, 3.2.2)

### Medium Priority

- [ ] Add check for clear section headings
- [ ] Implement validation for consistent help mechanisms
- [ ] Add check for content readability metrics
- [ ] Implement validation for content summarization

## Audio Control Rules

### High Priority

- [ ] Implement audio control mechanism check (separate from system volume) (WCAG 1.4.2)
- [ ] Add validation for background audio control or elimination
- [ ] Implement check for audio that plays automatically
- [ ] Add validation for audio duration and control options

### Medium Priority

- [ ] Implement check for audio volume control
- [ ] Add validation for proper use of audio description
- [ ] Implement check for audio-only content alternatives

## Sensory Characteristics Rules

### High Priority

- [ ] Implement check for instructions not relying solely on sensory characteristics (WCAG 1.3.3)
- [ ] Add validation for multiple ways to locate content (WCAG 2.4.5)
- [ ] Implement check for content that depends on specific sensory capabilities
- [ ] Add validation for non-text contrast (WCAG 1.4.11)

### Medium Priority

- [ ] Implement check for sensory-based instruction alternatives
- [ ] Add validation for directional language usage
- [ ] Implement check for spatial relationship requirements

## Code Implementation Example for HTML Structure Validation

```javascript
// Example implementation for duplicate ID check rule
createACTRule(
  "html-duplicate-id",
  "HTML elements must have unique id attributes",
  "This rule checks that all elements with id attributes have unique values.",
  {
    accessibility_requirements: getWCAGReference(["4.1.1"]),
    categories: [ACTRuleCategory.PARSING],
    implementation_url:
      "https://www.w3.org/WAI/WCAG21/Understanding/parsing.html",

    isApplicable: () => {
      const elementsWithId = document.querySelectorAll("[id]")
      return elementsWithId.length > 0
    },

    execute: async () => {
      const elementsWithId = document.querySelectorAll("[id]")
      const idMap = new Map()

      // Find all elements with IDs and group them
      for (const element of Array.from(elementsWithId)) {
        const id = element.id.trim()

        // Skip empty IDs (different issue)
        if (!id) continue

        if (!idMap.has(id)) {
          idMap.set(id, [])
        }

        idMap.get(id).push(element)
      }

      // Check for duplicates
      for (const [id, elements] of idMap.entries()) {
        if (elements.length > 1) {
          // Duplicate ID found
          const elementDetails = elements.map((el) => ({
            selector: getCssSelector(el),
            html:
              el.outerHTML.slice(0, 100) +
              (el.outerHTML.length > 100 ? "..." : "")
          }))

          actRuleRunner.addResult({
            rule: {
              id: "html-duplicate-id",
              name: "HTML elements must have unique id attributes"
            },
            outcome: "failed",
            element: elementDetails[0],
            message: `Duplicate ID "${id}" found on ${elements.length} elements`,
            impact: "Serious",
            wcagCriteria: ["4.1.1"],
            helpUrl: "https://www.w3.org/WAI/WCAG21/Understanding/parsing.html",
            remediation: `Ensure each element has a unique id attribute.
                          The following elements share the same id "${id}":
                          ${elementDetails.map((d) => d.selector).join(", ")}`,
            relatedElements: elementDetails.slice(1)
          })
        } else {
          // ID is unique - this is good
          actRuleRunner.addResult({
            rule: {
              id: "html-duplicate-id",
              name: "HTML elements must have unique id attributes"
            },
            outcome: "passed",
            element: {
              selector: getCssSelector(elements[0]),
              html: elements[0].outerHTML
            },
            message: `Element has unique ID "${id}"`,
            wcagCriteria: ["4.1.1"]
          })
        }
      }
    }
  }
)
```

## Implementation Example for Color Contrast

```javascript
// Example implementation approach for text contrast rule
createACTRule(
  "text-contrast",
  "Text must have sufficient contrast against its background",
  "This rule checks that all text meets the minimum contrast requirements.",
  {
    accessibility_requirements: getWCAGReference(["1.4.3"]),
    categories: [ACTRuleCategory.COLOR],
    implementation_url:
      "https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html",

    isApplicable: () => {
      const textElements = document.querySelectorAll(
        "p, h1, h2, h3, h4, h5, h6, span, a, button, label"
      )
      return textElements.length > 0
    },

    execute: async () => {
      const textElements = document.querySelectorAll(
        "p, h1, h2, h3, h4, h5, h6, span, a, button, label"
      )

      for (const element of Array.from(textElements)) {
        // Skip elements with no text content
        if (!element.textContent.trim()) continue

        // Skip hidden elements
        if (isElementHidden(element)) continue

        const styles = window.getComputedStyle(element)
        const fontSize = parseFloat(styles.fontSize)
        const fontWeight = styles.fontWeight

        // Determine if text is large according to WCAG
        const isLargeText =
          fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700)

        // Get text and background colors
        const textColor = styles.color
        const bgColor = getEffectiveBackgroundColor(element)

        // Calculate contrast ratio
        const contrastRatio = calculateContrastRatio(textColor, bgColor)

        // Determine if it passes based on text size
        const requiredRatio = isLargeText ? 3.0 : 4.5
        const passed = contrastRatio >= requiredRatio

        // Add result
        actRuleRunner.addResult({
          rule: {
            id: "text-contrast",
            name: "Text must have sufficient contrast"
          },
          outcome: passed ? "passed" : "failed",
          element: {
            selector: getCssSelector(element),
            html:
              element.outerHTML.slice(0, 100) +
              (element.outerHTML.length > 100 ? "..." : "")
          },
          message: passed
            ? `Text has sufficient contrast ratio of ${contrastRatio.toFixed(2)}:1`
            : `Text has insufficient contrast ratio of ${contrastRatio.toFixed(2)}:1 (required: ${requiredRatio}:1)`,
          impact: passed
            ? undefined
            : contrastRatio >= requiredRatio - 1
              ? "Moderate"
              : "Serious",
          wcagCriteria: ["1.4.3"],
          helpUrl:
            "https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html",
          remediation: passed
            ? undefined
            : `Increase the contrast between the text color (${textColor}) and
             background color (${bgColor}) to at least ${requiredRatio}:1.`
        })
      }
    }
  }
)

// Helper functions
function isElementHidden(element) {
  const styles = window.getComputedStyle(element)
  return (
    styles.display === "none" ||
    styles.visibility === "hidden" ||
    element.hasAttribute("hidden")
  )
}

function getEffectiveBackgroundColor(element) {
  // Complex function to determine the actual background color,
  // accounting for transparency and parent backgrounds
  // This would need a sophisticated implementation
  // possibly using canvas to sample the actual rendered colors
}

function calculateContrastRatio(color1, color2) {
  // Convert colors to luminance values and calculate ratio
  // according to WCAG 2.1 definition
  // This would need a proper color parsing and math implementation
}
```

## Priority for Implementation

1. **First Phase (Critical):**

   - HTML Structure and Parsing Rules
   - Critical ARIA Implementation Rules
   - Color Contrast Rules (text and UI components)
   - Form Label and Name Accessibility

2. **Second Phase (High):**

   - Remaining Form Accessibility Rules
   - Table Accessibility Rules
   - Pointer and Motion Input Rules
   - Status Messages Rules

3. **Third Phase (Medium):**

   - Content Adaptation Rules
   - Cognitive Accessibility Rules
   - Audio Control Rules
   - Time and Timing Rules

4. **Fourth Phase (Extensions):**
   - Enhanced Color Contrast Rules
   - Advanced ARIA Implementation Rules
   - Specialized Content Accessibility Rules
   - Cross-browser Compatibility Testing

## ACT Rule Mapping

Many of these rules align with specific W3C ACT Rules. To ensure complete coverage, we should map our implementation to these standardized rules:

- Form label association maps to ACT Rule 97a4e1
- Page language maps to ACT Rule 5b7ae0
- Image text alternatives maps to ACT Rules cae760, 23a2a8
- Button name maps to ACT Rule 97a4e1
- Duplicate ID maps to ACT Rule 3ea0c8
- Text contrast maps to ACT Rule afw4f7

A complete mapping would help ensure our implementation covers all standardized accessibility tests.

## Test Coverage Strategy

To ensure we handle real-world scenarios, our test coverage should include:

1. **Component-level testing:** Individual UI elements in isolation
2. **Integration testing:** Components working together
3. **Page-level testing:** Complete pages with complex structures
4. **Cross-device testing:** Mobile, tablet, and desktop views
5. **User scenario testing:** Common user journeys and flows

This layered approach will help catch issues at various levels of complexity.
