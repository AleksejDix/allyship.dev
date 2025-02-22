---
title: "Guideline 3.2 – Predictable"
description: "Make Web pages appear and operate in predictable ways"
category: "Understandable"
tags: ["predictable", "context", "navigation", "behavior"]
---

# Guideline 3.2 – Predictable

## Overview

This guideline ensures that web pages operate in predictable ways, preventing unexpected changes that could disorient or confuse users. It addresses how pages behave when elements receive focus, when user input occurs, and how navigation remains consistent across a site.

## Success Criteria

### [3.2.1 On Focus (Level A)](./3.2.1-on-focus.md)

- Focus must not trigger context changes
- Navigation must be user-initiated
- Focus indicators must be visible
- Focus behavior must be predictable

### [3.2.2 On Input (Level A)](./3.2.2-on-input.md)

- Input changes must not automatically trigger context changes
- Users must be informed of automatic changes
- Form submissions must be intentional
- Settings changes must be confirmed

## Why This Matters

Predictable behavior is essential because:

- Users need control over navigation and changes
- Unexpected changes disorient users
- Automatic actions can cause errors
- Consistent behavior builds user confidence
- Predictability supports cognitive accessibility

## Implementation Approaches

1. **Focus Management**

   - Use proper focus indicators
   - Maintain logical focus order
   - Avoid automatic focus changes
   - Handle dynamic content carefully

2. **Input Handling**

   - Require explicit user actions
   - Provide clear feedback
   - Allow action reversal
   - Warn about automatic changes

3. **Context Changes**

   - Make changes user-initiated
   - Provide clear warnings
   - Allow user confirmation
   - Maintain state visibility

4. **Navigation Patterns**
   - Keep consistent layout
   - Use standard patterns
   - Provide clear indicators
   - Support keyboard navigation

## Common Patterns

### Focus Management

```tsx
// ❌ Avoid
function BadFocusExample() {
  return (
    <input
      onFocus={() => {
        // Don't auto-navigate on focus
        router.push("/other-page")
      }}
    />
  )
}

// ✅ Do
function GoodFocusExample() {
  return (
    <div className="form-group">
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        className="focus:ring-2 focus:ring-primary"
      />
      <p className="hint">Press Enter to submit</p>
    </div>
  )
}
```

### Input Changes

```tsx
// ❌ Avoid
function BadSelectExample() {
  return (
    <select
      onChange={(e) => {
        // Don't auto-submit on change
        form.submit()
      }}
    >
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </select>
  )
}

// ✅ Do
function GoodSelectExample() {
  const [value, setValue] = useState("")
  const [submitted, setSubmitted] = useState(false)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setSubmitted(true)
      }}
    >
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-describedby="select-hint"
      >
        <option value="">Select an option</option>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </select>
      <p id="select-hint">Choose an option and click Apply to update</p>
      <button type="submit">Apply Changes</button>
    </form>
  )
}
```

## Testing Checklist

1. **Focus Testing**

   - Verify focus visibility
   - Check focus order
   - Test focus behavior
   - Validate focus indicators

2. **Input Testing**

   - Test form submissions
   - Check select behavior
   - Verify radio buttons
   - Test checkboxes

3. **Context Changes**

   - Verify navigation triggers
   - Test automatic updates
   - Check state changes
   - Validate user warnings

4. **Navigation Testing**
   - Test keyboard navigation
   - Check screen reader usage
   - Verify consistent layout
   - Test dynamic updates

## Resources

- [W3C - Understanding Predictable](https://www.w3.org/WAI/WCAG21/Understanding/consistent-behavior.html)
- [MDN - Focus Management](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Focus_management)
- [WebAIM - Keyboard Accessibility](https://webaim.org/techniques/keyboard/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
