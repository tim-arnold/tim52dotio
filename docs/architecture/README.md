# Architecture Documentation

This section contains documentation about the technical architecture and design decisions for the tim52next project.

## System Overview

Tim52next is built as a **static Next.js application** optimized for **Cloudflare Pages** deployment. The architecture emphasizes performance, accessibility, and maintainability.

### Technology Stack

- **Framework**: Next.js 15.3 with static export (`output: 'export'`)
- **Language**: TypeScript with strict type checking
- **Styling**: SCSS Modules with CSS custom properties
- **Build Tool**: Turbopack for development, standard Next.js build for production
- **Deployment**: Cloudflare Pages (static hosting)
- **Testing**: Jest with React Testing Library, Playwright for E2E

### Key Architectural Decisions

1. **Static Export Configuration**
   - Enables deployment to any static hosting provider
   - Removes server-side dependencies
   - Optimizes for CDN distribution

2. **Component-Based Architecture**
   - Modular components with isolated styling
   - Clear separation of concerns
   - Reusable interactive elements

3. **Client-Side Interactivity**
   - `'use client'` directive for interactive components
   - Custom hooks for scroll handling and animations
   - Performance-optimized event listeners

## Component Architecture

### Core Components

- **ParallaxSection**: Container for parallax scrolling effects
- **ParallaxElement**: Individual animated elements within parallax sections
- **StaggeredFeatures**: Sequential animation container
- **Navigation**: Accessible hamburger menu with keyboard support

### Styling Strategy

- **SCSS Modules**: Component-scoped styles in `src/styles/components/`
- **Global Styles**: Site-wide styles in `src/styles/globals/`
- **CSS Custom Properties**: Theme variables and dynamic values
- **Mobile-First**: Responsive design with progressive enhancement

## Performance Considerations

- **Static Generation**: All pages pre-built at compile time
- **Image Optimization**: Disabled for static export compatibility
- **Code Splitting**: Automatic with Next.js dynamic imports
- **CSS Optimization**: Modular approach prevents style conflicts

## File Structure

```
src/
├── app/                   # Next.js App Router pages
├── components/            # Reusable React components
├── hooks/                 # Custom React hooks
├── styles/               # SCSS modules and global styles
└── utils/                # Utility functions
```

## Future Architecture Considerations

- Potential migration to App Router streaming
- Progressive Web App (PWA) capabilities
- Enhanced animation libraries integration
- Component library extraction for reuse