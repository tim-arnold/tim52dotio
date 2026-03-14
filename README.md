# tim52.io - Personal Website

A modern, parallax-rich personal website built with Next.js 15.3 and React 19.

## 🌟 Overview

This is Tim Arnold's personal website, featuring a playful and visually engaging design with parallax scrolling effects, staggered animations, and responsive navigation. The site showcases Tim's personality through quirky content about himself, his family, and his background in web development.

## 🚀 Getting Started

First, make sure you have [Node.js](https://nodejs.org) installed (v18 or newer recommended).

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/tim52next.git
   cd tim52next
   ```

2. Install dependencies
   ```bash
   npm install
   ```
3. Run the development server
```bash
   npm run dev
   ```

This will start the Next.js development server with Turbopack and the SASS watcher in parallel.
Open http://localhost:3000 with your browser to see the result.

## 📦 Scripts

### Development
```bash
# Run the dev server (basic Next.js)
npm run dev

# Run with AI features (Cloudflare Pages Functions)
npm run build && npx wrangler pages dev out

# Run Sanity Studio (CMS)
npm run sanity
```

> **Note:** The standard `npm run dev` won't connect to the AI chat and fit assessment features since they use Cloudflare Pages Functions. Use the wrangler command above to test AI functionality locally.

### Build & Deploy
```bash
# Run a production-ready build
npm run build

# Start up a server and run that production-ready build
npm run start
```

### Content Management (Sanity)
```bash
# Start Sanity Studio locally
npm run sanity

# Deploy Sanity Studio to cloud
npm run sanity:deploy

# Open Sanity management dashboard
npm run sanity:manage
```

### Testing & Quality
```bash
# Lint the codebase
npm run lint

# Run unit tests
npm test

# Run E2E tests
npm run test:e2e
```

## 📚 Documentation

For comprehensive project documentation, including architecture details, development guides, and planning documents, see the [docs/](docs/) directory.

## 🧪 Technologies Used

- **Next.js 15.3.1**: React framework with App Router and static export
- **React 19.0.0**: UI library with latest features
- **TypeScript**: Type-safe development
- **SCSS Modules**: Component-scoped styling
- **Sanity CMS**: Headless CMS for content management
- **Turbopack**: Fast development experience
- **ESLint**: Code quality and consistency

🖼️ Page Sections

- Hero: Featuring a cow image from County Kerry, Ireland
-  Hello: An introduction to Tim with a playful tone
-  I am a Cactus: Information about Tim's life and family
-  Where to Find Me: Links to Tim's various online presences

## 🎨 Content Management

This site uses [Sanity.io](https://sanity.io) as a headless CMS for managing portfolio projects, service offerings, and page content.

### Getting Started with Sanity

1. **Start Sanity Studio locally**:
   ```bash
   npm run sanity
   ```
   Opens at http://localhost:3333

2. **Access deployed Studio**:
   Visit your deployed studio URL (run `npm run sanity:deploy` to get the URL)

3. **Manage content**:
   - Portfolio Projects: Add your project work
   - Service Cards: Define your service offerings
   - Feature Cards: Homepage feature highlights
   - Page Content: Flexible content for various sections

For detailed Sanity setup instructions, see the [Sanity CMS Setup Guide](docs/development/guides/sanity-cms-setup.md).

## 🚀 Deployment

This site is deployed on **Cloudflare Pages** with static export.

### Deployment Flow

1. Push code to the `production` branch
2. Cloudflare Pages automatically builds the site (`npm run build`)
3. During build, content is fetched from Sanity CMS
4. Static HTML is generated and deployed to CDN

### Environment Variables

Add these to Cloudflare Pages environment variables:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=gwofhlpz
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-11-25
```

### Updating Content

Since this is a static site, content updates require a rebuild:
- **Option 1**: Push any commit to trigger rebuild
- **Option 2**: Manually trigger rebuild in Cloudflare Pages dashboard