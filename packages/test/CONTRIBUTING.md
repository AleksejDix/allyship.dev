# Contributing to @allystudio/test

Thank you for your interest in contributing to @allystudio/test! This guide will help you get started with development and understand our contribution process.

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 16+ (we recommend using the latest LTS version)
- **npm**: 8+ (comes with Node.js)
- **Git**: Latest version
- **TypeScript**: 4.5+ (installed as dependency)

### Development Setup

1. **Fork and Clone**
   ```bash
   # Fork the repository on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/allyship.dev.git
   cd allyship.dev/packages/test
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Verify Setup**
   ```bash
   # Run tests to ensure everything works
   npm test

   # Build the project
   npm run build

   # Run linting
   npm run lint
   ```

4. **Start Development**
   ```bash
   # Watch mode for development
   npm run dev

   # Run tests in watch mode
   npm run test:watch
   ```

## 📁 Project Structure

```
packages/test/
├── src/
│   ├── core/           # Core runner and types
│   ├── plugins/        # Vue composition-style plugins
│   └── utils/          # Utility functions (timeout, retry)
├── tests/              # Test files
├── examples/           # Usage examples
├── demo/               # Interactive demo
└── dist/               # Built files (generated)
```

## 🛠️ Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

### 2. Make Your Changes

- **Code Style**: We use TypeScript with strict mode
- **Linting**: Code must pass `npm run lint` with zero warnings
- **Tests**: All tests must pass with `npm test`
- **Types**: Maintain full TypeScript coverage

### 3. Test Your Changes

```bash
# Run all tests
npm test

# Run specific test files
npm test -- filename.test.ts

# Run tests in browser environment
npm run test:browser

# Run core tests only
npm run test:core

# Check TypeScript compilation
npm run typecheck
```

### 4. Commit Your Changes

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Feature
git commit -m "feat: add new plugin for form validation"

# Bug fix
git commit -m "fix: resolve timeout handling in retry logic"

# Documentation
git commit -m "docs: update API reference for test context"

# Refactor
git commit -m "refactor: simplify plugin registration system"

# Tests
git commit -m "test: add coverage for edge cases in runner"
```

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear title following conventional commits
- Description of changes made
- Reference to any related issues
- Screenshots/demos if applicable

## 🎯 Contribution Guidelines

### Code Quality Standards

- **Minimalism**: Follow the library's minimalist philosophy - less is more
- **TypeScript**: Full type safety required, no `any` types
- **Functional**: Prefer functional programming over OOP
- **Performance**: Be mindful of bundle size impact
- **Accessibility**: Ensure changes support accessibility testing goals

### Plugin Development

When creating new plugins, follow the Vue composition pattern:

```typescript
export function useMyPlugin(runner: Runner): void {
  // Plugin logic here
  // Modify runner behavior directly
}
```

**Plugin Guidelines:**
- Use functional composition over classes
- Keep plugins focused on single responsibility
- Include TypeScript types and JSDoc comments
- Add tests for plugin functionality
- Update documentation

### Testing Requirements

- **Unit Tests**: All new functions must have unit tests
- **Integration Tests**: Complex features need integration tests
- **Browser Tests**: DOM-related features need browser tests
- **Coverage**: Maintain existing coverage levels
- **Performance**: No significant performance regressions

### Documentation Standards

- **JSDoc**: All public APIs must have JSDoc comments
- **README**: Update README.md if adding new features
- **API.md**: Update API documentation for new methods
- **Examples**: Add examples for new functionality
- **CHANGELOG**: Add entry for notable changes

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Clear Description**: What happened vs what you expected
2. **Reproduction Steps**: Minimal steps to reproduce the issue
3. **Environment**: Browser/Node.js version, OS, library version
4. **Code Sample**: Minimal code that demonstrates the issue
5. **Error Messages**: Full error messages and stack traces

Use our [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md).

## 💡 Feature Requests

For new features, please:

