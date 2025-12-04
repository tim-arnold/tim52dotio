# Sanity CMS Setup

This project uses Sanity.io as a headless CMS to manage content.

## Project Details

- **Project ID**: `gwofhlpz`
- **Dataset**: `production`
- **API Version**: `2025-11-25`

## Getting Started

### Run Sanity Studio Locally

```bash
npm run sanity
```

This will start the Sanity Studio at `http://localhost:3333`

### Other Sanity Commands

```bash
# Deploy the studio to Sanity's hosted platform
npm run sanity:deploy

# Open the Sanity manage dashboard
npm run sanity:manage
```

## Content Types

### Portfolio Projects (`project`)
Portfolio projects displayed on `/portfolio` page.

**Fields:**
- Title
- Slug (auto-generated)
- URL (project link)
- Screenshot (image)
- Screenshot Position (CSS object-position)
- Description
- Role (array of roles)
- Technologies (array)
- Company/Agency
- Display Order

### Service Cards (`serviceCard`)
Service offerings displayed on `/services` page.

**Fields:**
- Title
- Slug (auto-generated)
- Bullet Points (array)
- Tagline (italic text)
- Display Order

### Feature Cards (`featureCard`)
Feature cards displayed on the homepage "Reality Gnaws" section.

**Fields:**
- Title (optional, for internal reference)
- Main Text
- Italic Text
- Display Order

### Page Content (`pageContent`)
Flexible content for page sections (hero, about, etc.).

**Fields:**
- Page (home, services)
- Section (hero, about, contact, etc.)
- Heading
- Subheading
- Content (rich text)

## How Content is Fetched

Content is fetched at **build time** for static export using:

- **Client**: `src/lib/sanity.client.ts`
- **Queries**: `src/lib/sanity.queries.ts`

The site is statically exported, so all content is fetched during `npm run build` and baked into the HTML.

## Environment Variables

Required environment variables (already in `.env.local`):

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=gwofhlpz
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-11-25
```

## Next Steps

1. Start Sanity Studio: `npm run sanity`
2. Add your first project in the Studio
3. Update components to fetch from Sanity instead of hardcoded data
4. Rebuild the site: `npm run build`