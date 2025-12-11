# LensLock Gallery

## Overview

LensLock Gallery is a secure client photo gallery system designed for professional photographers. It allows photographers to upload photo collections and share them with clients through unique gallery links. The system features AI-powered collection metadata generation using Google's Gemini API, photographer authentication, and a clean gallery viewing experience.

**Core Features:**
- Secure photographer-only upload access with email-based authentication
- AI-powered collection naming and description generation
- Photo collection management with unique shareable URLs
- Client-facing gallery with download capabilities
- Responsive image grid layout with lightbox viewing

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 19 with TypeScript
- React Router for client-side routing
- Vite as the build tool and development server
- Tailwind CSS (via CDN) for styling

**Key Design Patterns:**
- Component-based architecture with reusable UI components (Button, Navbar)
- Page-based routing with protected routes for authenticated areas
- Session-based authentication using sessionStorage
- Service layer pattern for API calls (apiService) and AI integration (geminiService)

**Routing Structure:**
- Public routes: Home (`/`), Login (`/login`), Gallery viewing (`/gallery/:slug`)
- Protected routes: Upload (`/upload`) - requires authentication
- HashRouter used for client-side routing compatibility

**State Management:**
- Local component state using React hooks (useState, useEffect)
- No global state management library - authentication state managed via sessionStorage
- Upload progress and collection data managed at component level

### Backend Architecture

**Technology Stack:**
- Express.js server running on port 3001
- PostgreSQL database for persistent data storage
- File system storage for uploaded images

**Server Design:**
- RESTful API endpoints for authentication, collections, and file uploads
- Multer middleware for multipart file upload handling
- CORS enabled for cross-origin requests from frontend
- Session-based authentication using UUID session IDs

**API Endpoints:**
- `POST /api/auth/login` - Photographer authentication
- `POST /api/auth/logout` - Session termination
- `GET /api/auth/verify` - Session validation
- `POST /api/collections` - Create new collection with photos
- `GET /api/collections/recent` - Fetch recent collections
- `GET /api/collections/:slug` - Fetch collection by slug
- Static file serving via `/uploads` route

**Database Schema:**
The application uses PostgreSQL with the following structure:
- `collections` table: Stores collection metadata (id, slug, name, description, photographer_email, created_at)
- `photos` table: Stores individual photo records linked to collections (id, collection_id, filename, url, size, type, width, height)

### Authentication & Authorization

**Security Model:**
- Single authorized photographer email hardcoded (`zanjo3717@gmail.com`)
- Email-based login validation (no password required - assumes trusted environment)
- Session ID stored in sessionStorage and passed via `X-Session-Id` header
- Protected routes check authentication status before rendering
- Server validates session ID on authenticated endpoints

**Trade-offs:**
- Simple authentication suitable for single-user or demo scenarios
- Not production-ready for multi-user systems (would need proper password hashing, JWT tokens, etc.)
- Session stored client-side only - server doesn't maintain session state

### File Upload & Storage

**Upload Flow:**
1. Client selects multiple image files
2. Optional: AI generates collection name/description from first image
3. Files uploaded via multipart/form-data to Express server
4. Multer processes files and saves to `/uploads` directory with UUID-based filenames
5. File metadata stored in database with references to collection
6. Unique slug generated for collection sharing

**File Storage:**
- Images stored directly on filesystem in `/uploads` directory
- Filenames include UUID prefix to prevent collisions
- Static file serving via Express for image delivery
- No CDN or cloud storage integration (could be added for scalability)

## External Dependencies

### Third-Party APIs

**Google Gemini API:**
- Used for AI-powered collection metadata generation
- Model: `gemini-2.5-flash`
- Functionality: Analyzes uploaded images to suggest creative titles and descriptions
- API key configured via `GEMINI_API_KEY` environment variable
- Client-side integration (note: not production-safe, should move to server-side)

### Database

**PostgreSQL:**
- Primary data store for collections and photo metadata
- Connection via `pg` package using `DATABASE_URL` environment variable
- Tables auto-created on server initialization if not present
- Supports standard PostgreSQL features (UUID, VARCHAR, TEXT, TIMESTAMP)

### NPM Packages

**Core Dependencies:**
- `@google/genai` - Google Gemini API client
- `express` - Web server framework
- `react` & `react-dom` - UI library
- `react-router-dom` - Client-side routing
- `pg` - PostgreSQL client
- `multer` - File upload middleware
- `cors` - Cross-origin resource sharing
- `uuid` - Unique identifier generation
- `lucide-react` - Icon components

**Development Dependencies:**
- `vite` - Build tool and dev server
- `typescript` - Type safety
- `@vitejs/plugin-react` - React integration for Vite

### Development Setup

**Environment Variables Required:**
- `GEMINI_API_KEY` - Google Gemini API authentication
- `DATABASE_URL` - PostgreSQL connection string

**Port Configuration:**
- Frontend dev server: Port 5000 (Vite)
- Backend API server: Port 3001 (Express)
- Vite proxy configured to forward `/api` and `/uploads` requests to backend

**Build Process:**
- Vite builds React app to `../dist` directory
- Express serves static files and API endpoints
- TypeScript compilation handled by Vite (no separate tsc build step)