1. **Check Existing Issues**: Avoid duplicates
2. **Describe Use Case**: Why is this feature needed?
3. **Propose Solution**: How should it work?
4. **Consider Alternatives**: What other approaches exist?
5. **Bundle Size Impact**: Consider the minimalist philosophy

Use our [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md).

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Watch mode for development
npm run build            # Build for production
npm run typecheck        # TypeScript compilation check

# Testing
npm test                 # Run all tests
npm run test:core        # Run core tests only
npm run test:browser     # Run browser tests
npm run test:watch       # Watch mode for tests
npm run test:coverage    # Generate coverage report

# Quality
npm run lint             # Run linter (oxlint)
npm run lint:fix         # Fix auto-fixable linting issues

# Demo & Examples
npm run demo             # Start demo server
npm run benchmark        # Run performance benchmarks
```

## 📋 Pull Request Checklist

Before submitting a PR, ensure:

- [ ] **Tests**: All tests pass (`npm test`)
- [ ] **Linting**: No linting errors (`npm run lint`)
- [ ] **Types**: TypeScript compiles without errors (`npm run typecheck`)
- [ ] **Build**: Project builds successfully (`npm run build`)
- [ ] **Documentation**: Updated relevant docs
- [ ] **Changelog**: Added entry if user-facing change
- [ ] **Commits**: Follow conventional commit format
- [ ] **Description**: Clear PR description with context

## 🎨 Code Style

We use minimal tooling to maintain code quality:

### TypeScript Configuration
- **Strict Mode**: Enabled for maximum type safety
- **No Any**: Avoid `any` types, use proper typing
- **Explicit Returns**: Be explicit about return types for public APIs

### Naming Conventions
- **Functions**: camelCase (`createRunner`, `useMetrics`)
- **Types**: PascalCase (`TestResult`, `RunnerConfig`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_TIMEOUT`)
- **Files**: kebab-case (`use-metrics.ts`, `test-context.ts`)

### Import Organization
```typescript
// 1. Node modules
import { describe, test } from 'vitest'

// 2. Internal types (type-only imports)
import type { Runner, TestResult } from './types.js'

// 3. Internal modules
import { createRunner } from './runner.js'
```

## 🚀 Release Process

Releases follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes (rare, with migration guide)
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes and improvements

### Release Workflow
1. Update version in `package.json`
2. Update `CHANGELOG.md` with new version
3. Create release PR
4. Merge to main after review
5. GitHub Actions handles NPM publication

## 🤝 Community Guidelines

### Code of Conduct
- **Be Respectful**: Treat everyone with respect
- **Be Constructive**: Focus on improving the project
- **Be Patient**: Remember that everyone is learning
- **Be Inclusive**: Welcome contributors of all backgrounds

### Getting Help
- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and community chat
- **Documentation**: Check README.md and API.md first

### Recognition
Contributors are recognized in:
- **CHANGELOG.md**: Notable contributions mentioned
- **README.md**: Contributors section
- **GitHub**: Contributor graphs and statistics

## 📚 Learning Resources

### Understanding the Codebase
- **Architecture**: Vue composition-style plugins with functional core
- **Minimalism**: Less code, better performance, simpler APIs
- **Accessibility**: DOM-focused testing for a11y compliance

### Related Technologies
- **TypeScript**: [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- **Vitest**: [Vitest Documentation](https://vitest.dev/)
- **Accessibility**: [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 💖 Thank You

Every contribution helps make accessibility testing better for everyone. Whether it's:
- 🐛 **Bug reports** - Help us find and fix issues
- 💡 **Feature ideas** - Shape the future of the library
- 📝 **Documentation** - Make it easier for others to contribute
- 🧪 **Tests** - Improve reliability and coverage
- 🔧 **Code** - Add features and fix bugs

Your efforts are appreciated by the entire accessibility community!

---

**Questions?** Feel free to open an issue or start a discussion. We're here to help! 🚀
