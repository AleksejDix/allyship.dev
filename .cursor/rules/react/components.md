---
description: React component structure and patterns
globs:
  - "**/*.{tsx,jsx}"
  - "**/components/**/*"
---

# React Component Guidelines

## Component Structure

- Use functional components with TypeScript
- Props interface must be defined above component
- Use proper component file naming: `ComponentName.tsx`
- Keep components focused and single-responsibility
- Extract reusable logic into custom hooks

## Props Management

- Define prop types explicitly
- Use proper prop naming conventions
- Document required vs optional props
- Provide default prop values when appropriate
- Use prop destructuring

## Component Organization

- Group related components together
- Keep component files small and focused
- Use proper directory structure
- Implement proper component composition
- Follow component hierarchy

## State Management

- Use React Server Components for initial state
- Implement optimistic updates for better UX
- Use `useState` for simple component state
- Use `useReducer` for complex state logic
- Avoid prop drilling with Context API

## Component Lifecycle

- Handle component mounting properly
- Clean up side effects
- Manage component updates efficiently
- Use proper dependency arrays in hooks
- Handle error boundaries

## Performance Optimization

- Implement proper memoization
- Use React.memo when necessary
- Optimize re-renders
- Handle large lists efficiently
- Profile component performance

## Component Testing

- Write unit tests for components
- Test component interactions
- Test component lifecycle
- Test error states
- Test accessibility features
