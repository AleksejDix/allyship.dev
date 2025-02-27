# WCAG ACT Tests Implementation Plan

## Overview

This document outlines the implementation plan for comprehensive Accessibility Conformance Testing (ACT) based on Web Content Accessibility Guidelines (WCAG) 2.1. The test suites will be organized according to the four main WCAG principles: Perceivable, Operable, Understandable, and Robust (POUR).

## Test Suite Structure

```
/suites
  /wcag
    /perceivable
      - text-alternatives.ts
      - time-based-media.ts
      - adaptable.ts
      - distinguishable.ts
    /operable
      - keyboard-accessible.ts
      - enough-time.ts
      - seizures.ts
      - navigable.ts
      - input-modalities.ts
    /understandable
      - readable.ts
      - predictable.ts
      - input-assistance.ts
    /robust
      - compatible.ts
    index.ts
```

## Implementation Todo List

### 1. Initial Setup

- [x] Create directory structure for WCAG test suites
- [x] Set up main index files for each principle category
- [x] Create test utilities specific to WCAG requirements
- [x] Implement severity mapping to WCAG level (A, AA, AAA)

### 2. Perceivable Tests

#### 1.1 Text Alternatives

- [x] Implement test for non-text content having text alternatives (1.1.1)
  - [x] Images with alt text
  - [x] SVG with titles/descriptions
  - [ ] Form controls with labels
  - [ ] Multimedia with alternatives

#### 1.2 Time-based Media

- [ ] Create tests for multimedia alternatives (1.2.1-1.2.9)
  - [ ] Audio-only and video-only prerecorded content
  - [ ] Captions for prerecorded audio
  - [ ] Audio description or media alternative
  - [ ] Live captions
  - [ ] Sign language interpretation

#### 1.3 Adaptable

- [ ] Implement tests for information structure (1.3.1-1.3.6)
  - [ ] Correct use of semantic HTML
  - [ ] Meaningful sequence
  - [ ] Sensory characteristics
  - [ ] Orientation
  - [ ] Input purpose identification
  - [ ] Purpose identification

#### 1.4 Distinguishable

- [ ] Create tests for content distinguishability (1.4.1-1.4.13)
  - [ ] Color contrast
  - [ ] Audio control
  - [ ] Text resizing
  - [ ] Images of text
  - [ ] Visual presentation
  - [ ] Text spacing
  - [ ] Content on hover or focus
  - [ ] Reflow
  - [ ] Non-text contrast

### 3. Operable Tests

#### 2.1 Keyboard Accessible

- [ ] Implement tests for keyboard accessibility (2.1.1-2.1.4)
  - [ ] Keyboard operable
  - [ ] No keyboard trap
  - [ ] Keyboard shortcuts
  - [ ] Character key shortcuts

#### 2.2 Enough Time

- [ ] Create tests for timing adjustments (2.2.1-2.2.6)
  - [ ] Timing adjustable
  - [ ] Pause, stop, hide
  - [ ] No timing
  - [ ] Interruptions
  - [ ] Re-authenticating
  - [ ] Timeouts

#### 2.3 Seizures and Physical Reactions

- [ ] Implement tests for flashing content (2.3.1-2.3.3)
  - [ ] Three flashes or below threshold
  - [ ] Three flashes
  - [ ] Animation from interactions

#### 2.4 Navigable

- [ ] Create tests for navigation mechanisms (2.4.1-2.4.13)
  - [ ] Bypass blocks
  - [ ] Page titled
  - [ ] Focus order
  - [ ] Link purpose (in context)
  - [ ] Multiple ways
  - [ ] Headings and labels
  - [ ] Focus visible
  - [ ] Location

#### 2.5 Input Modalities

- [ ] Implement tests for input methods (2.5.1-2.5.8)
  - [ ] Pointer gestures
  - [ ] Pointer cancellation
  - [ ] Label in name
  - [ ] Motion actuation
  - [ ] Target size
  - [ ] Concurrent input mechanisms

### 4. Understandable Tests

#### 3.1 Readable

- [ ] Create tests for readability (3.1.1-3.1.6)
  - [ ] Language of page
  - [ ] Language of parts
  - [ ] Unusual words
  - [ ] Abbreviations
  - [ ] Reading level
  - [ ] Pronunciation

#### 3.2 Predictable

- [ ] Implement tests for predictability (3.2.1-3.2.6)
  - [ ] On focus
  - [ ] On input
  - [ ] Consistent navigation
  - [ ] Consistent identification
  - [ ] Change on request

#### 3.3 Input Assistance

- [ ] Create tests for input assistance (3.3.1-3.3.6)
  - [ ] Error identification
  - [ ] Labels or instructions
  - [ ] Error suggestion
  - [ ] Error prevention
  - [ ] Help
  - [ ] Error prevention (all)

### 5. Robust Tests

#### 4.1 Compatible

- [ ] Implement tests for compatibility (4.1.1-4.1.3)
  - [ ] Parsing
  - [ ] Name, role, value
  - [ ] Status messages

### 6. Test Results and Reporting

- [x] Create detailed result formatter for WCAG tests
- [x] Implement aggregation of results by WCAG principle and guideline
- [x] Create summary view with compliance levels (A, AA, AAA)
- [x] Add support for exporting WCAG compliance reports

