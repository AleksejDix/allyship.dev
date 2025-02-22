---
title: "Guideline 3.1 – Readable"
description: "Make text content readable and understandable"
category: "Understandable"
tags: ["language", "readability", "text", "content"]
---

# Guideline 3.1 – Readable

## Overview

This guideline ensures that text content is readable and understandable for all users. It addresses language identification, uncommon word usage, abbreviations, and reading level requirements to make content accessible to users with different language abilities and cognitive needs.

## Success Criteria

### [3.1.1 Language of Page (Level A)](./3.1.1-language-of-page.md)

- Default human language of each page must be programmatically determined
- Language must be specified using valid language codes
- Language must be set on the HTML element
- Language must reflect the primary language of the page content

## Why This Matters

Clear and understandable content is essential because:

- Screen readers need language information to use correct pronunciation
- Translation tools need to identify the source language
- Users with cognitive disabilities need clear, simple content
- Multi-language users need to identify content in their preferred language

## Implementation Approaches

1. **Language Declaration**

   - Use valid HTML lang attributes
   - Specify language at document level
   - Mark language changes within content
   - Use ISO language codes

2. **Content Clarity**

   - Use clear, simple language
   - Define uncommon terms
   - Explain abbreviations
   - Provide summaries for complex content

3. **Multi-language Support**

   - Mark language changes appropriately
   - Provide translations when needed
   - Use language switchers effectively
   - Support right-to-left languages

4. **Reading Level**
   - Write for target audience
   - Provide simplified versions
   - Use clear headings and structure
   - Break down complex information

## Common Patterns

### Language Declaration

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Page Title</title>
  </head>
  <body>
    <!-- English content -->
    <p>Main content in English.</p>

    <!-- Content in another language -->
    <p lang="es">Contenido en español.</p>
  </body>
</html>
```

### Next.js Language Configuration

```tsx
// layout.tsx
export default function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  )
}
```

## Testing Checklist

1. **Language Declaration**

   - Verify HTML lang attribute
   - Check language code validity
   - Test screen reader pronunciation
   - Validate language changes

2. **Content Structure**

   - Review heading hierarchy
   - Check content organization
   - Test readability
   - Verify translations

3. **Technical Implementation**

   - Validate HTML markup
   - Test language switching
   - Check meta tags
   - Verify character encoding

4. **User Experience**
   - Test with screen readers
   - Check translation tools
   - Verify language detection
   - Test RTL support

## Resources

- [W3C - Understanding Readable](https://www.w3.org/WAI/WCAG21/Understanding/readable)
- [MDN - HTML Language Attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang)
- [ISO Language Codes](https://www.loc.gov/standards/iso639-2/php/code_list.php)
- [IANA Language Subtag Registry](https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry)
