# Makora Bio Website

A modern website for Makora Bio, featuring intelligent tools that accelerate life sciences with agentic AI.

## Project Overview

This website showcases Makora Bio's mission to build intelligent tools that free scientists from tedious digital tasks, allowing them to focus on discovery and innovation.

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd makora-bio-website

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Technologies Used

This project is built with:

- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **shadcn/ui** - Modern component library
- **Tailwind CSS** - Utility-first CSS framework

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── Contact.tsx     # Contact section
│   ├── Hero.tsx        # Hero section
│   ├── Platform.tsx    # Platform showcase
│   └── Waitlist.tsx    # Waitlist signup
├── pages/              # Page components
├── hooks/              # Custom React hooks
└── lib/                # Utility functions
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

This project uses ESLint and TypeScript for code quality and consistency. Make sure to run the linter before committing changes.

## Deployment

The website can be deployed to any static hosting service like Vercel, Netlify, or GitHub Pages.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
