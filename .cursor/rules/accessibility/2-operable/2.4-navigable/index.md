---
title: "Guideline 2.4 – Navigable"
description: "Provide ways to help users navigate, find content, and determine where they are"
category: "Operable"
tags: ["navigation", "wayfinding", "focus", "links"]
---

# Guideline 2.4 – Navigable

## Overview

This guideline ensures that users can effectively navigate through content, find what they need, and understand their current location within a website or application. Good navigation is crucial for all users but especially important for keyboard users, screen reader users, and users with cognitive disabilities.

## Success Criteria

### [2.4.1 Bypass Blocks (Level A)](./2.4.1-bypass-blocks.md)

- Provide mechanisms to skip repeated blocks of content
- Allow users to bypass navigation and reach main content
- Ensure efficient keyboard navigation

### [2.4.2 Page Titled (Level A)](./2.4.2-page-titled.md)

- Each page must have a descriptive title
- Titles should clearly indicate page purpose or content
- Titles must be unique and informative

### [2.4.3 Focus Order (Level A)](./2.4.3-focus-order.md)

- Focus order must be logical and meaningful
- Sequential navigation should preserve context
- Focus management must maintain operability

### [2.4.4 Link Purpose (In Context) (Level A)](./2.4.4-link-purpose.md)

- Link text must be descriptive
- Purpose should be clear from context
- Avoid ambiguous link text

## Why This Matters

Effective navigation is essential because:

- Users need to find content efficiently
- Screen reader users rely on clear navigation patterns
- Keyboard users need efficient ways to move through content
- Users with cognitive disabilities need clear wayfinding
- All users benefit from clear page organization

## Implementation Approaches

1. **Skip Links**

   - Provide visible skip navigation
   - Implement keyboard-accessible shortcuts
   - Create landmark regions
   - Use semantic sectioning

2. **Page Structure**

   - Use descriptive page titles
   - Implement proper heading hierarchy
   - Create meaningful landmarks
   - Structure content logically

3. **Focus Management**

   - Maintain logical tab order
   - Handle dynamic content properly
   - Manage modal focus
   - Provide visible focus indicators

4. **Link Design**
   - Write descriptive link text
   - Provide context when needed
   - Avoid generic phrases
   - Use ARIA labels appropriately

## Common Patterns

### Skip Navigation

```tsx
function SkipNavigation() {
  return (
    <a
      href="#main-content"
      className={cn(
        "sr-only focus:not-sr-only",
        "focus:fixed focus:top-4 focus:left-4",
        "focus:z-50 focus:p-4",
        "focus:bg-background focus:ring-2",
        "focus:ring-ring focus:outline-none"
      )}
    >
      Skip to main content
    </a>
  )
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipNavigation />
      <header>{/* Navigation content */}</header>
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
    </>
  )
}
```

### Focus Management

```tsx
function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      // Store the current focus
      previousFocusRef.current = document.activeElement as HTMLElement
      // Focus the modal
      modalRef.current?.focus()
    } else if (previousFocusRef.current) {
      // Restore focus when closing
      previousFocusRef.current.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      className="modal"
    >
      <div className="modal-content">
        {children}
        <button onClick={onClose} className="close-button">
          Close modal
        </button>
      </div>
    </div>
  )
}
```

### Descriptive Links

```tsx
// ❌ Avoid
function BadLinks() {
  return (
    <div>
      <a href="/article">Click here</a>
      <a href="/settings">More</a>
      <a href="/profile">Read more</a>
    </div>
  )
}

// ✅ Do
function GoodLinks() {
  return (
    <div>
      <a href="/article">Read full article about accessibility</a>
      <a href="/settings">Configure account settings</a>
      <a href="/profile" aria-label="View John Smith's complete profile">
        View full profile
      </a>
    </div>
  )
}
```

## Testing Checklist

1. **Skip Links**

   - Verify skip link visibility on focus
   - Test keyboard activation
   - Check target focus management
   - Validate landmark structure

2. **Page Structure**

   - Check title descriptiveness
   - Validate heading hierarchy
   - Test landmark navigation
   - Verify page organization

3. **Focus Order**

   - Test keyboard navigation
   - Verify modal focus trap
   - Check dynamic content
   - Validate focus restoration

4. **Link Testing**
   - Review link text clarity
   - Check context preservation
   - Test screen reader output
   - Validate ARIA labels

## Resources

- [W3C - Understanding Navigable](https://www.w3.org/WAI/WCAG21/Understanding/navigation-mechanisms.html)
- [WebAIM - Skip Navigation Links](https://webaim.org/techniques/skipnav/)
- [MDN - Page Structure](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML)
- [Deque - Focus Management](https://www.deque.com/blog/focus-management-tips/)
