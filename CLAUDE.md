
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack (note: README mentions dev:sass but package.json has just dev)
- `npm run build` - Build for production (static export)
- `npm run start` - Serve production build using serve
- `npm run lint` - Run ESLint

## Architecture

This is a Next.js 15.3 static site (output: 'export') built for Cloudflare Pages deployment. Key architectural patterns:

### Component Structure
- **ParallaxSection**: Container component that handles both vertical and horizontal parallax scrolling effects based on scroll position
- **ParallaxElement**: Individual elements with configurable rotation and movement within parallax sections
- **StaggeredFeatures**: Animation container for elements that appear with staggered timing
- **Navigation**: Fully accessible hamburger menu with ARIA compliance, keyboard navigation, and scroll position detection

### Styling
- SCSS modules for component-specific styles located in `src/styles/components/`
- Global styles in `src/styles/globals/`
- Uses CSS custom properties for theming (Geist fonts)

### Key Features
- Static export configuration for Cloudflare Pages
- Images are unoptimized (required for static export)
- TypeScript paths configured with `@/*` alias pointing to `src/*`
- Client-side only components using 'use client' directive for interactivity

### Deployment
- Target branch: 'cow' (main deployment branch)
- Platform: Cloudflare Pages
- Build output: Static files in `/out` directory

## Documentation

Comprehensive project documentation is located in the `/docs` directory, including:
- Architecture details and technical design decisions
- Development guides and best practices
- Project planning and roadmaps
- Technical decision records (ADRs)
- Development time analyses and retrospectives