# Link Rules - TODOs for Improvement

## Current Implementation Strengths

- Checks for accessible names on links
- Validates descriptive link text
- Ensures appropriate link text length
- Detects duplicate link text with different destinations
- Verifies external links are properly marked with new window indicators
- Checks touch target size for better mobile accessibility

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

5. **External Link Indicator Rule** ✅

   - Detects links that open in new windows/tabs (target="\_blank")
   - Verifies that links indicate they open in a new window/tab in the accessible name
   - Checks for security attributes (rel="noopener noreferrer")
   - References WCAG 2.1 Success Criterion 3.2.4 (Consistent Identification)
   - Provides specific feedback on what's missing (indication or security attributes)

6. **Link Touch Target Size Rule** ✅
   - Verifies that link target areas meet WCAG 2.1 AAA requirements (44×44px)
   - Calculates actual pixel dimensions of link elements
   - Skips visually hidden elements that are still accessible to screen readers
   - References WCAG 2.1 Success Criterion 2.5.5 (Target Size)
   - Provides specific size measurements and recommendations

## TODO Items

### Critical Priority

- [x] Implement checks for links that open in new windows/tabs without warning
- [x] Add target="\_blank" warning checks with rel="noopener noreferrer" validation
- [ ] Implement URL validity testing for broken links

### High Priority

- [ ] Add checks for adjacent links to the same destination (should be combined)
- [ ] Implement visual link identification check (links should be visually distinct from surrounding text)
- [ ] Add hover/focus state validation for links
- [x] Add check for touch target size for better mobile accessibility

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

### Links Opening in New Windows (✅ Implemented)

The enhanced implementation now:

- Specifically targets links with `target="_blank"`
- Checks for security attributes (`rel="noopener noreferrer"`)
- Verifies multiple phrases that indicate a link opens in a new window/tab
- Provides detailed feedback on what's missing
- Properly handles accessibility requirements for external links

### Touch Target Size (✅ Implemented)

The new touch target size rule:

- Measures the actual pixel dimensions of link elements
- Compares against WCAG 2.5.5 (AAA) minimum size requirements (44×44px)
- Skips elements that are visually hidden but still accessible to screen readers
- Provides specific measurements and clear recommendations
- Helps ensure mobile accessibility for touch interfaces

### Adjacent Link Detection

Identify links that are adjacent in the DOM or visually adjacent on the page with the same destination URL. These should typically be combined into a single link for better usability.

### Visual Link Distinction

Check for:

- Text decoration (underline, etc.)
- Color difference from surrounding text
- Contrast with background
- Hover/focus state changes

Links should be distinguishable by more than just color to comply with WCAG 1.4.1.
