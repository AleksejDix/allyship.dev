# Link Rules - TODOs for Improvement

## Current Implementation Strengths

- Checks for accessible names on links
- Validates descriptive link text
- Ensures appropriate link text length
- Detects duplicate link text with different destinations

## Already Implemented Rules

1. **Link Accessible Name Rule**

   - Checks that all anchor elements (`<a>`) have non-empty accessible text content
   - Verifies that links with images have proper alt text when image is the only content
   - References WCAG 2.1 Success Criterion 2.4.4 (Link Purpose - In Context)
   - Logs the accessible name for each link found on the page

2. **Link Descriptive Text Rule**

   - Ensures that link text is descriptive and meaningful (avoids "click here", "read more", etc.)
   - Uses a pattern-matching approach to detect common non-descriptive link phrases
   - References WCAG 2.1 Success Criterion 2.4.4 (Link Purpose - In Context)
   - Examines link text in isolation to ensure it describes purpose

3. **Link Text Length Rule**

   - Validates that link text is not too short (less than 2 words) or too long (more than 20 words)
   - Checks for appropriate word count and character length
   - References WCAG 2.1 Success Criterion 2.4.4 (Link Purpose - In Context)
   - Provides detailed feedback about ideal link text length

4. **Link Duplicate Text Rule**
   - Identifies instances where multiple links have identical text but point to different destinations
   - Groups links by text content and checks their href attributes
   - References WCAG 2.1 Success Criterion 3.2.4 (Consistent Identification)
   - Helps users understand when similar-sounding links go to different places

## TODO Items

### Critical Priority

- [ ] Implement checks for links that open in new windows/tabs without warning
- [ ] Add target="\_blank" warning checks with rel="noopener noreferrer" validation
- [ ] Implement URL validity testing for broken links

### High Priority

- [ ] Add checks for adjacent links to the same destination (should be combined)
- [ ] Implement visual link identification check (links should be visually distinct from surrounding text)
- [ ] Add hover/focus state validation for links
- [ ] Implement check for link text describing file type for downloads

### Medium Priority

- [ ] Add checks for link text that matches filename patterns (e.g., "download file.pdf")
- [ ] Implement URL manipulation detection for better "same destination" checks
- [ ] Add validation for download attributes and proper MIME types
- [ ] Implement checks for mail and telephone links

### Low Priority

- [ ] Add validation for link context (surrounding text aids understanding)
- [ ] Implement warning for very short link text (single character or emoji-only)
- [ ] Add check for link density (too many links close together)

## Implementation Notes

### Links Opening in New Windows

```javascript
// Potential implementation approach
function checkNewWindowLinks() {
  const links = document.querySelectorAll('a[target="_blank"]')

  links.forEach((link) => {
    const hasRelAttr =
      link.getAttribute("rel")?.includes("noopener") &&
      link.getAttribute("rel")?.includes("noreferrer")

    // Check for warning text about new window
    const accessibleName = getAccessibleName(link)
    const hasNewWindowIndicator = /new window|new tab|external/i.test(
      accessibleName
    )

    // Check for icon indicating external link
    const hasExternalIcon = link.querySelector(
      'svg, img[alt*="external"], i[class*="external"]'
    )

    if (!hasRelAttr) {
      // Flag security/performance issue
    }

    if (!hasNewWindowIndicator && !hasExternalIcon) {
      // Flag accessibility issue - no indication that link opens in new window
    }
  })
}
```

### Adjacent Link Detection

Identify links that are adjacent in the DOM or visually adjacent on the page with the same destination URL. These should typically be combined into a single link for better usability.

### Visual Link Distinction

Check for:

- Text decoration (underline, etc.)
- Color difference from surrounding text
- Contrast with background
- Hover/focus state changes

Links should be distinguishable by more than just color to comply with WCAG 1.4.1.
