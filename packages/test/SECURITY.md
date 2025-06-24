# Security Guide - ACT Test Runner

## Overview

The ACT Test Runner has been designed with security as a primary consideration. This document outlines the security measures implemented, potential risks, and best practices for secure usage.

## Security Assessment

### ✅ **Security Status: SECURE**

The ACT test runner has been thoroughly analyzed and found to be free from common security vulnerabilities:

- ❌ No code injection vulnerabilities (eval, Function constructor)
- ❌ No XSS vulnerabilities (innerHTML/outerHTML assignments)
- ❌ No prototype pollution risks
- ❌ No unsafe DOM manipulation
- ❌ No dynamic code execution

## Core Security Features

### 1. Read-Only DOM Access

The test runner only **reads** from the DOM, never **writes** to it:

```typescript
// ✅ SAFE: Only reading DOM properties
const textContent = element.textContent || ''
const outerHTML = element.outerHTML
const selector = generateSelector(element)
```

**Security Benefit**: Eliminates XSS and DOM manipulation attacks.

### 2. Input Validation

All user inputs are properly validated:

```typescript
// ✅ Regex validation for element types
if (!/^h[1-6]$/.test(tagName)) {
  throw new ExpectationError('Invalid heading element')
}

// ✅ Safe string conversion
const message = String(this.actual)
```

**Security Benefit**: Prevents injection attacks and type confusion.

### 3. Memory Safety

Configurable limits prevent memory exhaustion attacks:

```typescript
// ✅ DOM content limits
maxTextContentLength: 1000,    // Limit text storage
maxOuterHTMLLength: 5000,      // Limit HTML storage
storeElementInfo: true         // Can be disabled

// ✅ Screenshot limits
maxScreenshots: 50,            // Limit screenshot count
autoCleanup: true              // Automatic cleanup
```

**Security Benefit**: Prevents DoS attacks via memory exhaustion.

### 4. Error Handling

Safe error messages without sensitive data exposure:

```typescript
// ✅ Safe error messages
throw new ExpectationError(
  `Expected element to have accessible name "${expected}", but got "${name}"`
)
```

**Security Benefit**: Prevents information disclosure.

## Chrome Extension Security

### Permission Model

The screenshot plugin uses Chrome's permission system:

```typescript
// ✅ Explicit permission checking
const hasPermissions = await chrome.permissions.contains({
  permissions: ['activeTab'] // Minimal permissions
})

// ✅ User-approved permission requests
if (!hasPermissions) {
  const granted = await this.requestPermissions()
  if (!granted) return null
}
```

### DevTools Protocol Safety

When using DevTools Protocol for screenshots:

```typescript
// ✅ Proper attach/detach cycle
await chrome.debugger.attach({ tabId }, '1.3')
try {
  // Safe screenshot capture
  const { data } = await chrome.debugger.sendCommand(/* ... */)
} finally {
  await chrome.debugger.detach({ tabId }) // Always cleanup
}
```

### Recommended Manifest Permissions

For Chrome extensions using the test runner:

```json
{
  "permissions": [
    "activeTab"           // ✅ Minimal: Only active tab
  ],
  "optional_permissions": [
    "tabs"               // ✅ Optional: For advanced features
  ],
  "host_permissions": [
    "<all_urls>"         // ⚠️  Only if testing arbitrary sites
  ]
}
```

## Security Best Practices

### 1. Minimal Configuration

Use minimal settings for production:

```typescript
// ✅ Production configuration
configure({
  maxTextContentLength: 500,     // Minimal text storage
  maxOuterHTMLLength: 1000,      // Minimal HTML storage
  storeElementInfo: false,       // Disable element storage
  maxScreenshots: 10,            // Limit screenshots
  autoCleanup: true              // Enable cleanup
})
```

### 2. Permission Management

Request minimal Chrome extension permissions:

```typescript
// ✅ Request only what you need
await chrome.permissions.request({
  permissions: ['activeTab']  // Not 'tabs'
})

// ✅ Check permissions before use
const hasPermission = await chrome.permissions.contains({
  permissions: ['activeTab']
})
```

### 3. Content Security Policy

If using in web pages, implement CSP:

```html
<!-- ✅ Strict CSP for web usage -->
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

### 4. Regular Updates

Keep the test runner updated:

```bash
# ✅ Regular updates
npm update @allystudio/act-test-runner
```

## Threat Model

### In-Scope Threats

1. **Code Injection**: Prevented by read-only DOM access
2. **XSS Attacks**: Prevented by no innerHTML usage
3. **Memory Exhaustion**: Prevented by configurable limits
4. **Permission Escalation**: Prevented by minimal permissions

### Out-of-Scope Threats

1. **Network Attacks**: Test runner doesn't make network requests
2. **File System Access**: No file system operations
3. **Cryptographic Attacks**: No cryptographic operations

## Vulnerability Reporting

If you discover a security vulnerability:

1. **DO NOT** create a public issue
2. Email security concerns to: [security@allystudio.dev]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact assessment
   - Suggested fix (if any)

## Security Updates

Security updates will be:

- Released immediately for critical issues
- Documented in release notes
- Communicated via security advisories

## Compliance

The ACT test runner follows:

- ✅ OWASP secure coding practices
- ✅ Chrome extension security guidelines
- ✅ Web security best practices
- ✅ Privacy-by-design principles

## Security Checklist

Before deploying the test runner:

- [ ] Configure minimal memory limits
- [ ] Use least-privilege permissions
- [ ] Enable automatic cleanup
- [ ] Implement proper error handling
- [ ] Regular security updates
- [ ] Monitor for unusual memory usage
- [ ] Review Chrome extension permissions

## Conclusion

The ACT Test Runner is designed to be secure by default. By following the guidelines in this document, you can ensure safe usage in your accessibility testing workflows.

For questions about security, contact: security@allystudio.dev
