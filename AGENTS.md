# Kreebz Ltd

## Overview
A modern web application built with the Next.js App Router, providing a platform for property and real estate listings.

## Tech Stack
- **Framework:** Next.js 16.2.10
- **Frontend:** React 19.2.4 with TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Icons:** Lucide React

## Critical Agent Instructions
<!-- BEGIN:nextjs-agent-rules -->
**This is NOT the Next.js you know.**
This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project Structure
- `src/app/` - App Router pages and layouts (e.g., `/properties`, `/services`, `/about`, `/contact`)
- `src/components/` - Reusable UI components (e.g., `PropertyCard.tsx`, `SearchModal.tsx`, `Navigation.tsx`)
- `src/data/` - Static data and types

## Code Guidelines
### Do
- Default to **Server Components** in `src/app/`.
- Use `'use client';` only for components requiring interactivity, state, or browser APIs (e.g., `src/components/SearchModal.tsx`).
- Use TypeScript strict mode and define explicit interfaces for all component props.
- Use Tailwind v4 utility classes for all styling.
- Build with a mobile-first responsive approach.
- Ensure strict container boundaries to prevent horizontal overflow on 320px screens. Avoid `w-screen` and enforce `overflow-x-hidden` on the root. Use `break-words` and clamped typography carefully to prevent text overflow.

### Don't
- Don't use legacy class components.
- Don't use `any` type without an explicit comment explaining why it's necessary.
- Don't mix server and client component logic in the same file.

## Common Commands
- `npm run dev` - Start development server (localhost:3000)
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint validation

## Component Patterns
- **Good Examples:** See `src/components/PropertyCard.tsx` for standard UI implementation and `src/components/FeaturedProperties.tsx` for handling lists of properties.