### 7. Integration with Existing Framework

- [ ] Update test-config.ts to include WCAG test types
- [ ] Extend runner to support WCAG specifics
- [ ] Add UI components for WCAG test results

### 8. Documentation

- [ ] Document all implemented WCAG tests
- [ ] Create usage examples
- [ ] Add resources for remediation of common issues
- [ ] Document best practices

## Priority Implementation

For initial implementation, focus on the following critical areas:

1. **High Priority (Start Here)**:

   - Perceivable: Text Alternatives (1.1.1)
   - Operable: Keyboard Accessibility (2.1.1-2.1.2)
   - Understandable: Error Identification (3.3.1)
   - Robust: Name, Role, Value (4.1.2)

2. **Medium Priority (Second Phase)**:

   - Perceivable: Color Contrast (1.4.3)
   - Operable: Focus Visible (2.4.7)
   - Understandable: Language of Page (3.1.1)
   - Operable: Navigable (2.4 series)

3. **Additional Tests (Third Phase)**:
   - Remaining WCAG criteria

## Implementation Notes

- Each test should map directly to specific WCAG success criteria
- Include severity based on WCAG level (A = Critical, AA = High, AAA = Medium)
- Provide clear remediation guidance in failure messages
- Use a consistent testing approach across all suites

## Hybrid Architecture: WCAG Criteria + Element-Based Organization

After careful analysis, a hybrid approach that combines WCAG criteria-first organization with element-based testing provides the optimal balance of compliance reporting and developer experience.

### Recommended Architecture

```
/suites
  /wcag
    /criteria
      /perceivable
        /1.1-text-alternatives
          - SC111-non-text-content.ts
        /1.4-distinguishable
          - SC143-contrast.ts
      /operable
        /2.1-keyboard
          - SC211-keyboard.ts
          - SC212-no-keyboard-trap.ts
      ...
    /elements
      - images.ts
      - buttons.ts
      - forms.ts
      - tables.ts
      ...
    /utils
      - test-metadata.ts  // For tracking SC mapping
      - report-generator.ts
    index.ts
```

### Implementation Strategy: Test Runners + Rule Modules

```typescript
// Example of a rule module (SC1.1.1)
export const nonTextContentRules = {
  // Each rule has metadata and test implementation
  imageAltText: {
    id: "image-alt-text",
    wcagCriteria: ["1.1.1"],
    wcagLevel: "A",
    elementTypes: ["img", "svg", "canvas"],
    description: "Images must have alt text",
    test: (element) => {
      /* test implementation */
    }
  }
  // More rules...
}

// Example of element-specific test collection
export const imageTests = {
  // Collects all rules that apply to images
  elements: ["img", "svg", "picture", "canvas"],
  applicableRules: [
    nonTextContentRules.imageAltText,
    contrastRules.nonTextContrast
    // etc.
  ]
}
```

### Benefits of This Approach

1. **WCAG Compliance Reporting**: Organized by criteria for direct mapping to WCAG standards
2. **Developer Experience**: Can run element-based tests for targeting specific components
3. **Testing Efficiency**: Rules define what to test, elements collections optimize how to test
4. **Future Proofing**:
   - New WCAG versions can add new criteria modules
   - Metadata allows tagging tests with 2.1/2.2/3.0 applicability
5. **Modularity**: Each test is self-contained with its own metadata
6. **Flexibility**: Run tests by criteria, by element type, or by page section

### Rule Registry and Metadata System

```typescript
interface WCAGRule {
  id: string
  wcagCriteria: string[]
  wcagLevel: "A" | "AA" | "AAA"
  elementTypes: string[]
  versions: ("2.0" | "2.1" | "2.2" | "3.0")[]
  test: (element: Element, context: TestContext) => TestResult
}
```

### Context-Aware Testing

- Pass context information to tests (page metadata, user settings)
- Allows for more sophisticated testing logic

### Report Generation

- Create a WCAG-structured compliance report
- Include metadata like success criteria, levels, and remediation advice

### Implementation Priorities

1. Create the metadata system first
2. Implement a few key tests using this architecture
3. Build report generation early
4. Test with real pages to validate the approach

## Implementation Progress

The following components have been implemented:

### 1. Core Infrastructure

- ✅ **Metadata System**: Created a robust metadata system with rule registry in `test-metadata.ts`
- ✅ **Test Types**: Defined comprehensive test types and interfaces
- ✅ **Report Generator**: Implemented a flexible report generator that supports multiple output formats
- ✅ **Test Runner**: Created a test runner capable of executing tests by criteria or element type

### 2. Initial Tests

- ✅ **SC 1.1.1 Non-text Content**:
  - ✅ Image alt text test
  - ✅ SVG accessible name test

### 3. Test Organization

- ✅ **Hybrid Architecture**: Implemented the hybrid architecture with both criteria-based and element-based organization
  - ✅ Criteria folder structure with POUR principles
  - ✅ Element-based collections for targeted testing
  - ✅ Registry system for finding applicable tests

### 4. Next Steps

- 🔲 Implement form control label tests (SC 1.1.1)
- 🔲 Implement keyboard accessibility tests (SC 2.1.1, 2.1.2)
- 🔲 Implement name, role, value tests (SC 4.1.2)
- 🔲 Create integration with the existing test framework
