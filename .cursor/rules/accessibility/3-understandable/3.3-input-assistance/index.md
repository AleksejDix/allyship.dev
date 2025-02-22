---
title: "Guideline 3.3 – Input Assistance"
description: "Help users avoid and correct mistakes"
category: "Understandable"
tags: ["forms", "errors", "validation", "input"]
---

# Guideline 3.3 – Input Assistance

## Overview

This guideline ensures that users receive appropriate assistance when interacting with forms and other input mechanisms. It helps users avoid mistakes and provides clear guidance on how to correct errors when they occur.

## Success Criteria

### [3.3.1 Error Identification (Level A)](./3.3.1-error-identification.md)

- Input errors must be automatically detected
- Error items must be clearly identified
- Error descriptions must be provided as text
- Errors must be communicated to all users

### [3.3.2 Labels or Instructions (Level A)](./3.3.2-labels-or-instructions.md)

- All input fields must have clear labels
- Instructions must be provided when needed
- Required fields must be clearly indicated
- Input format requirements must be specified

## Why This Matters

Input assistance is essential because:

- Users need clear feedback about errors
- Form completion can be complex and error-prone
- Clear instructions prevent mistakes
- Error recovery should be straightforward
- Accessibility tools need proper labeling

## Implementation Approaches

1. **Error Handling**

   - Provide clear error messages
   - Use proper ARIA attributes
   - Ensure error visibility
   - Support keyboard navigation

2. **Form Labeling**

   - Use semantic HTML
   - Implement proper label associations
   - Provide clear instructions
   - Include format examples

3. **Validation Feedback**

   - Show real-time validation
   - Provide clear error states
   - Use appropriate colors and icons
   - Support screen readers

4. **Input Assistance**
   - Offer format hints
   - Show validation rules
   - Provide example inputs
   - Include help text

## Common Patterns

### Form Error Handling

```tsx
function FormWithErrors() {
  const [errors, setErrors] = useState<Record<string, string>>({})

  return (
    <form noValidate onSubmit={handleSubmit}>
      <div role="alert" aria-live="polite">
        {Object.keys(errors).length > 0 && (
          <div className="error-summary">
            <h2>Please correct the following errors:</h2>
            <ul>
              {Object.entries(errors).map(([field, error]) => (
                <li key={field}>
                  <a href={`#${field}`}>{error}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="form-fields">{/* Form fields with error handling */}</div>
    </form>
  )
}
```

### Input Labels and Instructions

```tsx
function FormField({ id, label, type, required, hint, error }: FormFieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={id}>
        {label}
        {required && (
          <span aria-label="required" className="required-indicator">
            *
          </span>
        )}
      </label>

      {hint && (
        <div id={`${id}-hint`} className="field-hint">
          {hint}
        </div>
      )}

      <input
        id={id}
        type={type}
        aria-required={required}
        aria-describedby={`${id}-hint ${error ? `${id}-error` : ""}`}
        aria-invalid={!!error}
      />

      {error && (
        <div id={`${id}-error`} className="error-message" role="alert">
          {error}
        </div>
      )}
    </div>
  )
}
```

## Testing Checklist

1. **Error Handling**

   - Verify error detection
   - Check error descriptions
   - Test error visibility
   - Validate screen reader output

2. **Label Testing**

   - Check label associations
   - Verify required fields
   - Test instruction clarity
   - Validate help text

3. **Validation Testing**

   - Test real-time validation
   - Check error states
   - Verify format requirements
   - Test error recovery

4. **Accessibility Testing**
   - Test with screen readers
   - Check keyboard navigation
   - Verify ARIA attributes
   - Test high contrast modes

## Resources

- [W3C - Understanding Input Assistance](https://www.w3.org/WAI/WCAG21/Understanding/input-assistance)
- [MDN - Form Validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation)
- [WebAIM - Forms and Labels](https://webaim.org/techniques/forms/)
- [ARIA Authoring Practices - Form Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/forms/)
