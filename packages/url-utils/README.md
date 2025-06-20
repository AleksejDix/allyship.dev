# @allystudio/url-utils

Comprehensive URL normalization, validation, and manipulation utilities for web applications. This package consolidates all URL handling patterns used across the AllyStudio ecosystem and provides a robust, well-tested foundation for URL operations.

## Features

- 🔧 **URL Normalization** - Consistent URL cleaning across browsers
- ✅ **Validation** - Comprehensive URL validation with detailed error messages
- 🎯 **Extraction** - Extract domains, hostnames, paths, and components
- 🔍 **Comparison** - Compare URLs with flexible options
- 🌍 **International Support** - Handles international domains and punycode
- 🚀 **Performance** - Optimized for high-throughput applications
- 📦 **Zero Dependencies** - Only depends on `tldts` for domain parsing
- 🧪 **Well Tested** - Comprehensive test suite with 100+ test cases

## Installation

```bash
npm install @allystudio/url-utils
```

## Quick Start

```typescript
import { normalizeUrl, extractDomain, compareUrls } from '@allystudio/url-utils'

// Normalize URLs for consistent storage
const normalized = normalizeUrl('https://www.Google.com/Path/?utm_source=test')
console.log(normalized.full) // "google.com/path"

// Extract domain from any URL
const domain = extractDomain('https://sub.example.com/path')
console.log(domain) // "example.com"

// Compare URLs intelligently
const isSame = compareUrls(
  'https://example.com/path?param=1',
  'https://www.example.com/path'
) // true (ignores query params and www by default)
```

## API Reference

### Normalization

#### `normalizeUrl(url, options?)`

Normalizes a URL with consistent rules across browsers.

```typescript
interface NormalizationOptions {
  keepQueryParams?: boolean     // Keep query parameters (default: false)
  keepFragment?: boolean        // Keep hash fragments (default: false)
  removeWww?: boolean          // Remove www prefix (default: true)
  removeTrailingSlash?: boolean // Remove trailing slashes (default: true)
  sortQueryParams?: boolean     // Sort query parameters (default: true)
}

const result = normalizeUrl('https://www.example.com/path/?b=2&a=1', {
  keepQueryParams: true,
  sortQueryParams: true
})
// Returns: { hostname: "example.com", domain: "example.com", path: "/path", full: "example.com/path?a=1&b=2", raw: "..." }
```

#### `normalizeUrlString(url, keepQueryParams?)`

Simple string-based normalization (compatible with legacy code).

```typescript
const normalized = normalizeUrlString('https://www.example.com/path', false)
// Returns: "example.com/path"
```

### Validation

#### `isValidPageUrl(url)`

Quick validation for web page URLs.

```typescript
isValidPageUrl('https://example.com') // true
isValidPageUrl('chrome://settings')   // false
isValidPageUrl('localhost')           // false
```

#### `validateUrl(url)`

Detailed validation with error messages.

```typescript
const result = validateUrl('invalid-url')
// Returns: { isValid: false, error: "Invalid domain" }
```

### Extraction

#### `extractDomain(url)` / `extractHostname(url)` / `extractPath(url)`

Extract specific components from URLs.

```typescript
extractDomain('https://sub.example.com/path')    // "example.com"
extractHostname('https://sub.example.com/path')  // "sub.example.com"
extractPath('https://example.com/path?param=1')  // "/path"
```

### Comparison

#### `compareUrls(url1, url2, options?)`

Compare URLs with flexible options.

```typescript
interface ComparisonOptions {
  ignoreQueryParams?: boolean  // Ignore query parameters (default: true)
  ignoreFragment?: boolean     // Ignore hash fragments (default: true)
  ignoreCase?: boolean        // Ignore case differences (default: true)
}

compareUrls(
  'https://Example.com/path?param=1',
  'https://www.example.com/path#section',
  { ignoreQueryParams: true, ignoreFragment: true }
) // true
```

#### `compareHostnames(url1, url2)`

Compare just the domains of two URLs.

```typescript
compareHostnames('https://sub1.example.com', 'https://sub2.example.com') // true
```

