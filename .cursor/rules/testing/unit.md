---
description: Unit testing patterns and requirements
globs:
  - "**/*.test.{ts,tsx}"
  - "**/*.spec.{ts,tsx}"
  - "**/tests/unit/**/*"
---

# Unit Testing Guidelines

## Test Structure

```typescript
describe('Component', () => {
  it('renders successfully', () => {
    render(<Component />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles user interaction', async () => {
    render(<Component />)
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByText('Success')).toBeInTheDocument()
  })
})
```

## Test Organization

- Place tests next to implementation files
- Use `__tests__` directory for complex suites
- Follow naming convention: `ComponentName.test.tsx`
- Group related tests in describe blocks
- Keep test files focused

## Test Coverage

- Minimum 80% coverage for new code
- 100% coverage for critical paths
- Test all user interactions
- Cover error cases
- Test edge cases

## Testing Patterns

- Use meaningful test descriptions
- Follow Arrange-Act-Assert pattern
- Mock external dependencies
- Test component isolation
- Keep tests independent

## Component Testing

- Test component rendering
- Test prop variations
- Test state changes
- Test event handlers
- Test error states

## Hook Testing

- Test hook initialization
- Test hook updates
- Test hook cleanup
- Test hook errors
- Test hook side effects

## Utility Testing

- Test pure functions
- Test error handling
- Test edge cases
- Test type safety
- Test performance critical code
