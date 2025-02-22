---
title: "4. Robust"
description: "Content must be robust enough that it can be interpreted by a wide variety of user agents, including assistive technologies"
category: "Robust"
tags: ["accessibility", "wcag", "robust"]
---

# Robust Content Guidelines

Content must be robust enough to be reliably interpreted by a wide variety of user agents, including assistive technologies.

## Overview

This guideline ensures that content remains accessible as technologies advance. This includes:

- Using valid, well-formed markup
- Making all functionality available to assistive technologies
- Ensuring compatibility with current and future user tools
- Providing fallbacks for complex interactions

## Success Criteria

### 4.1 Compatible

- [4.1.1 Parsing (Level A)](./4.1-compatible/4.1.1-parsing.md)
- [4.1.2 Name, Role, Value (Level A)](./4.1-compatible/4.1.2-name-role-value.md)
- [4.1.3 Status Messages (Level AA)](./4.1-compatible/4.1.3-status-messages.md)

## Why This Matters

- **Screen Reader Users**: Need proper ARIA implementation
- **Assistive Tech Users**: Need standard HTML semantics
- **Browser Compatibility**: Need valid markup
- **Future Proofing**: Need robust implementation
- **Cross-Platform**: Need reliable functionality

## Implementation Approaches

### 1. Semantic HTML

```tsx
// ✅ Do: Use native HTML elements
function ArticleCard() {
  return (
    <article>
      <h2>Article Title</h2>
      <time dateTime="2024-02-22">Feb 22, 2024</time>
      <p>Article excerpt...</p>
      <footer>
        <button type="button" onClick={share}>
          Share
        </button>
      </footer>
    </article>
  )
}
```

### 2. ARIA Implementation

```tsx
// ✅ Do: Proper ARIA usage
function Accordion() {
  return (
    <div className="accordion">
      <h3>
        <button aria-expanded={isOpen} aria-controls="panel-1" onClick={toggle}>
          Section Title
        </button>
      </h3>
      <div
        id="panel-1"
        role="region"
        aria-labelledby="header-1"
        hidden={!isOpen}
      >
        Panel content
      </div>
    </div>
  )
}
```

### 3. Status Messages

```tsx
// ✅ Do: Communicate status changes
function SearchResults() {
  return (
    <div>
      <div role="status" aria-live="polite" aria-atomic="true">
        {isLoading ? "Searching..." : `Found ${results.length} results`}
      </div>

      <ul role="list">
        {results.map((result) => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  )
}
```

## Testing Checklist

1. **HTML Validation**

   - [ ] Valid HTML markup
   - [ ] Proper nesting
   - [ ] Unique IDs
   - [ ] Complete tags

2. **ARIA Usage**

   - [ ] Correct roles
   - [ ] Valid attributes
   - [ ] Proper relationships
   - [ ] Status updates

3. **Component Testing**

   - [ ] Screen reader testing
   - [ ] Keyboard testing
   - [ ] Browser testing
   - [ ] Platform testing

4. **Compatibility**
   - [ ] Cross-browser support
   - [ ] Assistive tech support
   - [ ] Mobile support
   - [ ] Fallback behavior

## Resources

- [Understanding Robust Content (W3C)](https://www.w3.org/WAI/WCAG21/Understanding/robust)
- [MDN: ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
- [HTML5 Accessibility](https://html5accessibility.com/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
