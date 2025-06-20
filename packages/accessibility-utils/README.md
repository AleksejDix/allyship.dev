# @allystudio/accessibility-utils

Shared accessibility utilities for AllyStudio projects. This package consolidates accessibility logic that was previously scattered across multiple packages and applications.

## Why This Package Exists

This package was created to solve the problem of duplicated accessibility code across the AllyStudio ecosystem. Previously, we had:

- Focusable element detection duplicated in 5+ places
- Custom implementations of accessibility name calculations
- Inconsistent selector generation logic
- No shared source of truth for accessibility utilities

## Features

### 🎯 Accessibility Analysis
- `getAccessibilityInfo()` - Comprehensive accessibility properties
- `getImplicitRole()` - Determines implicit ARIA roles
- `getAccessibleName()` - Calculates accessible names per WCAG
- `getAccessibleDescription()` - Gets accessible descriptions
- `isFocusable()` - Reliable focus detection

### 🔍 Element Selection & Identification
- `generateSelector()` - Robust CSS selector generation
- `generateXPath()` - XPath generation for elements
- `getFocusableElements()` - Uses [`focusable-selectors`](https://www.npmjs.com/package/focusable-selectors) library
- `getVisibleFocusableElements()` - Only visible focusable elements

### 👁️ Element Visibility
- `isElementVisible()` - CSS visibility detection
- `isInViewport()` - Viewport intersection
- `getVisibilityRatio()` - Percentage of element visible

## Installation

```bash
npm install @allystudio/accessibility-utils
```

## Usage

### Basic Accessibility Analysis

```typescript
import { getAccessibilityInfo, getAccessibleName } from '@allystudio/accessibility-utils'

const button = document.querySelector('button')
const a11yInfo = getAccessibilityInfo(button)

console.log(a11yInfo)
// {
//   role: 'button',
//   ariaLabel: null,
//   accessibleName: 'Click me',
//   focusable: true,
//   // ...
// }
```

### Finding Focusable Elements

```typescript
import { getFocusableElements, getVisibleFocusableElements } from '@allystudio/accessibility-utils'

// Get all focusable elements (uses focusable-selectors library)
const allFocusable = getFocusableElements()

// Get only visible focusable elements
const visibleFocusable = getVisibleFocusableElements()
```

### Element Selection

```typescript
import { generateSelector, generateXPath } from '@allystudio/accessibility-utils'

const element = document.querySelector('.my-element')

const cssSelector = generateSelector(element)
// "div.container > .my-element:nth-child(2)"

const xpath = generateXPath(element)
// "/html/body/div[1]/div[2]"
```

### Visibility Checking

```typescript
import { isElementVisible, getVisibilityRatio } from '@allystudio/accessibility-utils'

const element = document.querySelector('.content')

if (isElementVisible(element)) {
  const visibilityRatio = getVisibilityRatio(element)
  console.log(`Element is ${Math.round(visibilityRatio * 100)}% visible`)
}
```

## Dependencies

This package leverages proven open-source libraries:

- [`focusable-selectors`](https://www.npmjs.com/package/focusable-selectors) - Reliable focusable element detection
- Zero other runtime dependencies

## Replacing Duplicated Code

This package replaces scattered implementations in:

- `packages/element-inspector/src/utils.ts`
- `apps/allystudio/src/lib/focusable-selectors.ts`
- `apps/allystudio/src/lib/testing/focusable-selectors.ts`
- `apps/allystudio/src/lib/testing/utils/accessibility-utils.ts`
- `apps/allyship/components/tools/tools/keyboard-accessibility.ts`

## Benefits

✅ **Single source of truth** for accessibility logic
✅ **Leverages proven libraries** like `focusable-selectors`
✅ **Consistent behavior** across all AllyStudio projects
✅ **Better testing** with shared, well-tested utilities
✅ **Smaller bundle sizes** by eliminating duplication
✅ **Easier maintenance** with centralized updates

## TypeScript Support

Fully typed with comprehensive TypeScript definitions.

## License

MIT
