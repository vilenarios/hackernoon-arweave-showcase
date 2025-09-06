# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Development workflow:
```bash
npm run dev          # Start development server (Vite)
npm run build        # Build for production (TypeScript check + Vite build)
npm run lint         # Run ESLint
npm run preview      # Preview production build locally
```

## Architecture

This is a React + TypeScript application that displays HackerNoon articles stored on the Arweave blockchain.

### Key Architecture Patterns

- **Data Flow**: Apollo Client -> GraphQL queries -> Arweave network -> Article display
- **Rate Limiting Strategy**: Staggered loading (150ms card rendering, 200ms metadata fetching) to prevent gateway 429 errors
- **Progressive Enhancement**: Basic article cards load first, then enhanced metadata is fetched separately

### Core Structure

```
src/
├── components/             # React components
│   ├── ArticleGrid.tsx        # Main grid with infinite scroll
│   ├── EnhancedArticleCard.tsx # Enhanced cards with metadata parsing
│   └── SkeletonCard.tsx       # Loading states
├── hooks/
│   └── useHackernoonArticles.ts # Main data fetching hook
├── lib/
│   ├── apollo-client.ts       # GraphQL client (arweave.net/graphql)
│   ├── queries.ts            # GraphQL queries for Arweave
│   └── gateway.ts            # ar.io gateway configuration
└── types/
    └── article.ts            # Article type definitions
```

### Key Technical Details

- **Arweave Integration**: Uses Arweave GraphQL endpoint to query transactions by HackerNoon wallet address (`X8se6ANj4C-gpP_JH0ZbtJJEpyHBr0XQA-crCpbZGak`)
- **Content Fetching**: Retrieves actual article HTML from ar.io gateways with smart gateway selection
- **Metadata Parsing**: Extracts TLDR, author, tags, reading time from article HTML content using `parseHackerNoonHTML()`
- **Pagination**: Infinite scroll with cursor-based pagination (100 articles per page)
- **Caching**: Metadata cache to prevent duplicate API calls, Apollo Client cache for GraphQL
- **Deployment Ready**: Configured with `base: './'` in Vite config for Arweave deployment

### Rate Limiting Implementation

- **Card Rendering**: 150ms stagger delay per card (`index * 150`)
- **Metadata Fetching**: 300ms base delay + 200ms per card stagger (`300 + index * 200`)
- **Gateway Selection**: Dynamic gateway URL selection based on deployment context
- **Abort Controllers**: Request cancellation for cleanup and performance

### GraphQL Queries

The app queries Arweave for transactions tagged with HackerNoon's wallet address, then fetches the actual article content from gateway URLs. See `src/lib/queries.ts` for the specific GraphQL structure.

### Theme System

Uses Tailwind CSS with dark/light mode support. Theme state managed in components with localStorage persistence.