### Utility Functions

#### `isHomepage(url)`

Check if a URL points to a homepage.

```typescript
isHomepage('https://example.com')    // true
isHomepage('https://example.com/')   // true
isHomepage('https://example.com/about') // false
```

#### `isUrlUnderDomain(childUrl, parentDomain)`

Check if a URL belongs to a specific domain.

```typescript
isUrlUnderDomain('https://blog.example.com/post', 'example.com') // true
```

#### `getDisplayUrl(url)`

Create a display-friendly version of a URL.

```typescript
getDisplayUrl('https://example.com/path?param=value')
// Returns: "example.com/path?param=value"
```

## Use Cases

### Website/Page Management

```typescript
import { normalizeUrl, extractDomain, extractPath } from '@allystudio/url-utils'

// Normalize website URLs (remove query params)
const websiteUrl = normalizeUrl(userInput).full

// Extract domain and path for database storage
const domain = extractDomain(pageUrl)
const path = extractPath(pageUrl)
```

### Web Crawling

```typescript
import { normalizeUrlForCrawling, shouldSkipUrl, isUrlUnderDomain } from '@allystudio/url-utils'

// Normalize URLs for crawling (removes query params and fragments)
const normalized = normalizeUrlForCrawling(foundUrl, baseUrl)

// Skip non-HTML resources
if (shouldSkipUrl(url)) {
  continue
}

// Stay within domain
if (!isUrlUnderDomain(foundUrl, targetDomain)) {
  continue
}
```

### Analytics & SEO

```typescript
import { normalizeUrl, compareUrls, extractDomain } from '@allystudio/url-utils'

// Deduplicate URLs for analytics
const canonical = normalizeUrl(pageUrl, { keepQueryParams: false }).full

// Group pages by domain
const domain = extractDomain(pageUrl)

// Compare URLs ignoring tracking parameters
const isSamePage = compareUrls(url1, url2, { ignoreQueryParams: true })
```

## Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support (IDNs shown in native script)
- **Safari**: Full support (may handle some Unicode differently)
- **Mobile**: Full support (respects length limitations)

## International Domain Support

The package fully supports international domain names (IDNs):

```typescript
// Handles international domains
normalizeUrl('https://グーグル.jp/検索')
// Returns normalized punycode version

// Supports complex TLD structures
extractDomain('https://service.gov.uk') // "gov.uk"
extractDomain('https://university.edu.au') // "edu.au"
```

## Error Handling

All functions include robust error handling:

```typescript
try {
  const result = normalizeUrl(userInput)
  // Use result.full for normalized URL
} catch (error) {
  // Handle invalid URL
  console.error('Invalid URL:', error.message)
}

// Or use validation first
const validation = validateUrl(userInput)
if (!validation.isValid) {
  console.error('Invalid URL:', validation.error)
} else {
  const result = normalizeUrl(userInput)
}
```

## Performance

The package is optimized for high-throughput applications:

- Efficient domain parsing with `tldts`
- Minimal string operations
- Graceful fallbacks for invalid input
- No unnecessary object creation

## Migration Guide

### From AllyStudio URL Utils

```typescript
// Old
import { normalizeUrl, extractDomain } from '@/utils/url'

// New
import { normalizeUrl, extractDomain } from '@allystudio/url-utils'
// API is identical, but returns structured objects
```

### From Allyship URL Utils

```typescript
// Old
import { normalizeUrl } from '@/utils/url'
const normalized = normalizeUrl(url, keepQueryParams)

// New
import { normalizeUrlString } from '@allystudio/url-utils'
const normalized = normalizeUrlString(url, keepQueryParams)
```

### From Custom Implementations

```typescript
// Replace custom normalization
function customNormalize(url) {
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '')
}

// With robust normalization
import { normalizeUrlString } from '@allystudio/url-utils'
const normalized = normalizeUrlString(url)
```

## Contributing

This package is part of the AllyStudio ecosystem. See the main repository for contribution guidelines.

## License

MIT License - see LICENSE file for details.
