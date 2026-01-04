# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application using React 19, TypeScript, and Tailwind CSS v4. The project uses the App Router architecture with file-based routing in the `app/` directory.

## Development Commands

- **Start development server**: `npm run dev` (runs on http://localhost:3000)
- **Build for production**: `npm run build`
- **Start production server**: `npm start`
- **Lint code**: `npm run lint`

## Tech Stack & Versions

- **Next.js**: 16.1.1 (App Router)
- **React**: 19.2.3
- **TypeScript**: 5.x with strict mode enabled
- **Tailwind CSS**: v4 (using @tailwindcss/postcss)
- **Node.js**: Target ES2017
- **ESLint**: Uses eslint-config-next with TypeScript and Core Web Vitals configs

## Architecture

### Directory Structure

- `app/` - Next.js App Router directory
  - `layout.tsx` - Root layout with font configuration (Geist Sans and Geist Mono)
  - `page.tsx` - Home page component
  - `globals.css` - Global styles with Tailwind directives
- `public/` - Static assets (SVGs, images)
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration with path aliases (`@/*` maps to root)

### Key Configuration Details

- **Path aliases**: Use `@/` to import from the project root (e.g., `@/app/components`)
- **Font optimization**: Uses `next/font/google` for Geist fonts with CSS variables
- **Dark mode**: Built-in dark mode support using Tailwind's `dark:` prefix
- **TypeScript**: Strict mode enabled with incremental compilation
- **PostCSS**: Configured with Tailwind CSS v4 plugin

### Styling Approach

- **Tailwind CSS v4**: Utility-first CSS framework
- **Dark mode**: Uses class-based dark mode (`dark:` variants)
- **Design tokens**: CSS custom properties for fonts (`--font-geist-sans`, `--font-geist-mono`)
- **Responsive design**: Mobile-first approach with `sm:` breakpoints

## Component Patterns

- **Server Components**: Default in Next.js App Router (no `'use client'` directive needed)
- **Layouts**: Root layout wraps all pages with fonts and global styles
- **Images**: Use Next.js `Image` component for optimization
- **Metadata**: Defined in layout files using the Metadata API

## Important Notes

- All `.tsx` and `.ts` files are included in TypeScript compilation
- The project uses JSX transform (`react-jsx`) - no need to import React explicitly
- ESLint extends Next.js recommended configs for TypeScript and Core Web Vitals
- PostCSS is configured for Tailwind CSS v4 processing
