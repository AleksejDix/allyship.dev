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

## Missing Accessibility Rules

The following categories of accessibility rules are currently missing from our implementation and should be added to provide comprehensive coverage of WCAG requirements.

## Form Accessibility Rules

### Critical Priority

- [ ] Implement form label association checks (WCAG 3.3.2, 4.1.2)
- [ ] Add input purpose identification validation (WCAG 1.3.5)
- [ ] Implement form error identification and suggestion tests (WCAG 3.3.1, 3.3.3)

### High Priority

- [ ] Add required field indication checks
- [ ] Implement form submission validation
- [ ] Add checks for proper form grouping (fieldset, legend)
- [ ] Implement autocomplete attribute validation

### Medium Priority

- [ ] Add validation for form controls with implicit roles
- [ ] Implement check for redundant form labels
- [ ] Add validation of custom form controls

## Color and Contrast Rules

### Critical Priority

- [ ] Implement text contrast ratio validation (WCAG 1.4.3)
- [ ] Add UI component contrast checks (WCAG 1.4.11)
- [ ] Implement color-only information detection (WCAG 1.4.1)

### High Priority

- [ ] Add checks for text spacing overrides (WCAG 1.4.12)
- [ ] Implement hover/focus content contrast validation
- [ ] Add check for high contrast mode compatibility

### Medium Priority

- [ ] Implement color blindness simulation
- [ ] Add contrast tests for non-text content
- [ ] Add validation for reflow/responsive design contrast

## Table Accessibility Rules

### High Priority

- [ ] Implement table headers and data cell association checks (WCAG 1.3.1)
- [ ] Add caption and summary validation
- [ ] Implement layout table detection and appropriate role usage
- [ ] Add complex table accessibility validation

### Medium Priority

- [ ] Implement check for proper scope attributes
- [ ] Add validation for table headers (th vs td with scope)
- [ ] Implement check for nested tables

## ARIA Implementation Rules

### Critical Priority

- [ ] Implement ARIA landmark usage validation
- [ ] Add ARIA role validity checks
- [ ] Implement ARIA state and property validation
- [ ] Add ARIA relationship attribute validation

### High Priority

- [ ] Implement checks for redundant ARIA attributes
- [ ] Add validation for ARIA required children/parents
- [ ] Implement ARIA hidden usage validation

### Medium Priority

- [ ] Add check for proper ARIA live region usage
- [ ] Implement validation for aria-expanded state on appropriate elements
- [ ] Add validation for aria-selected in selectable widgets

## Multimedia Rules

### High Priority

- [ ] Implement checks for video captions (WCAG 1.2.2)
- [ ] Add audio transcript validation (WCAG 1.2.1)
- [ ] Implement media player accessibility checks
- [ ] Add video audio description validation (WCAG 1.2.3, 1.2.5)

### Medium Priority

- [ ] Implement media autoplay prevention checks
- [ ] Add validation for proper media controls
- [ ] Implement check for sign language in video content

## Page Structure Rules

### High Priority

- [ ] Implement skip navigation link validation
- [ ] Add landmark/region organization checks
- [ ] Implement document title validation (WCAG 2.4.2)
- [ ] Add page meta information validation

### Medium Priority

- [ ] Implement check for proper main content structure
- [ ] Add validation for sidebar/complementary content
- [ ] Implement iframe title validation (WCAG 2.4.1)

## Code Implementation Example for Form Rules

```javascript
// Example implementation for form label association rule
createACTRule(
  "form-label-association",
  "Form controls must have associated labels",
  "This rule checks that all form controls have properly associated labels.",
  {
    accessibility_requirements: getWCAGReference(["3.3.2", "4.1.2"]),
    categories: [ACTRuleCategory.FORMS],
    implementation_url:
      "https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html",

    isApplicable: () => {
      const formControls = document.querySelectorAll(
        'input:not([type="hidden"]):not([type="button"]):not([type="submit"]):not([type="reset"]), ' +
        'select, textarea, [role="combobox"], [role="listbox"], [role="slider"], [role="spinbutton"]'
      );
      return formControls.length > 0;
    },

    execute: async () => {
      const formControls = document.querySelectorAll(
        'input:not([type="hidden"]):not([type="button"]):not([type="submit"]):not([type="reset"]), ' +
        'select, textarea, [role="combobox"], [role="listbox"], [role="slider"], [role="spinbutton"]'
      );

      for (const control of Array.from(formControls)) {
        const element = control as HTMLElement;
        const id = element.id;
        const accessibleName = getAccessibleName(element);

        // Check for label association methods
        const hasExplicitLabel = id && document.querySelector(`label[for="${id}"]`);
        const hasImplicitLabel = element.closest('label') !== null;
        const hasAriaLabel = element.hasAttribute('aria-label');
        const hasAriaLabelledby = element.hasAttribute('aria-labelledby');
        const isDisabled = element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true';
        const isHidden = element.hasAttribute('hidden') || element.getAttribute('aria-hidden') === 'true';

        // Skip disabled or hidden inputs
        if (isDisabled || isHidden) continue;

        // Calculate result
        const hasLabel = hasExplicitLabel || hasImplicitLabel || hasAriaLabel || hasAriaLabelledby;
        const passed = hasLabel && accessibleName.trim().length > 0;

        // Create message
        let message = '';
        if (passed) {
          message = `Form control has accessible name: "${accessibleName}"`;
        } else {
          if (!hasLabel) {
            message = 'Form control has no associated label';
          } else {
            message = 'Form control has empty associated label';
          }
        }

        // Add result
        actRuleRunner.addResult({
          rule: {
            id: "form-label-association",
            name: "Form controls must have associated labels"
          },
          outcome: passed ? "passed" : "failed",
          element: {
            selector: getCssSelector(element),
            html: element.outerHTML
          },
          message,
          impact: "Serious",
          wcagCriteria: ["3.3.2", "4.1.2"],
          helpUrl: "https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html",
          remediation: passed ? undefined :
            `Add a label element with a for attribute matching the control's id,
             or wrap the control in a label element,
             or add aria-label or aria-labelledby attributes.`
        });
      }
    }
  }
);
```

## Priority for Implementation

1. **First Phase:**

   - Form Accessibility Rules
   - Color and Contrast Rules
   - ARIA Implementation Rules

2. **Second Phase:**

   - Table Accessibility Rules
   - Page Structure Rules
   - Parsing and Compatibility Rules

3. **Third Phase:**
   - Multimedia Rules
   - Additional specialized tests
