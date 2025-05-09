# tim52.io - Personal Website

A modern, parallax-rich personal website built with Next.js 15.3 and React 19.

## 🌟 Overview

This is Tim Arnold's personal website, featuring a playful and visually engaging design with parallax scrolling effects, staggered animations, and responsive navigation. The site showcases Tim's personality through quirky content about himself, his family, and his background in web development.

## ✨ Features

- **Parallax Scrolling Effects**: Multi-directional parallax sections and elements create depth and visual interest
- **Responsive Design**: Mobile-friendly navigation with hamburger menu
- **Staggered Animations**: Elements appear with staggered timing as they enter the viewport
- **SCSS Modules**: Organized styles with SCSS modules for component-specific styling
- **Next.js App Router**: Uses the modern App Router architecture from Next.js
- **React 19**: Takes advantage of the latest React features

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
   npm run dev:sass
   ```

This will start the Next.js development server with Turbopack and the SASS watcher in parallel.
Open http://localhost:3000 with your browser to see the result.

📦 Scripts

Run the dev server (includes sass watching)
```bash
npm run dev
```
Run a production-ready build
```bash
npm run build
```
Start up a server and run that production-ready build
```bash
npm run start
```
Take a deep dive into linting errors 
```bash
npm run lint
```

🧩 Project Structure

```
tim52next/
├── public/              # Static assets
│   └── images/          # Image files
├── src/
│   ├── app/             # Next.js App Router pages
│   ├── components/      # React components
│   │   ├── Navigation.tsx          # Responsive navigation
│   │   ├── ParallaxSection.tsx     # Container for parallax sections
│   │   ├── ParallaxElement.tsx     # Individual parallax elements
│   │   └── StaggeredFeatures.tsx   # Staggered animation container
│   ├── contexts/        # React contexts (if needed)
│   └── styles/          # SCSS styles
│       ├── components/  # Component-specific styles
│       └── globals/     # Global styles
```

🧪 Technologies Used

- Next.js 15.3.1: React framework with App Router
- React 19.0.0: UI library
- TypeScript: Type-safe code
- SASS: CSS preprocessing
- Turbopack: Fast development experience
- ESLint: Code linting

🖼️ Page Sections

- Hero: Featuring a cow image from County Kerry, Ireland
-  Hello: An introduction to Tim with a playful tone
-  I am a Cactus: Information about Tim's life and family
-  Where to Find Me: Links to Tim's various online presences

🚀 Deployment

This site is intended to be deployed on Cloudflare Pages. Simply push the 'cow' branch to GitHub and it will deploy.