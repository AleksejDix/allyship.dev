---
description: TypeScript coding patterns and best practices
globs:
  - "**/*.{ts,tsx}"
---

# TypeScript Patterns

## Type Definitions

- Use strict TypeScript mode (`"strict": true`)
- Prefer type inference where possible
- Use explicit return types for functions
- Use interfaces for object shapes
- Use type for unions and intersections

## Type Safety

- Avoid using `any` type
- Use unknown instead of any for unknown types
- Use proper type guards
- Leverage discriminated unions
- Use readonly where applicable

## Generic Types

- Use generic types for reusable components
- Constrain generic types when possible
- Use meaningful type parameter names
- Provide default type parameters when appropriate
- Document complex generic types

## Type Organization

- Group related types together
- Export types from a central location
- Use namespaces sparingly
- Keep type definitions close to usage
- Document complex type relationships

## Best Practices

- Use type assertions sparingly
- Prefer interface merging over intersection types
- Use mapped types for dynamic objects
- Leverage utility types
- Keep type definitions DRY
