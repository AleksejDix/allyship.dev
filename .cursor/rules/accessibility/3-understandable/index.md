---
title: "3. Understandable"
description: "Information and the operation of user interface must be understandable"
category: "Understandable"
tags: ["accessibility", "wcag", "understandable"]
---

# Understandable Content Guidelines

Information and user interface operation must be understandable to all users.

## Overview

This guideline ensures that content and operations are clear and predictable. This includes:

- Making text content readable and understandable
- Making content appear and operate in predictable ways
- Helping users avoid and correct mistakes

## Success Criteria

### 3.1 Readable

- [3.1.1 Language of Page (Level A)](./3.1-readable/3.1.1-language-of-page.md)
- [3.1.2 Language of Parts (Level AA)](./3.1-readable/3.1.2-language-of-parts.md)

### 3.2 Predictable

- [3.2.1 On Focus (Level A)](./3.2-predictable/3.2.1-on-focus.md)
- [3.2.2 On Input (Level A)](./3.2-predictable/3.2.2-on-input.md)
- [3.2.3 Consistent Navigation (Level AA)](./3.2-predictable/3.2.3-consistent-navigation.md)
- [3.2.4 Consistent Identification (Level AA)](./3.2-predictable/3.2.4-consistent-identification.md)

### 3.3 Input Assistance

- [3.3.1 Error Identification (Level A)](./3.3-input-assistance/3.3.1-error-identification.md)
- [3.3.2 Labels or Instructions (Level A)](./3.3-input-assistance/3.3.2-labels-or-instructions.md)
- [3.3.3 Error Suggestion (Level AA)](./3.3-input-assistance/3.3.3-error-suggestion.md)
- [3.3.4 Error Prevention (Level AA)](./3.3-input-assistance/3.3.4-error-prevention.md)

## Why This Matters

- **All Users**: Need clear and predictable interfaces
- **Cognitive Users**: Need consistent patterns and clear instructions
- **Language Learners**: Need proper language identification
- **Screen Reader Users**: Need proper language for correct pronunciation
- **Form Users**: Need clear error messages and recovery options

## Implementation Approaches

### 1. Language Management

```tsx
// ✅ Do: Specify document language
function RootLayout() {
  return (
    <html lang="en">
      <body>
        {/* Content with proper language attributes */}
        <blockquote lang="fr">Le contenu en français</blockquote>
      </body>
    </html>
  )
}
```

### 2. Predictable Behavior

```tsx
// ✅ Do: Predictable focus management
function SearchForm() {
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="search"
        aria-label="Search products"
        onChange={handleChange}
      />
      <button type="submit">Search</button>
    </form>
  )
}
```

### 3. Form Assistance

```tsx
// ✅ Do: Clear error handling
function ContactForm() {
  return (
    <form noValidate onSubmit={handleSubmit}>
      <div role="alert" aria-live="polite">
        {errors.map((error) => (
          <p key={error.id} className="error">
            {error.message}
          </p>
        ))}
      </div>

      <label htmlFor="email">
        Email Address
        <span aria-hidden="true">*</span>
        <span className="sr-only">required</span>
      </label>
      <input
        id="email"
        type="email"
        required
        aria-required="true"
        aria-invalid={hasError}
        aria-describedby={hasError ? "email-error" : undefined}
      />
      {hasError && (
        <p id="email-error" className="error">
          Please enter a valid email address
        </p>
      )}
    </form>
  )
}
```

## Testing Checklist

1. **Language**

   - [ ] Page language specified
   - [ ] Content language changes marked
   - [ ] Language codes valid
   - [ ] Screen reader pronunciation correct

2. **Predictability**

   - [ ] Focus behavior consistent
   - [ ] Navigation consistent
   - [ ] Component behavior predictable
   - [ ] No unexpected changes

3. **Forms**

   - [ ] Clear labels and instructions
   - [ ] Error messages helpful
   - [ ] Required fields marked
   - [ ] Error prevention for important actions

4. **Content**
   - [ ] Reading level appropriate
   - [ ] Technical terms explained
   - [ ] Abbreviations expanded
   - [ ] Complex content simplified

## Resources

- [Understanding Understandable Content (W3C)](https://www.w3.org/WAI/WCAG21/Understanding/understandable)
- [WebAIM: Writing for Web Accessibility](https://webaim.org/techniques/writing/)
- [Deque University: Form Validation](https://dequeuniversity.com/rules/axe/4.0/label)
- [MDN: Form Validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation)
