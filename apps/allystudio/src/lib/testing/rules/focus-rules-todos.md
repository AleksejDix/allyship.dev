# Focus Rules - TODOs for Improvement

## Current Implementation Strengths

- Checks for focus visibility on interactive elements
- Validates logical focus order
- Examines multiple CSS properties for focus indicators

## Already Implemented Rules

1. **Focus Visibility Rule**

   - Checks that all interactive elements have visible focus indicators when focused via keyboard
   - Tests for CSS properties including `outline`, `border`, `box-shadow`, and background color changes
   - Detects when focus indicators have been removed (outline: none without replacement)
   - References WCAG 2.1 Success Criterion 2.4.7 (Focus Visible)
   - Logs the number of interactive elements found and focus style information

2. **Focus Order Rule**
   - Validates that the tab order through interactive elements follows a logical sequence
   - Checks for elements with positive tabindex values (which can disrupt natural tab order)
   - Validates the visual layout of elements compared to their tab order
   - References WCAG 2.1 Success Criterion 2.4.3 (Focus Order)
   - Logs each focusable element's position in the tab order

## TODO Items

### Critical Priority

- [ ] Add focus trap detection for modals and dialogs
- [ ] Implement keyboard-only interaction testing for custom widgets
- [ ] Add detection of focus management in dynamic content updates

### High Priority

- [ ] Implement focus indicator contrast checking
- [ ] Add check for positive tabindex values (often an anti-pattern)
- [ ] Implement validation for skip-to-content links
- [ ] Add testing for keyboard shortcuts and their documentation

### Medium Priority

- [ ] Improve focus order logic to account for complex layouts
- [ ] Add detection of elements that should be focusable but aren't
- [ ] Implement check for proper focus restoration after modal closure
- [ ] Add validation of ARIA keyboard patterns in custom widgets

### Low Priority

- [ ] Implement check for excessive focusable elements
- [ ] Add focus timing validation (focus shouldn't move automatically)
- [ ] Implement testing for focus persistence during page updates

## Implementation Notes

### Focus Trap Detection

```javascript
// Potential implementation approach
function detectFocusTraps() {
  // Find all modal/dialog elements
  const dialogs = document.querySelectorAll(
    '[role="dialog"], .modal, [aria-modal="true"]'
  )

  dialogs.forEach((dialog) => {
    // Test if focus can escape the dialog with keyboard
    const canEscape = testFocusEscape(dialog)

    if (!canEscape) {
      // Flag as proper focus trap (good)
    } else {
      // Flag as improper focus management (bad)
    }

    // Also check for escape key closing the dialog
    const hasEscapeHandler = testEscapeKey(dialog)
    if (!hasEscapeHandler) {
      // Flag as missing escape key handler
    }
  })
}
```

### Focus Indicator Contrast

Calculate contrast ratio between:

1. Default element state
2. Focused element state

Ensure the difference meets WCAG 1.4.11 requirements for non-text contrast (3:1).

### Keyboard Interaction Testing

Identify widget patterns (tabs, menus, etc.) and test against WAI-ARIA Authoring Practices expected keyboard behaviors:

- Tabs: Arrow keys, Home/End
- Menus: Arrow keys, Escape, Enter
- Comboboxes: Arrow keys, typing, Escape
- etc.
