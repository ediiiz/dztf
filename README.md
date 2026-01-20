# Ediz Tefenlilioglu | AI Systems Engineer - Personal CV & Blog

A high-performance personal website featuring an architectural CV and a technical blog.

## Design System
"Swiss Brutalism" / Architectural Agency style.

## Tech Stack
- **Svelte 5** (Runes, Snippets) - Modern reactive framework
- **SvelteKit** - Full-stack web framework
- **Threlte** - Three.js for Svelte (3D Background)
- **TailwindCSS** - Utility-first CSS
- **Lucide Svelte** - Icon library
- **Turborepo** - Optimized monorepo build system
- **Bun** - Fast JavaScript runtime and package manager

## Key Features
- **Abstract Geometric 3D Background**: Interactive 3D elements powered by Threlte.
- **Multi-language Support**: English, German, and Turkish translations.
- **Markdown-based Blog**: Technical blog system using Markdown files.
- **PDF-optimized CV**: Print styles specifically designed for high-quality PDF export.

## Project Structure
- `apps/web`: The main SvelteKit application.
- `apps/web/src/lib/content/blog`: Markdown files for blog posts.
- `apps/web/src/lib/data/translations.ts`: Multi-language data and translation keys.

## Getting Started

First, install the dependencies:

```bash
bun install
```

Then, run the development server:

```bash
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to see the web application.

## Available Scripts

- `bun run dev`: Start all applications in development mode
- `bun run build`: Build all applications
- `bun run dev:web`: Start only the web application
- `bun run check-types`: Check TypeScript types across all apps
- `bun run check`: Run formatting and linting

## Git Hooks and Formatting

- Initialize hooks: `bun run prepare`
- Format and lint fix: `bun run check`
