# Sanity CMS Setup Guide

Complete guide for setting up and managing content in Sanity.io for this Next.js site.

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Starting Sanity Studio](#starting-sanity-studio)
3. [Understanding Content Types](#understanding-content-types)
4. [Adding Your First Content](#adding-your-first-content)
5. [Connecting Components](#connecting-components)
6. [Building and Deploying](#building-and-deploying)
7. [Troubleshooting](#troubleshooting)

## Initial Setup

### Prerequisites

- Sanity.io account created (✓ Already done!)
- Project already initialized with ID: `gwofhlpz`
- Environment variables configured in `.env.local`

### Verify Your Setup

Check that you have the following in your `.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=gwofhlpz
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-11-25
```

## Starting Sanity Studio

Sanity Studio is your content management interface. It runs locally and connects to your Sanity.io cloud project.

### Start the Studio Locally

```bash
npm run sanity
```

This will:
- Start Sanity Studio at `http://localhost:3333`
- Prompt you to log in (if not already authenticated)
- Open the Studio in your browser

### First-Time Login

When you first run the Studio, you'll need to authenticate:

1. The browser will open to `http://localhost:3333`
2. Click "Login" or you'll be redirected to Sanity.io
3. Sign in with your Sanity account
4. You'll be redirected back to the Studio

## Understanding Content Types

This project has 4 content types (schemas):

### 1. Portfolio Project

Displays your portfolio work on the `/portfolio` page.

**Fields:**
- **Title**: Project name (e.g., "Acme Corp Website")
- **Slug**: Auto-generated URL-friendly name
- **URL**: Link to the live project
- **Screenshot**: Project image with alt text
- **Screenshot Position**: CSS positioning (e.g., "top center")
- **Description**: Project overview
- **Role**: Your roles (Full Stack, Design, etc.)
- **Technologies**: Tech stack (React, Node.js, etc.)
- **Company/Agency**: Who you worked with
- **Display Order**: Sort order (0 appears first)

### 2. Service Card

Displays your services on the `/services` page.

**Fields:**
- **Title**: Service name (e.g., "Full Stack Development")
- **Slug**: Auto-generated URL-friendly name
- **Bullet Points**: List of service offerings
- **Tagline**: Italic text at bottom of card
- **Display Order**: Sort order (0 appears first)

### 3. Feature Card

Displays feature highlights on the homepage "Reality Gnaws" section.

**Fields:**
- **Title**: Internal reference (optional)
- **Main Text**: Primary content
- **Italic Text**: Emphasized content
- **Display Order**: Sort order (0 appears first)

### 4. Page Content

Flexible content for various page sections (hero, about, etc.).

**Fields:**
- **Page**: Which page (home, services)
- **Section**: Section identifier (hero, about, contact)
- **Heading**: Main heading
- **Subheading**: Secondary heading
- **Content**: Rich text with formatting

## Adding Your First Content

### Example: Adding a Portfolio Project

1. **Start Sanity Studio**: `npm run sanity`

2. **Navigate to Portfolio Projects**:
   - In the Studio sidebar, click "Portfolio Project"
   - Click the "+" button or "Create new"

3. **Fill in the Fields**:
   ```
   Title: My Awesome Project
   URL: https://example.com
   Screenshot: [Upload an image]
   Screenshot Alt Text: Screenshot of My Awesome Project homepage
   Screenshot Position: top center
   Description: A cutting-edge web application built for...
   Role: [Select] Full Stack, Design
   Technologies: [Type and add] React, Next.js, TypeScript, Node.js
   Company/Agency: Acme Digital
   Display Order: 0
   ```

4. **Generate Slug**:
   - Click "Generate" next to the Slug field
   - It will create: `my-awesome-project`

5. **Publish**:
   - Click "Publish" in the bottom right
   - Your content is now live in Sanity!

### Quick Tips

- **Display Order**: Start at 0 for your first item, 1 for second, etc.
- **Images**: Upload high-quality screenshots (will be optimized at build time)
- **Alt Text**: Be descriptive for accessibility and SEO
- **Technologies**: Hit Enter after typing each tech to add it to the array
- **Save Drafts**: Studio auto-saves, but click "Publish" to make it live

## Connecting Components

Currently, your Next.js components use hardcoded data. You'll need to connect them to Sanity.

### Finding Components to Update

Common locations for hardcoded data:
- `src/app/page.tsx` - Homepage
- `src/app/portfolio/page.tsx` - Portfolio page
- `src/app/services/page.tsx` - Services page
- `src/components/**/*.tsx` - Various components

### Example: Updating a Page Component

**Before (hardcoded):**
```tsx
export default function PortfolioPage() {
  const projects = [
    { title: "Project 1", url: "...", ... },
    { title: "Project 2", url: "...", ... },
  ]

  return <div>{projects.map(...)}</div>
}
```

**After (Sanity):**
```tsx
import { getProjects } from '@/lib/sanity.queries'

export default async function PortfolioPage() {
  const projects = await getProjects()

  return <div>{projects.map(...)}</div>
}
```

### Available Query Functions

Import from `@/lib/sanity.queries`:

```tsx
import {
  getProjects,        // Get all portfolio projects
  getServiceCards,    // Get all service cards
  getFeatureCards,    // Get all feature cards
  getPageContent,     // Get specific page section
  getAllPageContent,  // Get all sections for a page
} from '@/lib/sanity.queries'
```

### TypeScript Types

All types are exported from `@/lib/sanity.queries`:

```tsx
import type {
  Project,
  ServiceCard,
  FeatureCard,
  PageContent
} from '@/lib/sanity.queries'
```

## Building and Deploying

### Local Development Workflow

1. **Update content in Sanity Studio**:
   ```bash
   npm run sanity
   # Make changes in Studio at localhost:3333
   ```

2. **Rebuild your Next.js site**:
   ```bash
   npm run build
   ```
   This fetches all content from Sanity and bakes it into static HTML

3. **Preview the production build**:
   ```bash
   npm run start
   # Opens at localhost:3000 (or another port)
   ```

### How Content is Fetched

This is a **statically exported** Next.js site, which means:

- Content is fetched **at build time**, not at runtime
- All Sanity queries run during `npm run build`
- The `/out` directory contains static HTML with your content
- To see content changes, you must rebuild the site

### Deployment to Cloudflare Pages

When you push to the `cow` branch:

1. Cloudflare Pages runs `npm run build`
2. Build process fetches latest content from Sanity
3. Static HTML is generated with your content
4. Site is deployed with updated content

**To update deployed content:**
1. Make changes in Sanity Studio
2. Trigger a rebuild in Cloudflare Pages (or push any commit)

## Advanced Features

### Deploying Sanity Studio to Production

You can host your Studio on Sanity's servers:

```bash
npm run sanity:deploy
```

This creates a URL like: `https://tim52io.sanity.studio`

Benefits:
- Edit content from anywhere
- No need to run Studio locally
- Share with team members

### Managing Your Sanity Project

Open the Sanity dashboard:

```bash
npm run sanity:manage
```

Or visit: https://www.sanity.io/manage/personal/project/gwofhlpz

In the dashboard you can:
- Manage team members
- View API usage
- Configure CORS origins
- Set up webhooks
- View content history

### Using Vision Tool (GROQ Playground)

The Vision plugin is already installed. In Sanity Studio:

1. Click the "Vision" tab (looks like an eye icon)
2. Write GROQ queries to test them:
   ```groq
   *[_type == "project"] | order(order asc) {
     title,
     url,
     company
   }
   ```
3. See results instantly

This is great for testing queries before adding them to your code.

### Adding a Read Token (Optional)

If you want to access draft/unpublished content:

1. Go to https://www.sanity.io/manage/personal/project/gwofhlpz/api
2. Create a new token with "Read" permissions
3. Add to `.env.local`:
   ```env
   SANITY_API_READ_TOKEN=your-token-here
   ```

**Note**: For static export, you typically only need published content.

### Rich Text Content

The `pageContent` type includes rich text (Portable Text). To render it in React:

```tsx
import { PortableText } from '@portabletext/react'
import { getAllPageContent } from '@/lib/sanity.queries'

export default async function Page() {
  const content = await getAllPageContent('home')
  const heroSection = content.find(c => c.section === 'hero')

  return (
    <div>
      <h1>{heroSection?.heading}</h1>
      {heroSection?.content && (
        <PortableText value={heroSection.content} />
      )}
    </div>
  )
}
```

You'll need to install `@portabletext/react` if not already installed.

## Troubleshooting

### Studio won't start

**Error**: "Command not found: sanity"

**Solution**:
```bash
npm install
```

### Can't login to Studio

**Error**: Authentication loop or 403 errors

**Solution**:
1. Make sure you're logged into the correct Sanity account at https://sanity.io
2. Try logging out and back in:
   ```bash
   npx sanity logout
   npx sanity login
   ```

### Content not showing on site

**Problem**: Updated content in Studio but don't see changes on the site

**Solution**:
- Remember this is a static site - you need to rebuild:
  ```bash
  npm run build
  npm run start
  ```

### Type errors with Sanity queries

**Error**: TypeScript errors when using query results

**Solution**: Check that your component props match the TypeScript interfaces in `src/lib/sanity.queries.ts`

### Image URLs not working

**Problem**: Images show broken links

**Solution**: Use the `urlFor()` helper:
```tsx
import { urlFor } from '@/lib/sanity.client'

// In your component:
<img src={urlFor(project.screenshot).width(800).url()} alt={project.screenshot.alt} />
```

### CORS errors

**Problem**: CORS errors in browser console

**Solution**: Add your domain to CORS origins:
1. Visit https://www.sanity.io/manage/personal/project/gwofhlpz/api
2. Add your domain under "CORS Origins"
3. For local dev, add `http://localhost:3000`

## Next Steps

1. **Add Test Content**: Create 2-3 portfolio projects to test
2. **Update Components**: Connect one component to Sanity as a proof of concept
3. **Test Build**: Run `npm run build` and verify content appears
4. **Deploy Studio**: Run `npm run sanity:deploy` for easy access
5. **Migrate All Content**: Move all hardcoded data to Sanity

## Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Next.js with Sanity](https://www.sanity.io/docs/nextjs)
- [Vision Tool Guide](https://www.sanity.io/docs/the-vision-plugin)
- Project Schemas: `sanity/schemas/`
- Query Functions: `src/lib/sanity.queries.ts`
- Client Config: `src/lib/sanity.client.ts`