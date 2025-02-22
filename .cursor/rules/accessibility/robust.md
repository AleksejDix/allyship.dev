---
description: WCAG 2.1 Robust Success Criteria Guidelines
globs:
  - "**/*.{tsx,jsx}"
  - "**/components/**/*"
---

# Robust Content Guidelines

## Compatible (4.1)

### Valid HTML

```tsx
// ❌ Avoid invalid HTML structure
<div>
  <h2>Section Title</h2>
  <h1>Main Title</h1>  {/* Wrong heading order */}
</div>

// ✅ Use valid HTML structure
<div>
  <h1>Main Title</h1>
  <h2>Section Title</h2>
</div>
```

### Name, Role, Value

```tsx
// ❌ Avoid custom controls without proper ARIA
<div
  className="custom-checkbox"
  onClick={toggle}
>
  {checked ? "✓" : ""}
</div>

// ✅ Use proper ARIA attributes
<div
  role="checkbox"
  aria-checked={checked}
  tabIndex={0}
  onClick={toggle}
  onKeyDown={(e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault()
      toggle()
    }
  }}
>
  <span aria-hidden="true">
    {checked ? "✓" : ""}
  </span>
</div>

// ✅ Better: Use native elements when possible
<input
  type="checkbox"
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
/>
```

### Status Messages

```tsx
// ❌ Avoid silent status updates
function SearchResults() {
  return loading ? (
    <div>Loading...</div>
  ) : (
    <div>Found {results.length} items</div>
  )
}

// ✅ Announce status changes
function SearchResults() {
  return (
    <>
      {loading && (
        <div role="status">
          Loading search results
        </div>
      )}
      <div
        role="status"
        aria-live="polite"
      >
        Found {results.length} items
      </div>
    </>
  )
}
```

## Parsing (4.1.1)

### Unique IDs

```tsx
// ❌ Avoid duplicate IDs
<div>
  <label htmlFor="input">Name</label>
  <input id="input" />
  <label htmlFor="input">Email</label>
  <input id="input" />
</div>

// ✅ Use unique IDs
<div>
  <label htmlFor="name-input">Name</label>
  <input id="name-input" />
  <label htmlFor="email-input">Email</label>
  <input id="email-input" />
</div>
```

### Complete Start and End Tags

```tsx
// ❌ Avoid incomplete tags
<div>
  <p>First paragraph
  <p>Second paragraph
</div>

// ✅ Use complete tags
<div>
  <p>First paragraph</p>
  <p>Second paragraph</p>
</div>
```

## Name Role Value (4.1.2)

### Custom Controls

```tsx
// ❌ Avoid non-semantic interactive elements
<div
  className="custom-button"
  onClick={handleClick}
>
  Click me
</div>

// ✅ Use semantic elements with proper roles
<button
  onClick={handleClick}
  aria-pressed={isActive}
>
  Click me
</button>
```

### ARIA Patterns

```tsx
// ❌ Avoid incorrect ARIA usage
<div role="button" onClick={handleClick}>
  <div role="button">Nested button</div>
</div>

// ✅ Follow ARIA patterns
<button onClick={handleClick}>
  <span>Button text</span>
</button>
```

## Status Messages (4.1.3)

### Toast Messages

```tsx
// ❌ Avoid silent notifications
function showToast(message) {
  return <div className="toast">{message}</div>
}

// ✅ Use proper ARIA roles for notifications
function Toast({ message, type = "info" }) {
  return (
    <div
      role="alert"
      aria-live={type === "error" ? "assertive" : "polite"}
      className={`toast toast-${type}`}
    >
      {message}
    </div>
  )
}
```

### Loading States

```tsx
// ❌ Avoid non-accessible loading states
function LoadingState() {
  return (
    <div className="loading">
      Loading...
    </div>
  )
}

// ✅ Use proper loading indicators
function LoadingState() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="loading"
    >
      <span className="sr-only">Loading content</span>
      <div
        className="spinner"
        aria-hidden="true"
      />
    </div>
  )
}
```

### Form Feedback

```tsx
// ❌ Avoid non-semantic form feedback
function Form() {
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" />
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Saved!</div>}
    </form>
  )
}

// ✅ Use semantic form feedback
function Form() {
  return (
    <form
      onSubmit={handleSubmit}
      aria-describedby={
        error ? "form-error" :
        success ? "form-success" : undefined
      }
    >
      <input type="text" />
      {error && (
        <div
          id="form-error"
          role="alert"
          className="error"
        >
          {error}
        </div>
      )}
      {success && (
        <div
          id="form-success"
          role="status"
          className="success"
        >
          Form submitted successfully
        </div>
      )}
    </form>
  )
}
```
