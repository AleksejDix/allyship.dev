# Language of Page Rules - TODOs for Improvement

## Current Implementation Strengths

- Checks for language attribute presence on HTML element
- Validates BCP 47 language tag format
- Detects empty language attributes

## Already Implemented Rules

1. **Language of Page Rule**
   - Verifies that the HTML element has a valid and non-empty `lang` attribute
   - Validates the lang value against BCP 47 language tag format (e.g., "en", "en-US", "fr", "de")
   - References WCAG 2.1 Success Criterion 3.1.1 (Language of Page)
   - Logs details about the found language attribute or its absence
   - Provides clear remediation steps for fixing missing or invalid language attributes
   - Implementation includes checks for common incorrect language code patterns

## TODO Items

### Critical Priority

- [ ] Add language change detection within content (check for lang attributes on elements)
- [ ] Implement heuristic checks to verify content matches the declared language

### High Priority

- [ ] Add xml:lang consistency validation with lang attribute
- [ ] Implement checks for proper language inheritance in nested elements
- [ ] Add detection of mixed language content without proper markup

### Medium Priority

- [ ] Implement validation for direction attributes (RTL/LTR)
- [ ] Add check for language-specific punctuation and typography
- [ ] Implement more comprehensive BCP 47 language tag validation

### Low Priority

- [ ] Add check for preferred language code formatting (e.g., "en-US" vs "en_US")
- [ ] Implement detection of potential language-specific features (like hyphens or quotes)
- [ ] Add check for language metadata in HTTP headers

## Implementation Notes

### Language Change Detection

```javascript
// Potential implementation approach
function detectLanguageChanges() {
  // Find all elements with lang attributes
  const elementsWithLang = document.querySelectorAll("[lang]")

  // Get the document language
  const docLang = document.documentElement.lang.toLowerCase()

  elementsWithLang.forEach((element) => {
    const elementLang = element.lang.toLowerCase()

    // Skip the html element itself
    if (element === document.documentElement) return

    // If element language differs from document language
    if (elementLang !== docLang) {
      // Check if parent element has same language as document
      const parentLang = findParentLanguage(element)

      if (parentLang === docLang) {
        // This is a valid language change
        // Verify it has appropriate markup
      } else {
        // Potentially nested language changes - needs careful checking
      }
    }
  })
}

function findParentLanguage(element) {
  let parent = element.parentElement
  while (parent) {
    if (parent.hasAttribute("lang")) {
      return parent.lang.toLowerCase()
    }
    parent = parent.parentElement
  }
  return document.documentElement.lang.toLowerCase()
}
```

### Content Language Heuristics

Use language detection libraries or heuristics to detect major language mismatches:

- Character set usage (e.g., Cyrillic, Chinese, Arabic)
- Common language patterns and words
- Language-specific characters (e.g., ñ, ç, ß)

This won't be perfect but can catch major issues like English content marked as French.

### Direction Attribute Validation

For RTL languages (Arabic, Hebrew, etc.), check that:

- `dir="rtl"` is present on appropriate elements
- CSS properties like `direction` and `text-align` are properly set
- Bidirectional text handling is correct
