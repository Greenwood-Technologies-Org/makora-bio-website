# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Frontend (React + Vite + TypeScript)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Backend (Flask + DSPY)
Navigate to `backend/` directory first:
- `cd backend`
- `source .venv/bin/activate` - Activate virtual environment
- `python main.py` - Start Flask development server (runs on port 5001)
- `uv pip install -e .` - Install dependencies
- `uv pip install -e ".[dev]"` - Install with dev dependencies

Backend development commands (requires virtual environment):
- `pytest` - Run tests
- `black .` - Format code
- `ruff check .` - Lint code
- `mypy .` - Type checking

## Architecture Overview

### Frontend Structure
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM
- **State Management**: TanStack Query for server state
- **UI Components**: Comprehensive shadcn/ui component library in `src/components/ui/`

### Backend Structure
- **Framework**: Flask with CORS enabled
- **AI Integration**: DSPY for LLM workflows with Claude Sonnet 4.5
- **Architecture**: Blueprint-based route organization
- **Key Components**:
  - `app/__init__.py` - Flask application factory
  - `app/dspy_routes.py` - DSPY-powered API endpoints
  - `app/dspy_signatures.py` - DSPY signature definitions
  - `main.py` - Application entry point

### Project Organization
```
/                    # Frontend root
├── src/
│   ├── components/  # React components
│   │   └── ui/      # shadcn/ui components
│   ├── pages/       # Page components
│   ├── hooks/       # Custom React hooks
│   └── lib/         # Utilities
└── backend/         # Flask backend
    └── app/         # Flask application modules
```

## Key Technical Details

### Frontend
- Uses Vite for fast development and building
- TypeScript for type safety
- shadcn/ui provides a complete component system
- React Router handles client-side routing with routes: `/`, `/demo`, and catch-all `*`

### Backend
- Flask app factory pattern with blueprints
- DSPY integration for LLM-powered email drafting
- Configured for Claude Sonnet 4.5 via Anthropic API
- CORS enabled for frontend communication
- Runs on port 5001 (due to macOS AirPlay conflict on 5000)

### Environment Setup
- Frontend: Node.js with npm
- Backend: Python 3.11+ with uv package manager
- Backend requires `.env` file with API keys (copy from `.env.example`)

## Development Workflow

1. **Frontend development**: Run `npm run dev` from root
2. **Backend development**: 
   - `cd backend`
   - `source .venv/bin/activate`
   - `python main.py`
3. **Full stack**: Run both servers simultaneously
4. **Before committing**: Run `npm run lint` for frontend, and `black .`, `ruff check .` for backend

## API Integration

The backend provides DSPY-powered endpoints under `/api/dspy/`:
- `POST /api/dspy/draft-email-reply` - Generates email replies based on thread context and todo tasks
- `GET /health` - Health check endpoint

DSPY signatures are defined in `app/dspy_signatures.py` for structured LLM interactions.