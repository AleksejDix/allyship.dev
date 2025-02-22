---
title: "Guideline 1.3 – Adaptable"
description: "Create content that can be presented in different ways without losing structure or information"
category: "Perceivable"
tags: ["structure", "relationships", "sequence", "characteristics"]
---

# Guideline 1.3 – Adaptable

## Overview

This guideline ensures that content can be presented in different ways (for example, simpler layout) without losing information or structure. This is crucial for users who need to access content through different modalities, such as screen readers, text-only displays, or custom stylesheets.

## Success Criteria

### [1.3.1 Info and Relationships (Level A)](./1.3.1-info-and-relationships.md)

- Information, structure, and relationships conveyed visually must be programmatically determined
- Use semantic HTML elements to convey structure
- Ensure form labels are properly associated with controls
- Use proper table markup for tabular data

### [1.3.2 Meaningful Sequence (Level A)](./1.3.2-meaningful-sequence.md)

- Reading and navigation order must be logical and intuitive
- Visual order must match DOM order
- Avoid CSS positioning that changes meaning

### [1.3.3 Sensory Characteristics (Level A)](./1.3.3-sensory-characteristics.md)

- Instructions must not rely solely on sensory characteristics
- Provide multiple ways to identify content
- Use clear, non-sensory descriptions

## Why This Matters

Adaptable content is essential because it:

- Enables screen readers to convey structure and relationships
- Supports users with custom stylesheets or layouts
- Helps users with cognitive disabilities understand relationships
- Makes content accessible across different devices and viewports
- Supports users who need to modify presentation

## Implementation Approaches

1. **Semantic Structure**

   - Use appropriate HTML elements
   - Implement proper heading hierarchy
   - Use lists for grouped items
   - Apply ARIA landmarks when needed

2. **Form Accessibility**

   - Associate labels with controls
   - Group related fields
   - Provide clear error messages
   - Use fieldset and legend

3. **Table Structure**

   - Use proper table markup
   - Define headers correctly
   - Include captions when needed
   - Handle complex tables appropriately

4. **Content Order**
   - Maintain logical DOM order
   - Use CSS grid/flexbox responsibly
   - Test with stylesheets disabled
   - Verify tab order

## Common Patterns

### Semantic Document Structure

```tsx
// ❌ Avoid
<div className="header">
  <div className="nav">
    <div className="nav-item">Home</div>
  </div>
</div>
<div className="main">
  <div className="title">Page Title</div>
</div>

// ✅ Do
<header>
  <nav aria-label="Main">
    <ul role="list">
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>
<main>
  <h1>Page Title</h1>
</main>
```

### Form Structure

```tsx
// ❌ Avoid
<div className="form-group">
  Name:
  <input type="text" />
  <span className="error">Required</span>
</div>

// ✅ Do
<div role="group" aria-labelledby="name-label">
  <label id="name-label" htmlFor="name">Name</label>
  <input
    id="name"
    name="name"
    type="text"
    aria-required="true"
    aria-describedby="name-error"
  />
  <div
    id="name-error"
    role="alert"
    className="error"
  >
    This field is required
  </div>
</div>
```

### Data Tables

```tsx
// ❌ Avoid
<table>
  <tr>
    <td>Product</td>
    <td>Price</td>
  </tr>
</table>

// ✅ Do
<table>
  <caption>Product Pricing</caption>
  <thead>
    <tr>
      <th scope="col">Product Name</th>
      <th scope="col">Price (USD)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Basic Plan</th>
      <td>$10/month</td>
    </tr>
  </tbody>
</table>
```

### Visual Order

```tsx
// ❌ Avoid
<div className="container">
  <div className="sidebar order-2">
    Navigation
  </div>
  <div className="content order-1">
    Main content before nav in DOM
  </div>
</div>

// ✅ Do
<div className="container">
  <nav className="sidebar">
    Navigation first in DOM
  </nav>
  <main className="content">
    Main content follows logically
  </main>
</div>
```

## Testing Checklist

1. **Structure Testing**

   - Validate semantic HTML
   - Check heading hierarchy
   - Verify list structures
   - Test table markup

2. **Relationship Testing**

   - Verify label associations
   - Check ARIA relationships
   - Test form groupings
   - Validate table headers

3. **Sequence Testing**

   - Check tab order
   - Test with CSS disabled
   - Verify reading order
   - Check responsive layouts

4. **Sensory Testing**
   - Review instructions
   - Check for color dependencies
   - Test shape-based instructions
   - Verify location references

## Resources

- [W3C WAI - Structure and Relationships](https://www.w3.org/WAI/tutorials/page-structure/)
- [MDN - Semantic HTML](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML)
- [WebAIM - Semantic Structure](https://webaim.org/techniques/semanticstructure/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
