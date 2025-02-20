# Allyship.dev Development Rules

## Core Patterns

### 1. Application Architecture

- `architecture/`
  - `monorepo.md` - Monorepo structure and management
  - `next/` - Next.js application architecture
  - `plasmo/` - Chrome extension architecture
  - `packages/` - Shared package architecture

### 2. Data Layer

- `data/`
  - `supabase/` - Supabase integration patterns
    - `auth.md` - Authentication patterns
    - `database.md` - Database access patterns
    - `rls.md` - Row Level Security policies
    - `edge-functions.md` - Edge function patterns
  - `api/` - API design patterns
    - `routes.md` - API route patterns
    - `handlers.md` - Request handler patterns
    - `validation.md` - Input validation patterns
  - `state/` - State management
    - `server.md` - Server state patterns
    - `client.md` - Client state patterns
    - `forms.md` - Form state management

### 3. UI Patterns

- `ui/`
  - `components/` - Component patterns
    - `server.md` - Server component patterns
    - `client.md` - Client component patterns
    - `forms/` - Form component patterns
  - `layouts/` - Layout patterns
  - `styles/` - Styling patterns
    - `tailwind.md` - Tailwind usage patterns
    - `css.md` - CSS patterns
  - `animations/` - Animation patterns

### 4. Feature Patterns

- `features/`
  - `auth/` - Authentication feature
  - `curriculum/` - Curriculum feature
  - `assessment/` - Assessment feature
  - `dashboard/` - Dashboard feature

## Quality Standards

### 1. Testing

- `testing/`
  - `unit.md` - Unit testing patterns
  - `integration.md` - Integration testing patterns
  - `e2e.md` - End-to-end testing patterns
  - `component.md` - Component testing patterns

### 2. Performance

- `performance/`
  - `metrics.md` - Performance metrics
  - `optimization.md` - Optimization techniques
  - `monitoring.md` - Performance monitoring

### 3. Accessibility

- `accessibility/`
  - `aria.md` - ARIA usage patterns
  - `keyboard.md` - Keyboard navigation
  - `semantics.md` - Semantic HTML patterns

### 4. Security

- `security/`
  - `auth.md` - Authentication security
  - `data.md` - Data security
  - `api.md` - API security
  - `csrf.md` - CSRF protection

## Development Workflow

### 1. Code Quality

- `code-quality/`
  - `typescript.md` - TypeScript patterns
  - `eslint.md` - ESLint rules
  - `prettier.md` - Prettier configuration
  - `naming.md` - Naming conventions

### 2. Documentation

- `documentation/`
  - `components.md` - Component documentation
  - `api.md` - API documentation
  - `types.md` - Type documentation
  - `readme.md` - README standards

### 3. Git Workflow

- `git/`
  - `branching.md` - Branch management
  - `commits.md` - Commit message standards
  - `pr.md` - Pull request guidelines
  - `reviews.md` - Code review guidelines

### 4. DevOps

- `devops/`
  - `ci.md` - CI/CD patterns
  - `deployment.md` - Deployment patterns
  - `monitoring.md` - Application monitoring
  - `logging.md` - Logging standards

## Cross-Cutting Concerns

### 1. Internationalization

- `i18n/`
  - `translation.md` - Translation patterns
  - `formatting.md` - Date/number formatting
  - `rtl.md` - RTL support

### 2. SEO

- `seo/`
  - `metadata.md` - Metadata patterns
  - `schema.md` - Schema markup
  - `sitemap.md` - Sitemap generation

### 3. Error Handling

- `errors/`
  - `boundaries.md` - Error boundary patterns
  - `handling.md` - Error handling patterns
  - `logging.md` - Error logging patterns

### 4. Monitoring

- `monitoring/`
  - `analytics.md` - Analytics integration
  - `logging.md` - Application logging
  - `tracing.md` - Request tracing
  - `alerts.md` - Alert configuration

## Usage Guidelines

1. **Rule Precedence**

   - Framework-specific rules override general rules
   - Feature-specific patterns override general patterns
   - Security rules cannot be overridden

2. **Rule Updates**

   - Rules should be reviewed quarterly
   - Updates require team consensus
   - Breaking changes require migration guide

3. **Rule References**

   - Use relative links between related rules
   - Include examples for complex patterns
   - Reference external documentation when needed

4. **Rule Validation**
   - ESLint rules enforce code patterns
   - Husky hooks enforce git patterns
   - CI/CD validates rule compliance
