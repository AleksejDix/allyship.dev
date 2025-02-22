---
title: "1. Perceivable"
description: "Information and user interface components must be presentable to users in ways they can perceive"
category: "Perceivable"
tags: ["accessibility", "wcag", "perceivable"]
---

# Perceivable Content Guidelines

Content must be presented in ways that users can perceive through one or more of their senses.

## Overview

This guideline ensures that all content is perceivable to users, regardless of how they access it. This includes:

- Providing text alternatives for non-text content
- Providing alternatives for time-based media
- Creating content that can be presented in different ways
- Making it easier for users to see and hear content

## Success Criteria

### 1.1 Text Alternatives

- [1.1.1 Non-text Content (Level A)](./1.1-text-alternatives/1.1.1-non-text-content.md)

### 1.2 Time-based Media

- [1.2.1 Audio-only and Video-only (Level A)](./1.2-time-based-media/1.2.1-audio-video-only.md)
- [1.2.2 Captions (Level A)](./1.2-time-based-media/1.2.2-captions.md)
- [1.2.3 Audio Description (Level A)](./1.2-time-based-media/1.2.3-audio-description.md)

### 1.3 Adaptable

- [1.3.1 Info and Relationships (Level A)](./1.3-adaptable/1.3.1-info-and-relationships.md)
- [1.3.2 Meaningful Sequence (Level A)](./1.3-adaptable/1.3.2-meaningful-sequence.md)
- [1.3.3 Sensory Characteristics (Level A)](./1.3-adaptable/1.3.3-sensory-characteristics.md)

### 1.4 Distinguishable

- [1.4.1 Use of Color (Level A)](./1.4-distinguishable/1.4.1-use-of-color.md)
- [1.4.2 Audio Control (Level A)](./1.4-distinguishable/1.4.2-audio-control.md)

## Why This Matters

- **Screen Reader Users**: Need text alternatives for images and media
- **Low Vision Users**: Need sufficient contrast and resizable text
- **Deaf Users**: Need captions and transcripts
- **Colorblind Users**: Need non-color ways to convey information
- **Cognitive Users**: Need clear structure and organization

## Implementation Approaches

### 1. Text Alternatives

```tsx
// ✅ Do: Provide meaningful alt text
<img
  src="/product.jpg"
  alt="Brown leather messenger bag with brass buckle"
/>

// ✅ Do: Label icon buttons
<button aria-label="Search products">
  <SearchIcon aria-hidden="true" />
</button>
```

### 2. Media Alternatives

```tsx
// ✅ Do: Include captions and transcripts
<video controls>
  <source src="/tutorial.mp4" type="video/mp4" />
  <track
    kind="captions"
    src="captions.vtt"
    srcLang="en"
    label="English"
    default
  />
</video>
```

### 3. Semantic Structure

```tsx
// ✅ Do: Use semantic HTML
<article>
  <h1>Product Details</h1>
  <section aria-labelledby="features-title">
    <h2 id="features-title">Features</h2>
    <ul>
      <li>Feature 1</li>
      <li>Feature 2</li>
    </ul>
  </section>
</article>
```

## Testing Checklist

1. **Text Alternatives**

   - [ ] All images have meaningful alt text
   - [ ] Decorative images have empty alt text
   - [ ] Icons have accessible labels
   - [ ] Complex images have detailed descriptions

2. **Media Content**

   - [ ] Videos have captions
   - [ ] Audio has transcripts
   - [ ] Media players are keyboard accessible
   - [ ] Auto-playing media can be paused

3. **Content Structure**

   - [ ] Proper heading hierarchy
   - [ ] Semantic HTML elements
   - [ ] Meaningful sequence
   - [ ] Clear relationships

4. **Visual Design**
   - [ ] Sufficient color contrast
   - [ ] Color not sole means of conveying info
   - [ ] Text resizable without loss of function
   - [ ] Content distinguishable from background

## Resources

- [Understanding Perceivable Content (W3C)](https://www.w3.org/WAI/WCAG21/Understanding/perceivable)
- [WebAIM: Alternative Text](https://webaim.org/techniques/alttext/)
- [Deque University: Media Accessibility](https://dequeuniversity.com/rules/axe/4.0/video-caption)
- [MDN: ARIA Patterns](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/patterns)
