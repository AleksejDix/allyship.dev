---
description: Documentation standards and best practices
globs:
  - "**/*.{ts,tsx,md}"
  - "**/docs/**/*"
  - "**/*.mdx"
---

# Documentation Standards

## Component Documentation

### Component Documentation Format

````tsx
/**
 * @component ComponentName
 * @description Brief description of the component's purpose and functionality
 *
 * @example
 * ```tsx
 * <ComponentName
 *   prop1="value"
 *   prop2={123}
 *   onAction={() => {}}
 * />
 * ```
 *
 * @props
 * @prop {string} prop1 - Description of prop1
 * @prop {number} prop2 - Description of prop2
 * @prop {() => void} onAction - Callback when action occurs
 *
 * @accessibility
 * - Keyboard navigation: Tab to focus, Enter to activate
 * - Screen reader: Announces status changes
 * - ARIA: Uses aria-label for better context
 */
export function ComponentName({
  prop1,
  prop2,
  onAction,
}: ComponentNameProps) {
  return (
    // Component implementation
  )
}
````

## Type Documentation

### Interface Documentation

```typescript
/**
 * Represents a user in the system
 * @interface User
 */
interface User {
  /** Unique identifier for the user */
  id: string

  /** User's full name */
  name: string

  /** User's email address */
  email: string

  /** User's role in the system */
  role: "admin" | "user" | "guest"

  /** Timestamp of when the user was created */
  createdAt: Date

  /** Optional profile image URL */
  avatarUrl?: string
}
```

## Function Documentation

### Function Documentation Format

````typescript
/**
 * Fetches and processes user data
 *
 * @async
 * @function fetchUserData
 * @param {string} userId - The ID of the user to fetch
 * @param {Object} options - Additional options for the fetch
 * @param {boolean} [options.includeProfile=false] - Whether to include profile data
 * @param {boolean} [options.includePosts=false] - Whether to include user's posts
 * @returns {Promise<User>} The user data
 * @throws {NotFoundError} When user is not found
 * @throws {AuthError} When not authorized to fetch user
 *
 * @example
 * ```typescript
 * try {
 *   const user = await fetchUserData("123", {
 *     includeProfile: true
 *   })
 *   console.log(user)
 * } catch (error) {
 *   handleError(error)
 * }
 * ```
 */
async function fetchUserData(
  userId: string,
  options: FetchUserOptions = {}
): Promise<User> {
  // Implementation
}
````

## API Documentation

### API Endpoint Documentation

```typescript
/**
 * @api {post} /api/users Create User
 * @apiName CreateUser
 * @apiGroup Users
 * @apiVersion 1.0.0
 *
 * @apiParam {String} name User's full name
 * @apiParam {String} email User's email address
 * @apiParam {String} password User's password
 *
 * @apiSuccess {String} id User's unique ID
 * @apiSuccess {String} name User's full name
 * @apiSuccess {String} email User's email address
 * @apiSuccess {Date} createdAt Timestamp of creation
 *
 * @apiError {Object} error Error object
 * @apiError {String} error.message Error message
 * @apiError {Number} error.status HTTP status code
 *
 * @apiExample {curl} Example usage:
 *     curl -X POST http://localhost:3000/api/users \
 *       -H "Content-Type: application/json" \
 *       -d '{"name":"John Doe","email":"john@example.com"}'
 */
export async function POST(req: Request) {
  // Implementation
}
```

## README Documentation

### Project README Format

````markdown
# Project Name

Brief description of the project.

## Features

- Feature 1: Description
- Feature 2: Description
- Feature 3: Description

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/username/project.git
   ```
````

2. Install dependencies

   ```bash
   pnpm install
   ```

3. Set up environment variables

   ```bash
   cp .env.example .env.local
   ```

4. Start the development server
   ```bash
   pnpm dev
   ```

## Project Structure

```
project/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/             # Utility functions
├── styles/          # Global styles
└── types/           # TypeScript types
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License.

````

## Code Comments

### Comment Standards

```typescript
// Single-line comment for brief explanations
const value = 42

/**
 * Multi-line comment for complex logic
 * Explains the purpose and implementation details
 */
function complexOperation() {
  // Implementation
}

// TODO: Mark incomplete implementations
// FIXME: Mark code that needs fixing
// NOTE: Add important notes for other developers

// Temporary code should be marked for removal
// TEMPORARY: Remove this after feature X is implemented
````

## Git Documentation

### Commit Message Format

```
type(scope): subject

body

footer
```

Types:

- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes
- refactor: Code refactoring
- test: Adding tests
- chore: Maintenance tasks

Example:

```
feat(auth): add password reset functionality

- Add reset password form component
- Implement reset password API endpoint
- Add email notification service

Closes #123
```

## API Response Format

### Standard API Response

```typescript
interface ApiResponse<T> {
  /** Whether the request was successful */
  success: boolean

  /** Response data (if success is true) */
  data?: T

  /** Error information (if success is false) */
  error?: {
    /** Error message */
    message: string
    /** HTTP status code */
    status: number
    /** Error code for client handling */
    code: string
    /** Optional error details */
    details?: unknown
  }
}

// Example usage
const response: ApiResponse<User> = {
  success: true,
  data: {
    id: "123",
    name: "John Doe",
    email: "john@example.com",
  },
}
```

## Testing Documentation

### Test Documentation Format

```typescript
describe("ComponentName", () => {
  /**
   * Test: Renders successfully
   * Verifies that the component renders without errors
   * and displays the expected content
   */
  it("renders successfully", () => {
    render(<ComponentName />)
    expect(screen.getByRole("button")).toBeInTheDocument()
  })

  /**
   * Test: Handles user interaction
   * Verifies that the component responds correctly
   * to user interactions like clicks
   */
  it("handles user interaction", async () => {
    const onAction = vi.fn()
    render(<ComponentName onAction={onAction} />)

    await userEvent.click(screen.getByRole("button"))
    expect(onAction).toHaveBeenCalled()
  })
})
```
