# Critical Priority TODOs for Accessibility Rules

## Technical Foundations - Recently Completed

- ✅ **Enhanced Element Highlighting System**: We've implemented a robust highlighting system with pulsing animations that properly clears previous highlights and uses multiple methods (CSS selectors, XPath, ID lookup) to find and scroll to elements.

- ✅ **Improved Selector Generation**: Replaced `getCssSelector` with more robust `getValidSelector` function across all rule files, ensuring reliable element identification even with special characters in IDs.

## Implementation Priorities

The list below represents critical WCAG requirements that should be prioritized for implementation. The items are roughly ordered by priority.

- [ ] **Keyboard Focus Indicators**: WCAG 2.4.7 - Focus Visible

  - Status: Partial implementation
  - Tests: Focus visible CSS check, :focus state detection, outline:none without alternative
  - Todo: Expand tests to check for sufficient contrast of focus indicators and acceptable alternatives

- [ ] **Heading Structure**: WCAG 1.3.1 - Info and Relationships, 2.4.1 - Bypass Blocks, 2.4.6 - Headings and Labels, 2.4.10 - Section Headings

  - Status: Basic implementation
  - Tests: Checks for heading levels, missing headings
  - Todo: Evaluate heading hierarchy, detect missing h1, evaluate heading content quality

- [ ] **Alternative Text for Images**: WCAG 1.1.1 - Non-text Content

  - Status: Basic implementation
  - Tests: Missing alt checks, empty alt detection
  - Todo: Improve detection of decorative vs. informative images, evaluate alt text quality

- [ ] **Form Labels**: WCAG 1.3.1 - Info and Relationships, 3.3.2 - Labels or Instructions, 4.1.2 - Name, Role, Value

  - Status: Partial implementation
  - Tests: Missing label checks, label association
  - Todo: Improve detection of visible labels using aria-labelledby, validate label content quality

- [ ] **Landmarks and Page Structure**: WCAG 1.3.1 - Info and Relationships, 2.4.1 - Bypass Blocks

  - Status: Initial implementation
  - Tests: Basic landmark presence
  - Todo: Evaluate proper use of landmarks, check for appropriate content within landmarks

- [ ] **Semantic HTML**: WCAG 1.3.1 - Info and Relationships, 4.1.1 - Parsing

  - Status: Limited implementation
  - Tests: Basic HTML validity
  - Todo: Expand checks for appropriate HTML element usage, detect div/span misuse

- [ ] **ARIA Usage**: WCAG 4.1.2 - Name, Role, Value

  - Status: Partial implementation
  - Tests: Basic ARIA validity checks
  - Todo: Expand role, state, and property validation, detect conflicting or redundant ARIA

- [ ] **Color Contrast**: WCAG 1.4.3 - Contrast (Minimum), 1.4.11 - Non-text Contrast

  - Status: Planned
  - Tests: None
  - Todo: Implement text contrast evaluation, non-text UI element contrast checks

- [ ] **Language of Page**: WCAG 3.1.1 - Language of Page

  - Status: Planned
  - Tests: None
  - Todo: Check for presence and validity of lang attribute

- [ ] **Link Purpose**: WCAG 2.4.4 - Link Purpose (In Context), 2.4.9 - Link Purpose (Link Only)
  - Status: Planned
  - Tests: None
  - Todo: Detect empty links, evaluate link text quality, check for redundant links

## Implementation Plan

1. Finish improving UX for existing rule results presentation
2. Complete the core technical foundations for testing and result reporting
3. Continue implementing critical rules in priority order
4. Expand test coverage to cover more edge cases
5. Add more detailed remediation guidance
