# Image Accessible Name Rules - TODOs for Improvement

## Current Implementation Strengths

- Checks for alt text presence on images
- Detects placeholder alt text
- Handles role="presentation" appropriately
- Includes role="img" elements

## Already Implemented Rules

1. **Image Accessible Name Rule**
   - Verifies that all image elements (`<img>`) and elements with role="img" have appropriate accessible names
   - Checks for the presence of the alt attribute on images
   - Detects and warns about placeholder alt text ("image", "picture", etc.)
   - Correctly handles decorative images with empty alt text or role="presentation"
   - References WCAG 2.1 Success Criterion 1.1.1 (Non-text Content)
   - Logs detailed information about each image's accessibility status
   - Provides specific remediation suggestions for images with missing or improper alt text
   - Implementation includes checks for common alt text errors and patterns
   - Handles special cases like form input images and image buttons

## TODO Items

### Critical Priority

- [ ] Add heuristics to differentiate decorative vs informative images
- [ ] Implement background image meaning detection
- [ ] Add alt text quality evaluation (beyond just presence and placeholder detection)

### High Priority

- [ ] Implement complex image checks (charts, graphs, diagrams) for extended descriptions
- [ ] Add detection of image text (text within images)
- [ ] Implement checks for image maps with proper alt text
- [ ] Add SVG accessibility validation (title, desc elements)

### Medium Priority

- [ ] Add image alt text length checks (warn on excessively long alt text)
- [ ] Implement responsive image accessibility checks
- [ ] Add validation for CSS background images with meaning
- [ ] Implement checks for proper use of aria-labelledby with images

### Low Priority

- [ ] Add validation for image aspect ratio preservation
- [ ] Implement check for proper use of figcaption with figures
- [ ] Add logo image special case handling
- [ ] Implement detection of decorative images using techniques other than alt=""

## Implementation Notes

### Decorative vs. Informative Image Detection

```javascript
// Potential implementation approach
function detectImagePurpose(image) {
  const isLikelyDecorative = () => {
    // Check for visual characteristics of decorative images
    const width = image.offsetWidth
    const height = image.offsetHeight

    // Very small images are often decorative
    if (width < 30 || height < 30) return true

    // Check if image is in a pattern (like repeated background)
    const similarImages = document.querySelectorAll(`img[src="${image.src}"]`)
    if (similarImages.length > 2) return true

    // Check position - often decorative if in certain contexts
    const isInButtonOrLink = image.closest("a, button") !== null
    const hasTextSibling = Array.from(image.parentElement.childNodes).some(
      (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim()
    )

    if (isInButtonOrLink && hasTextSibling) {
      // Likely a decorative icon
      return true
    }

    return false
  }

  // Known pattern checks
  const isIcon =
    image.src.includes("icon") ||
    image.classList.contains("icon") ||
    image.classList.contains("fa") // Font Awesome

  const isBackground =
    image.classList.contains("background") || image.classList.contains("bg")

  return {
    isLikelyDecorative: isLikelyDecorative() || isIcon || isBackground,
    isIcon,
    isBackground,
    needsAltText: !isLikelyDecorative() && !isIcon && !isBackground
  }
}
```

### Image Text Detection

Use OCR or approximation to detect text within images:

- Canvas-based approaches to sample pixel values
- Edge detection to find text-like patterns
- Color contrast analysis to detect text-background boundaries

This is computationally intensive but valuable for finding accessibility issues.

### Complex Image Descriptions

For charts, graphs, diagrams, etc.:

- Check for presence of both short and long descriptions
- Look for aria-describedby in addition to alt text
- Check for detailed text alternatives nearby (figcaption, adjacent div, etc.)
- Warn when complex images appear to have only brief alt text

### SVG Accessibility

SVG-specific checks:

- Presence of title and desc elements
- role="img" when appropriate
- aria-labelledby pointing to title element
- Keyboard accessibility for interactive SVGs
