# ACT Rules Migration Plan

## Overview

We're migrating all accessibility tests to use the Accessibility Conformance Testing (ACT) rules format. This provides a more standardized approach to accessibility testing with better reporting and more accurate results.

## Current Status

- ✅ Headings: Migrated to ACT rules
- ✅ Links: Migrated to ACT rules
- ❌ Alt Text: Still using legacy format
- ❌ Interactive Elements: Still using legacy format

## Migration Steps for Remaining Tests

### 1. Alt Text Tests

1. Create a new file `apps/allystudio/src/lib/testing/rules/image-rules.ts`
2. Implement the following ACT rules:
   - Image has accessible name
   - Image has appropriate alt text
   - Decorative images have empty alt text
   - Complex images have long descriptions
3. Update `registerAllRules()` in `index.ts` to include `registerImageRules()`
4. Update `test-config.ts` to set `useACTRules: true` for the alt test

### 2. Interactive Elements Tests

1. Create a new file `apps/allystudio/src/lib/testing/rules/interactive-rules.ts`
2. Implement the following ACT rules:
   - Interactive elements have accessible names
   - Interactive elements have appropriate roles
   - Interactive elements are keyboard accessible
   - Focus indicators are visible
3. Update `registerAllRules()` in `index.ts` to include `registerInteractiveRules()`
4. Update `test-config.ts` to set `useACTRules: true` for the interactive test

## Benefits of ACT Rules

- Standardized testing methodology
- Better reporting with severity levels
- More accurate results with fewer false positives
- Clearer guidance on fixing issues
- Direct mapping to WCAG success criteria

## Implementation Guidelines

When implementing new ACT rules:

1. Use the `createACTRule` helper function
2. Implement both `isApplicable` and `execute` functions
3. Use the `formatACTResult` helper for consistent result formatting
4. Map rules to appropriate WCAG success criteria
5. Include helpful error messages and guidance

## Timeline

- Phase 1: ✅ Headings and Links (Completed)
- Phase 2: Alt Text (Next)
- Phase 3: Interactive Elements
- Phase 4: Other test types (forms, landmarks, etc.)

## References

- [W3C ACT Rules Format](https://www.w3.org/TR/act-rules-format/)
- [WCAG 2.1 Success Criteria](https://www.w3.org/TR/WCAG21/)
- [Axe-core Implementation](https://github.com/dequelabs/axe-core)
