# Button Accessible Name Rules - TODOs for Improvement

## Current Implementation Strengths

- Checks that buttons have accessible names
- Includes elements with role="button"
- Provides detailed error messages and remediation suggestions

## Already Implemented Rules

1. **Button Accessible Name Rule**
   - Verifies that all button elements and elements with role="button" have non-empty accessible names
   - Checks both native `<button>` elements and custom buttons with proper ARIA roles
   - References WCAG 2.1 Success Criterion 4.1.2 (Name, Role, Value)
   - Logs the accessible name for each button found on the page
   - Handles various methods of providing button names (text content, aria-label, aria-labelledby)
   - Provides clear remediation suggestions for buttons lacking accessible names
   - Implementation includes detection of buttons that only contain icons without proper text alternatives

## TODO Items

### Critical Priority

- [ ] Add button state indicator checks (disabled states should be communicated visually and programmatically)
- [ ] Implement detection of non-button elements with button behavior
- [ ] Add accessible name quality evaluation (beyond just presence)

### High Priority

- [ ] Add touch target size validation (minimum 44×44px)
- [ ] Implement button label consistency check (same action = same label)
- [ ] Add icon-only button detection with warning for missing aria-label
- [ ] Check for proper aria-pressed state on toggle buttons

### Medium Priority

- [ ] Implement button type attribute checks in forms (should be explicit)
- [ ] Add check for buttons that perform unexpected actions
- [ ] Implement validation for button positioning in forms
- [ ] Add check for close buttons in dialogs/modals/popups

### Low Priority

- [ ] Implement checks for excessive button text length
- [ ] Add validation for button appearance consistency
- [ ] Check for overridden button styles that remove focus indicators

## Implementation Notes

### Button State Indicators

```javascript
// Potential implementation approach
function checkButtonStates() {
  const buttons = document.querySelectorAll('button, [role="button"]')

  buttons.forEach((button) => {
    const isDisabled =
      button.disabled || button.getAttribute("aria-disabled") === "true"

    if (isDisabled) {
      // Check visual indication
      const styles = window.getComputedStyle(button)
      const hasVisualDisabledIndicator =
        styles.opacity < 1 ||
        styles.cursor === "not-allowed" ||
        styles.backgroundColor !== activeButtonColor

      // Check for disabled announcement
      const hasAriaDisabled = button.getAttribute("aria-disabled") === "true"

      if (!hasVisualDisabledIndicator) {
        // Flag missing visual disabled state
      }

      if (button.disabled && !hasAriaDisabled) {
        // Might be ok, but flag as potential issue for some implementations
      }
    }

    // Check for toggle buttons (aria-pressed)
    if (button.getAttribute("aria-pressed") !== null) {
      const isPressed = button.getAttribute("aria-pressed") === "true"
      // Check visual indication of pressed state
    }
  })
}
```

### Non-Button Elements with Button Behavior

Look for elements that:

- Have click handlers
- Are not natively interactive (not a, button, input, select, etc.)
- Don't have role="button"
- Don't have proper keyboard support

For example, a div with an onclick but no keydown handler for Enter/Space.

### Touch Target Size

Calculate the actual clickable/tappable area (including padding) to ensure it meets WCAG 2.5.5 Target Size (Enhanced AAA) requirements of 44×44px.

### Button Label Consistency

Group buttons by their action type (submit, cancel, delete, etc.) and check for consistent labeling patterns. Flag cases where:

- Different labels are used for same action
- Same label is used for different actions
