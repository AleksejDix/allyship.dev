# Allyship.dev Project Documentation

## Project Overview

Allyship.dev is a monorepo project built with Next.js, using Turborepo for build system orchestration and pnpm for package management. The project follows modern best practices for TypeScript, React, and accessibility.

## Repository Structure

```
allyship.dev/
├── .cursor/              # Cursor AI rules and configurations
├── .turbo/              # Turborepo cache and build artifacts
├── .vscode/             # VS Code editor configurations
├── apps/                # Application packages
│   ├── allystudio/     # Main studio application
│   └── allyship/       # Main website application
├── packages/            # Shared packages
│   ├── eslint-config/  # Shared ESLint configurations
│   ├── tailwind-config/# Shared Tailwind CSS configurations
│   ├── typescript-config/ # Shared TypeScript configurations
│   └── ui/             # Shared UI component library
└── node_modules/       # Project dependencies

```

## Key Configuration Files

- `.editorconfig` - Editor configuration for consistent coding styles
- `.eslintrc.js` - ESLint configuration for code linting
- `.npmrc` - NPM/PNPM configuration
- `.gitignore` - Git ignore patterns
- `package.json` - Project metadata and scripts
- `pnpm-workspace.yaml` - PNPM workspace configuration
- `prettier.config.js` - Code formatting configuration
- `turbo.json` - Turborepo configuration
- `vercel.json` - Vercel deployment configuration

## Development Guidelines

### Package Management

- Use pnpm for package management
- Version: pnpm@9.12.3
- Node.js version requirement: >=20

### Monorepo Structure

1. **Apps Directory (`/apps`)**

   - Contains deployable applications
   - Each app is a standalone Next.js project
   - Apps can share code via workspace packages

2. **Packages Directory (`/packages`)**
   - Contains shared code and configurations
   - Packages are referenced using workspace protocol
   - Follows consistent naming and versioning

### Build System

Turborepo is used for build orchestration with the following key tasks:

- `build`: Build all packages and applications
- `dev`: Start development servers
- `lint`: Run linting across the project
- `test`: Run tests
- `clean`: Clean build artifacts
- `check-types`: TypeScript type checking
- `format`: Code formatting
- `deploy`: Production deployment pipeline

### Environment Variables

Global environment variables are managed in `turbo.json`:

- `NODE_ENV`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL`
- `DIRECT_URL`
- `NEXTAUTH_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`

### Code Style

1. **TypeScript**

   - Strict mode enabled
   - Shared base configuration in `packages/typescript-config`

2. **ESLint**

   - Shared configurations in `packages/eslint-config`
   - Integration with TypeScript
   - React-specific rules

3. **Prettier**
   - Max line length: 100 characters
   - Sorted imports
   - Consistent quote style
   - Tailwind CSS class sorting

### UI Development

1. **Component Library**

   - Shared components in `packages/ui`
   - Consistent styling with Tailwind CSS
   - Accessibility-first approach

2. **Tailwind CSS**
   - Shared configuration in `packages/tailwind-config`
   - Consistent design tokens
   - Responsive design utilities

## Cursor AI Rules

Rules for Cursor AI are stored in `.cursor/rules/` and follow these categories:

1. **Project Structure Rules**

   - Monorepo organization
   - Package naming conventions
   - File location guidelines

2. **Code Style Rules**

   - TypeScript patterns
   - React component structure
   - State management approaches

3. **Testing Rules**

   - Test file organization
   - Testing patterns and practices
   - Coverage requirements

4. **Documentation Rules**

   - JSDoc requirements
   - README standards
   - API documentation

5. **Performance Rules**

   - Bundle size guidelines
   - Code splitting practices
   - Optimization techniques

6. **Accessibility Rules**

   - ARIA usage patterns
   - Keyboard navigation
   - Screen reader compatibility

7. **Security Rules**
   - Authentication patterns
   - Data validation
   - API security

## Deployment

The project is configured for deployment on Vercel:

- Production deployments triggered on main branch
- Preview deployments for pull requests
- Environment variable management
- Build caching and optimization

## Contributing

1. Branch naming convention: `feature/`, `fix/`, `docs/`, etc.
2. Commit message format follows conventional commits
3. Pull requests require:
   - Type checking
   - Linting
   - Tests
   - Documentation updates

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Turborepo Handbook](https://turbo.build/repo/docs)
- [pnpm Documentation](https://pnpm.io/documentation)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
