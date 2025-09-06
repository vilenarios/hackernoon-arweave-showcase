# HackerNoon Arweave Gallery

A React application to browse HackerNoon articles permanently stored on the Arweave blockchain. Features enhanced article cards with metadata fetching, staggered loading to prevent rate limiting, and both dark/light theme support.

## Features

- 📰 Browse HackerNoon articles stored on Arweave
- 🔍 Enhanced metadata parsing from article content (TLDR, author, tags, reading time)
- ⚡ Staggered loading with skeleton loaders to prevent gateway rate limiting
- 🎨 Dark/light theme support with system preference detection
- 🔄 Infinite scroll with pagination
- 📱 Responsive grid layout (1-4 columns based on screen size)
- 🚀 Optimized for Arweave deployment with relative paths

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **GraphQL**: Apollo Client
- **Blockchain**: Arweave (permanent storage)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/vilenarios/hackernoon-arweave-showcase.git
cd hackernoon-arweave-showcase

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The build is configured for deployment on Arweave or other platforms where the app doesn't live at the domain root.

## Configuration

### Arweave Gateway

The app uses ar.io gateways to fetch article content. The gateway URL is configured in `src/lib/gateway.ts`.

### GraphQL Endpoint

The Arweave GraphQL endpoint is configured in `src/lib/apollo-client.ts` to query HackerNoon articles by wallet address.

### Rate Limiting

The app implements intelligent rate limiting to prevent 429 errors:
- Staggered card rendering (150ms delays)
- Staggered metadata fetching (200ms intervals)
- Skeleton loaders for smooth UX during loading

## Project Structure

```
src/
├── components/          # React components
│   ├── ArticleCard.tsx     # Basic article card
│   ├── ArticleGrid.tsx     # Grid layout with infinite scroll
│   ├── EnhancedArticleCard.tsx  # Enhanced card with metadata
│   ├── Header.tsx          # App header with theme toggle
│   └── SkeletonCard.tsx    # Loading skeleton
├── hooks/              # Custom React hooks
│   └── useHackernoonArticles.ts  # Article fetching logic
├── lib/                # Utilities and configuration
│   ├── apollo-client.ts    # GraphQL client setup
│   ├── article-parser.ts   # HTML metadata parsing
│   ├── gateway.ts          # Arweave gateway configuration
│   └── queries.ts          # GraphQL queries
└── types/              # TypeScript type definitions
    └── article.ts          # Article data types
```

## Features in Detail

### Enhanced Article Cards

- **Metadata Parsing**: Extracts TLDR, author info, tags, and reading time from article HTML
- **Progressive Loading**: Shows basic info immediately, enhances with metadata as it loads
- **Hover Previews**: Desktop users see TLDR previews on card hover
- **Smart Truncation**: 3-line descriptions with 300-character TLDR parsing

### Rate Limiting Prevention

- **Staggered Rendering**: Cards appear progressively to avoid overwhelming gateways
- **Request Throttling**: Metadata requests spaced 200ms apart
- **Graceful Fallbacks**: Falls back to transaction metadata if enhanced parsing fails

### Theme Support

- **System Detection**: Automatically detects user's system theme preference
- **Manual Toggle**: Users can override with manual theme switching
- **Persistent Storage**: Theme preference saved to localStorage

## Deployment

### Arweave Deployment

The app is configured for Arweave deployment with:
- Relative asset paths (`base: './'` in `vite.config.ts`)
- Optimized bundle size
- No external dependencies at runtime

### Other Platforms

Works on any static hosting platform:
- Vercel
- Netlify  
- GitHub Pages
- Traditional web servers

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- HackerNoon for creating quality tech content
- Arweave for permanent, decentralized storage
- The ar.io gateway network for reliable access