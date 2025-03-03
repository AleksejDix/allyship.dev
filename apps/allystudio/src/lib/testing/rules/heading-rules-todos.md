# Heading Rules - TODOs for Improvement

## Current Implementation Strengths

- Checks for heading structure and hierarchy
- Verifies accessible names for headings
- Validates that first heading is H1
- Checks for proper heading order

## Already Implemented Rules

1. **Heading Accessible Name Rule**

   - Checks that all h1-h6 elements have non-empty accessible names
   - Logs the number of headings found and their accessible names
   - References WCAG 2.1 Success Criterion 2.4.6 (Headings and Labels)
   - Implementation includes placeholder detection and empty text check

2. **First Heading is H1 Rule**

   - Ensures the first heading in the document is an h1 element
   - Logs the first heading found and its level
   - Supports document structure and hierarchy requirements
   - References WCAG 2.1 Success Criterion 1.3.1 (Info and Relationships)

3. **Heading Order Rule**
   - Checks that heading levels follow proper hierarchical structure without skipping
   - Logs each heading's level and checks if it's more than one level greater than previous
   - References WCAG 2.1 Success Criterion 1.3.1 (Info and Relationships)
   - Identifies specific headings that skip levels in the hierarchy

## TODO Items

### Critical Priority

- [ ] Implement better heading level skipping detection with context awareness
- [ ] Add visual versus semantic heading detection (text that looks like a heading but isn't marked up as one)

### High Priority

- [ ] Add check for content-to-heading ratio (detect headings with insufficient content)
- [ ] Implement check for duplicate heading text in the same section
- [ ] Add validation for document outline structure

### Medium Priority

- [ ] Add landmark context validation (headings should be within appropriate landmarks)
- [ ] Implement heading density check (too many headings close together)
- [ ] Add heading prominence evaluation (visual styling matches semantic importance)

### Low Priority

- [ ] Implement heading length evaluation (warn on excessively long headings)
- [ ] Add check for non-descriptive heading text ("More", "Details", etc.)
- [ ] Implement breadcrumb pattern detection and relation to heading structure

## Implementation Notes

### Content-to-Heading Ratio

```javascript
// Potential implementation approach
function checkContentHeadingRatio(headings) {
  for (let i = 0; i < headings.length - 1; i++) {
    const heading = headings[i]
    const nextHeading = headings[i + 1]

    // Get content between headings
    const contentLength = getTextBetweenElements(heading, nextHeading).length

    // If content is too short compared to heading length
    if (contentLength < heading.textContent.length * 2) {
      // Flag as potential issue - heading with insufficient content
    }
  }
}
```

### Heading Level Skipping Enhancement

Current implementation detects skips but could be improved to understand common patterns and reduce false positives in certain contexts (like sidebars or card layouts).

### Visual Heading Detection

Look for text with:

- Significantly larger font size than surrounding text
- Bold or heavier font weight
- Centered alignment within container
- Whitespace above and below
- Different color than body text

Compare these to actual semantic headings to find mismatches.
