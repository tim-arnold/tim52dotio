# Tim52Next Documentation

This directory contains comprehensive documentation for the tim52next project - a Next.js 15.3 static site with parallax effects and interactive features.

## Documentation Structure

```
docs/
├── README.md                          # This file - documentation overview
├── architecture/
│   └── README.md                      # System architecture and technical design
├── development/
│   ├── README.md                      # Development documentation overview
│   ├── decisions/
│   │   └── README.md                  # Technical Decision Records (ADRs)
│   ├── guides/
│   │   └── README.md                  # Development guides and best practices
│   └── time-analyses/
│       └── README.md                  # Feature development time studies
├── planning/
│   └── README.md                      # Project planning and roadmap documentation
└── retrospectives/
    └── README.md                      # Post-implementation reviews and lessons learned
```

## Project Overview

Tim52Next is a modern static website built with:
- **Next.js 15.3** with static export configuration
- **TypeScript** for type safety
- **SCSS Modules** for component styling
- **Custom parallax effects** and interactive animations
- **Cloudflare Pages** deployment target

## Key Features

- **Parallax Scrolling**: Custom ParallaxSection and ParallaxElement components
- **Staggered Animations**: StaggeredFeatures component for sequential reveals
- **Accessible Navigation**: Fully ARIA-compliant hamburger menu
- **Performance Optimized**: Static export with Turbopack development
- **Mobile Responsive**: Adaptive design across all devices

## Quick Start

For development setup and commands, see the main [README.md](../README.md) in the project root.

## Documentation Philosophy

This documentation follows a structured approach:
- **Architecture**: Technical design and system overview
- **Development**: Day-to-day development guidance and decisions
- **Planning**: Forward-looking project planning and roadmaps
- **Retrospectives**: Historical analysis and lessons learned

Each section contains detailed README files explaining the purpose and contents of that documentation category.