# Accessibility Testing Rules

This directory contains the accessibility testing rules implemented in AllyStudio's accessibility checking engine. These rules are used to evaluate web pages against accessibility standards and guidelines, primarily WCAG 2.1.

## Overview

Our accessibility testing framework is based on the W3C's [Accessibility Conformance Testing (ACT) Rules](https://www.w3.org/WAI/standards-guidelines/act/rules/). It aims to provide:

1. **Reliable** - Consistent results across different runs and environments
2. **Accurate** - Minimal false positives and negatives
3. **Comprehensive** - Coverage of critical WCAG success criteria
4. **Actionable** - Clear guidance on how to fix issues

## Rule Structure

Each accessibility rule follows a consistent structure:

```javascript
export const myAccessibilityRule: ACTRule = {
  id: "ally-rule-unique-id",
  name: "Human-readable rule name",
  description: "Detailed description of what this rule checks for",
  wcag: [
    {
      success_criterion: "1.1.1",
      level: "A",
      url: "https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html",
    },
  ],
  type: "atomic", // or "composite"
  outcome: "failed", // default outcome if rule is triggered
  test: ({ ast, evaluator, actRuleRunner }) => {
    // Rule implementation logic
    // 1. Find relevant elements
    // 2. Evaluate accessibility criteria
    // 3. Add results for violations

    const elementsToTest = ast.querySelectorAll("selector");

    elementsToTest.forEach((element) => {
      if (violatesAccessibilityCriteria(element)) {
        actRuleRunner.addResult({
          type: "failed",
          element: element,
          message: "Human-readable explanation of the issue",
          selector: getValidSelector(element),
          code: getElementCode(element),
          explanation: "Detailed explanation of why this is an issue and how to fix it",
        });
      }
    });
  },
};
```

## Recent Improvements

We've made significant technical improvements to our testing framework:

1. **Enhanced Element Highlighting System**: Improved visual feedback with pulsing animations that properly clear previous highlights and use multiple methods (CSS selectors, XPath, ID lookup) to find and scroll to elements.

2. **Improved Selector Generation**: Replaced the old `getCssSelector` function with a more robust `getValidSelector` function across all rule files, ensuring reliable element identification even with special characters in IDs.

## Rule Categories

Our rules are organized into the following categories:

1. **Headings**: Proper heading structure and content
2. **Images**: Alternative text and visual content
3. **Links**: Link text, purpose, and function
4. **Forms**: Labels, instructions, and validation
5. **ARIA**: Proper use of ARIA roles, states, and properties
6. **Color**: Contrast and color usage
7. **Structure**: Document structure and semantics
8. **Focus**: Keyboard focus and navigation

## Implementation Progress

Our implementation progress is tracked in the following documents:

- [Critical Priority TODOs](./critical-priority-todos.md): High-priority rules being implemented
- [Missing Rules TODOs](./missing-rules-todos.md): Comprehensive list of rules to be implemented

## Contributing

When creating new rules:

1. Follow the standard rule structure
2. Include clear WCAG references
3. Provide detailed explanations and remediation guidance
4. Use the `getValidSelector()` utility for element selection

## Testing

Rules should be tested against real-world scenarios to ensure they:

1. Correctly identify accessibility issues
2. Provide clear guidance on how to fix issues
3. Minimize false positives and negatives
4. Perform efficiently
