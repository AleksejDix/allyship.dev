---
title: "2. Operable"
description: "User interface components and navigation must be operable"
category: "Operable"
tags: ["accessibility", "wcag", "operable"]
---

# Operable Interface Guidelines

User interface components and navigation must be operable by all users.

## Overview

This guideline ensures that all functionality is available to users regardless of how they interact with content. This includes:

- Keyboard accessibility
- Sufficient time to read and use content
- Avoiding content that could cause seizures
- Helping users navigate and find content

## Success Criteria

### 2.1 Keyboard Accessible

- [2.1.1 Keyboard (Level A)](./2.1-keyboard-accessible/2.1.1-keyboard.md)
- [2.1.2 No Keyboard Trap (Level A)](./2.1-keyboard-accessible/2.1.2-no-keyboard-trap.md)
- [2.1.4 Character Key Shortcuts (Level A)](./2.1-keyboard-accessible/2.1.4-character-key-shortcuts.md)

### 2.2 Enough Time

- [2.2.1 Timing Adjustable (Level A)](./2.2-enough-time/2.2.1-timing-adjustable.md)
- [2.2.2 Pause, Stop, Hide (Level A)](./2.2-enough-time/2.2.2-pause-stop-hide.md)

### 2.3 Seizures and Physical Reactions

- [2.3.1 Three Flashes or Below Threshold (Level A)](./2.3-seizures/2.3.1-three-flashes.md)

### 2.4 Navigable

- [2.4.1 Bypass Blocks (Level A)](./2.4-navigable/2.4.1-bypass-blocks.md)
- [2.4.2 Page Titled (Level A)](./2.4-navigable/2.4.2-page-titled.md)
- [2.4.3 Focus Order (Level A)](./2.4-navigable/2.4.3-focus-order.md)
- [2.4.4 Link Purpose (Level A)](./2.4-navigable/2.4.4-link-purpose.md)

## Why This Matters

- **Keyboard Users**: Need full functionality without a mouse
- **Motor Impaired Users**: Need enough time to complete tasks
- **Users with Seizures**: Need protection from harmful content
- **Screen Reader Users**: Need clear navigation and structure
- **All Users**: Need clear wayfinding and content organization

## Implementation Approaches

### 1. Keyboard Navigation

```tsx
// ✅ Do: Ensure keyboard support
function NavigationMenu() {
  return (
    <nav>
      <button
        onClick={toggleMenu}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            toggleMenu()
          }
        }}
        aria-expanded={isOpen}
      >
        Menu
      </button>
    </nav>
  )
}
```

### 2. Time Management

```tsx
// ✅ Do: Allow time extensions
function SessionTimeout() {
  return (
    <div role="alert">
      <p>Session expires in {timeLeft} minutes</p>
      <button onClick={extendSession}>Extend Session</button>
      <button onClick={disableTimeout}>Stay Logged In</button>
    </div>
  )
}
```

### 3. Navigation Aids

```tsx
// ✅ Do: Provide skip links
function Layout() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <nav>{/* Navigation */}</nav>
      <main id="main" tabIndex={-1}>
        {/* Main content */}
      </main>
    </>
  )
}
```

## Testing Checklist

1. **Keyboard Access**

   - [ ] All interactive elements focusable
   - [ ] No keyboard traps
   - [ ] Visible focus indicators
   - [ ] Logical tab order

2. **Time Limits**

   - [ ] Users can extend time limits
   - [ ] Moving content can be paused
   - [ ] No flashing content
   - [ ] Auto-updates can be controlled

3. **Navigation**

   - [ ] Skip links present
   - [ ] Clear page titles
   - [ ] Descriptive headings
   - [ ] Meaningful link text

4. **Focus Management**
   - [ ] Focus visible at all times
   - [ ] Focus order matches visual order
   - [ ] Modal focus management
   - [ ] No focus loss

## Resources

- [Understanding Operable Content (W3C)](https://www.w3.org/WAI/WCAG21/Understanding/operable)
- [WebAIM: Keyboard Accessibility](https://webaim.org/techniques/keyboard/)
- [Deque University: Focus Management](https://dequeuniversity.com/rules/axe/4.0/focus-order-semantics)
- [MDN: Keyboard Navigation](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG/Keyboard)
