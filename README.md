# Web Accessibility Audit Toolset

A Chrome extension built with Plasmo that accelerates web accessibility audits by providing Photoshop-style tools for DOM analysis.

## Core Purpose

Enable web accessibility auditors to complete thorough audits in under 1 hour by providing:

- Quick DOM analysis tools
- Automated accessibility checks
- Efficient reporting mechanisms
- Visual inspection aids

## Accessibility Guidelines

Our extension follows WCAG 2.1 guidelines to ensure it's accessible to all users. Here are the key implementations:

### 1. Keyboard Navigation (WCAG 2.1.1)

- All interactive elements are keyboard accessible
- Focus indicators are clearly visible
- Tab order follows a logical sequence
- Custom keyboard shortcuts for power users

### 2. ARIA Implementation (WCAG 4.1.2)

- Proper role attributes for custom controls
- Descriptive aria-labels for interactive elements
- State management with aria-checked, aria-expanded
- Region landmarks for major sections

### 3. Color and Contrast (WCAG 1.4.3)

- Minimum contrast ratio of 4.5:1 for normal text
- Visual feedback not dependent on color alone
- Support for dark and light themes
- System preference respect for color schemes

### 4. Focus Management (WCAG 2.4.7)

- Visible focus indicators
- Focus trap in modal dialogs
- Skip links for main content
- Proper focus restoration

### 5. Error Identification (WCAG 3.3.1)

- Clear error messages
- Error suggestions
- Error prevention for important actions
- Validation feedback

### Example Implementation: Theme Selector

Our theme selector component demonstrates these principles:

```typescript
<div role="region" aria-labelledby="theme-selector-heading">
  <h2 id="theme-selector-heading">Appearance</h2>
  <div role="radiogroup" aria-label="Theme selection">
    <button
      role="radio"
      aria-checked={isSelected}
      tabIndex={isSelected ? 0 : -1}>
      Theme Option
    </button>
  </div>
</div>
```

Key Features:

- Semantic HTML structure
- ARIA roles and labels
- Keyboard navigation support
- Visual feedback for states
- Screen reader announcements

### Testing Requirements

1. **Keyboard Testing**

   - All functions available via keyboard
   - Visible focus indicators
   - No keyboard traps

2. **Screen Reader Testing**

   - Clear announcements
   - Proper heading structure
   - Meaningful link text
   - Status updates

3. **Color Contrast**
   - Test all color combinations
   - Check both themes
   - Verify focus indicators
   - Test with color blindness simulators

## Core Requirements

- Chrome Extension using Plasmo framework
- State management with XState 5 (actor model)
- Accessibility-focused DOM analysis tools for the active tab
- Photoshop-style tool selection system for rapid switching between audit tools

## Development Plan

Building in small, incremental steps with Git commits for each change:

1. Basic extension setup
2. Tool selection system with focus on audit workflow
3. Core accessibility audit tools:
   - ARIA attribute inspector
   - Color contrast analyzer
   - Heading structure validator
   - Focus order checker
4. State management with XState

## Tech Stack

- Plasmo (@Web @https://docs.plasmo.com/)
- XState 5 (@Web @https://stately.ai/docs/quick-start)
- TypeScript
- React
- shadcn/ui components (from existing @ui implementation)
  - Using pre-built components like:
    - Dropdown menu
    - Tooltips
    - Toggle groups
    - Command palette
    - And more...

## Project Status

Initial planning phase - preparing for incremental development with focus on building efficient accessibility audit tools.
