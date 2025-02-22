---
title: "Guideline 1.1 – Text Alternatives"
description: "Provide text alternatives for any non-text content"
category: "Perceivable"
tags: ["text-alternatives", "non-text", "images", "media"]
---

# Guideline 1.1 – Text Alternatives

## Overview

This guideline ensures that all non-text content has a text alternative that serves the equivalent purpose. This is fundamental for accessibility as it enables users who cannot see or access the non-text content to understand its meaning through alternative means.

## Success Criteria

### [1.1.1 Non-text Content (Level A)](./1.1.1-non-text-content.md)

- All non-text content must have a text alternative
- Decorative elements must be implemented to be ignored by assistive technology
- Form controls and input elements must have descriptive labels
- Time-based media must have descriptive identification

## Why This Matters

Text alternatives are essential because they:

- Enable screen readers to describe images to blind users
- Provide content understanding when images fail to load
- Help search engines understand image content
- Support users with low bandwidth who disable images
- Assist users who have difficulty understanding non-text content

## Implementation Approaches

1. **Descriptive Alt Text**

   - Use clear, concise descriptions
   - Focus on the purpose and function
   - Avoid redundant phrases like "image of" or "picture of"

2. **ARIA Labels**

   - Use when HTML alt attributes aren't suitable
   - Provide context-appropriate descriptions
   - Ensure labels are concise and meaningful

3. **Empty Alternatives**

   - Use for decorative images
   - Implement properly to be ignored by assistive tech
   - Document the rationale for empty alternatives

4. **Complex Descriptions**
   - Provide detailed descriptions for complex images
   - Use figure and figcaption for extended descriptions
   - Consider providing data tables for charts and graphs

## Common Patterns

### Images

```tsx
// Informative images
<img
  src="/product.jpg"
  alt="Red leather laptop sleeve with magnetic closure"
/>

// Decorative images
<img
  src="/divider.png"
  alt=""
  role="presentation"
/>

// Complex images
<figure>
  <img
    src="/chart.png"
    alt="Sales chart"
    aria-describedby="chart-desc"
  />
  <figcaption id="chart-desc">
    Sales increased by 25% in Q2 2024
  </figcaption>
</figure>
```

### Icons

```tsx
// Functional icons
<button aria-label="Search">
  <SearchIcon aria-hidden="true" />
</button>

// Decorative icons
<span className="with-icon">
  Settings
  <CogIcon aria-hidden="true" />
</span>
```

### SVGs

```tsx
// Informative SVG
<svg
  role="img"
  aria-labelledby="chart-title chart-desc"
>
  <title id="chart-title">Monthly Revenue</title>
  <desc id="chart-desc">Bar chart showing revenue growth</desc>
  {/* SVG content */}
</svg>

// Decorative SVG
<svg aria-hidden="true" role="presentation">
  {/* SVG content */}
</svg>
```

## Testing Checklist

1. **Screen Reader Testing**

   - Verify all non-text content is announced correctly
   - Check that decorative elements are ignored
   - Ensure complex images have adequate descriptions

2. **Visual Testing**

   - Disable images to verify alt text appears
   - Check that no important information is lost
   - Verify text alternatives make sense in context

3. **Semantic Testing**
   - Validate HTML for proper alt attributes
   - Check ARIA roles and labels
   - Verify figure/figcaption relationships

## Resources

- [W3C WAI Images Tutorial](https://www.w3.org/WAI/tutorials/images/)
- [WebAIM Alternative Text Guide](https://webaim.org/techniques/alttext/)
- [HTML5 Accessibility - Non-text Content](https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
