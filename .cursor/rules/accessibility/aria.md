---
description: ARIA usage and accessibility patterns
globs:
  - "**/*.{tsx,jsx}"
  - "**/components/**/*"
---

# ARIA Guidelines

## ARIA Labeling

### Prefer aria-labelledby over aria-label

❌ Avoid:

```tsx
<button aria-label="Close menu">
  <Icon />
</button>
```

✅ Use:

```tsx
<button aria-labelledby="menu-close-text">
  <span id="menu-close-text" className="sr-only">
    Close menu
  </span>
  <Icon aria-hidden="true" />
</button>
```

## ARIA Roles

- Use semantic HTML elements when possible
- Add ARIA roles only when necessary
- Use proper role hierarchy
- Implement proper landmarks
- Follow ARIA design patterns

## ARIA States

- Maintain proper aria-expanded state
- Use aria-pressed for toggles
- Implement aria-selected properly
- Use aria-current appropriately
- Handle aria-disabled state

## ARIA Properties

- Use aria-controls properly
- Implement aria-owns when needed
- Use aria-describedby for descriptions
- Handle aria-live regions
- Implement proper aria-atomic

## Dynamic Content

- Update ARIA states on changes
- Handle loading states properly
- Announce important updates
- Manage focus appropriately
- Handle modal dialogs correctly

## Form Controls

- Label form controls properly
- Use aria-invalid for errors
- Implement aria-required
- Handle aria-errormessage
- Use proper fieldset/legend

## Best Practices

- Test with screen readers
- Validate ARIA usage
- Keep ARIA simple
- Document ARIA patterns
- Follow WAI-ARIA guidelines
