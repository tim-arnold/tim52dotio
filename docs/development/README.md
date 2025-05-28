# Development Documentation

This section contains all development-related documentation for the tim52next project, including guides, decisions, and time analyses.

## Contents

### [Decisions](./decisions/)
Technical Decision Records (ADRs) documenting important architectural and implementation choices made during development.

### [Guides](./guides/)
Development guides and best practices for working with the tim52next codebase.

### [Time Analyses](./time-analyses/)
Studies of development time and effort for various features and improvements.

## Development Workflow

### Getting Started
1. **Prerequisites**: Node.js 18+, npm
2. **Installation**: `npm install`
3. **Development**: `npm run dev` (uses Turbopack)
4. **Building**: `npm run build` (static export)
5. **Linting**: `npm run lint`

### Code Standards

- **TypeScript**: Strict mode enabled, full type coverage required
- **ESLint**: Configured with Next.js and accessibility rules
- **SCSS**: Modular approach with BEM-like naming conventions
- **Testing**: Jest for unit tests, Playwright for E2E

### Branch Strategy

- **Main Branch**: `cow` (production deployment branch)
- **Feature Branches**: Short-lived branches for specific features
- **Deployment**: Automatic via Cloudflare Pages on push to `cow`

### Component Development

1. **Create Component**: In `src/components/` with TypeScript
2. **Add Styles**: SCSS module in `src/styles/components/`
3. **Write Tests**: Jest test in `__tests__/` directory
4. **Document**: Add to relevant documentation sections

### Performance Guidelines

- Minimize JavaScript bundle size
- Use `'use client'` sparingly for interactivity
- Optimize images and static assets
- Leverage Next.js static optimization
- Test on multiple devices and screen sizes

## Development Environment

### Required Tools
- **Node.js**: v18+ for Next.js 15 compatibility
- **NPM**: Package management and script running
- **TypeScript**: Language server for development
- **ESLint**: Code quality and consistency

### Recommended Extensions
- TypeScript language support
- ESLint integration
- SCSS/CSS language support
- Auto-formatting on save

### Build Process
1. **Development**: Hot reload with Turbopack
2. **Production**: Static export to `/out` directory
3. **Deployment**: Cloudflare Pages automatic deployment
4. **Testing**: Automated testing in CI/CD pipeline