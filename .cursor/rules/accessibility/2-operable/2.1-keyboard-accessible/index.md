---
title: "Guideline 2.1 – Keyboard Accessible"
description: "Make all functionality available from a keyboard"
category: "Operable"
tags: ["keyboard", "accessibility", "navigation", "shortcuts"]
---

# Guideline 2.1 – Keyboard Accessible

## Overview

This guideline ensures that all functionality is available using a keyboard. This is essential for users who cannot use a mouse or other pointing device, including people with motor disabilities, visual impairments, or those using alternative input devices.

## Success Criteria

### [2.1.1 Keyboard (Level A)](./2.1.1-keyboard.md)

- All functionality must be operable through a keyboard interface
- No specific timing requirements for individual keystrokes
- Keyboard operation must not require specific timings

### [2.1.2 No Keyboard Trap (Level A)](./2.1.2-no-keyboard-trap.md)

- Keyboard focus must not be trapped in any component
- Users must be able to navigate to and from all components
- If special keys are needed, users must be informed

### [2.1.4 Character Key Shortcuts (Level A)](./2.1.4-character-key-shortcuts.md)

- Single-character key shortcuts can be turned off or remapped
- Shortcuts must require modifier keys
- Users must be able to disable or customize shortcuts

## Why This Matters

Keyboard accessibility is essential because:

- Many users cannot use a mouse
- Screen reader users navigate by keyboard
- Some users have motor impairments
- Alternative input devices emulate keyboards
- Power users prefer keyboard navigation

## Implementation Approaches

1. **Native Elements**

   - Use standard HTML elements
   - Maintain default keyboard behavior
   - Preserve tab order
   - Respect platform conventions

2. **Custom Controls**

   - Match native element behavior
   - Implement all keyboard interactions
   - Support focus management
   - Handle all keyboard events

3. **Focus Management**

   - Maintain logical focus order
   - Provide focus indicators
   - Handle dynamic content
   - Manage modal interactions

4. **Keyboard Shortcuts**
   - Make shortcuts configurable
   - Use standard patterns
   - Provide clear documentation
   - Allow customization

## Common Patterns

### Button Implementation

```tsx
// ❌ Avoid
<div
  onClick={handleClick}
  className="clickable"
>
  Click me
</div>

// ✅ Do
<button
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      handleClick()
    }
  }}
>
  Click me
</button>
```

### Modal Dialog

```tsx
function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      // Store last focused element
      const lastFocus = document.activeElement

      // Focus the modal
      modalRef.current?.focus()

      return () => {
        // Restore focus when modal closes
        if (lastFocus instanceof HTMLElement) {
          lastFocus.focus()
        }
      }
    }
  }, [isOpen])

  return isOpen ? (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          onClose()
        }
      }}
    >
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  ) : null
}
```

### Custom Select

```tsx
function CustomSelect({ options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const [focusIndex, setFocusIndex] = useState(0)

  return (
    <div
      role="combobox"
      aria-expanded={isOpen}
      aria-controls="options"
      onKeyDown={(e) => {
        switch (e.key) {
          case "Enter":
          case " ":
            setIsOpen(!isOpen)
            break
          case "ArrowDown":
            setFocusIndex((i) => Math.min(i + 1, options.length - 1))
            break
          case "ArrowUp":
            setFocusIndex((i) => Math.max(i - 1, 0))
            break
          case "Escape":
            setIsOpen(false)
            break
        }
      }}
    >
      <button aria-haspopup="listbox" onClick={() => setIsOpen(!isOpen)}>
        {value}
      </button>

      {isOpen && (
        <ul id="options" role="listbox" tabIndex={-1}>
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={value === option.value}
              tabIndex={focusIndex === index ? 0 : -1}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

## Testing Checklist

1. **Keyboard Navigation**

   - Test all interactive elements
   - Verify focus indicators
   - Check tab order
   - Test keyboard shortcuts

2. **Focus Management**

   - Test focus trapping in modals
   - Verify focus restoration
   - Check dynamic content
   - Test error messages

3. **Custom Controls**

   - Test all keyboard interactions
   - Verify ARIA attributes
   - Check role behavior
   - Test screen readers

4. **Shortcuts**
   - Test shortcut configuration
   - Verify modifier keys
   - Check documentation
   - Test customization

## Resources

- [W3C WAI - Keyboard Accessibility](https://www.w3.org/WAI/perspective-videos/keyboard/)
- [WebAIM - Keyboard Accessibility](https://webaim.org/techniques/keyboard/)
- [MDN - Keyboard Navigation](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets)
- [Inclusive Components - Keyboard Accessibility](https://inclusive-components.design/)
