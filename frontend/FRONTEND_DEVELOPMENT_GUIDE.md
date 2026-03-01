# Netflix Clone Frontend Development Guide

## Project Overview
This document outlines the development of a Netflix-like streaming platform frontend that integrates with the existing Spring Boot backend API.

## Backend Analysis Summary

### Core Entities
- **User**: Account holder with subscription plan, can have multiple profiles
- **Profile**: Individual viewing profiles within a user account (supports kid profiles)
- **Content**: Movies/shows with metadata (title, genre, rating, description, duration)
- **UserContentInteraction**: Tracks viewing history and ratings per profile
- **Watchlist**: Profile-specific saved content lists

### Available API Endpoints

#### User Management
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User authentication
- `GET /api/users/all` - Get all users (admin)

#### Content Management
- `GET /api/content/all` - Get all content
- `GET /api/content/{id}` - Get specific content
- `GET /api/content/search?title=` - Search by title
- `GET /api/content/filter?genre=` - Filter by genre
- `POST /api/content/add` - Add new content (admin)

#### Profile Interactions
- `POST /api/interactions/add` - Record interaction (watched, rated)
- `GET /api/interactions/profile/{profileId}` - Get profile history
- `GET /api/interactions/profile/{profileId}/type?type=` - Get specific interaction types

#### Watchlist Management
- `POST /api/watchlist/add` - Add to watchlist
- `GET /api/watchlist/profile/{profileId}` - Get profile watchlist
- `DELETE /api/watchlist/remove` - Remove from watchlist

## Frontend Architecture

### Technology Stack
- **Framework**: React with TypeScript
- **Styling**: CSS Modules + Tailwind CSS
- **State Management**: React Context + useReducer
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Build Tool**: Vite

### Project Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── auth/
│   │   ├── content/
│   │   ├── profile/
│   │   └── layout/
│   ├── pages/
│   ├── services/
│   ├── context/
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   └── styles/
├── public/
└── package.json
```

## Core Features to Implement

### 1. Authentication System
- Login/Register forms
- Session management
- Protected routes
- Logout functionality

### 2. Profile Management
- Profile selection screen
- Create/edit profiles
- Kid profile toggle
- Avatar selection

### 3. Content Discovery
- Home page with content grid
- Search functionality
- Genre filtering
- Content details modal/page

### 4. Video Player Interface
- Mock video player component
- Play/pause controls
- Progress tracking
- Fullscreen mode

### 5. Watchlist Features
- Add/remove from watchlist
- Watchlist page
- Profile-specific lists

### 6. User Interactions
- Rating system
- Watch history
- Continue watching section

### 7. Responsive Design
- Mobile-first approach
- Tablet and desktop layouts
- Touch-friendly controls

## Component Breakdown

### Authentication Components
- `LoginForm` - User login interface
- `RegisterForm` - New user registration
- `AuthGuard` - Route protection wrapper

### Profile Components
- `ProfileSelector` - Choose active profile
- `ProfileManager` - Create/edit profiles
- `ProfileCard` - Individual profile display

### Content Components
- `ContentGrid` - Display content in rows/grids
- `ContentCard` - Individual content item
- `ContentModal` - Detailed content view
- `VideoPlayer` - Streaming interface
- `SearchBar` - Content search functionality

### Layout Components
- `Header` - Navigation and user menu
- `Sidebar` - Genre navigation (optional)
- `Footer` - Links and information

### Utility Components
- `LoadingSpinner` - Loading states
- `ErrorBoundary` - Error handling
- `Modal` - Reusable modal wrapper

## State Management Strategy

### Context Providers
- `AuthContext` - User authentication state
- `ProfileContext` - Active profile management
- `ContentContext` - Content data and filters

### Custom Hooks
- `useAuth` - Authentication operations
- `useProfile` - Profile management
- `useContent` - Content fetching and caching
- `useWatchlist` - Watchlist operations

## Styling Guidelines

### Design System
- Netflix-inspired color palette (red, black, dark gray)
- Typography hierarchy
- Consistent spacing and sizing
- Hover and focus states

### Responsive Breakpoints
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

### Animation Guidelines
- Smooth transitions (0.3s ease)
- Hover effects on interactive elements
- Loading animations
- Page transitions

## Development Phases

### Phase 1: Foundation (Week 1)
- Project setup and configuration
- Basic routing structure
- Authentication system
- Profile management

### Phase 2: Core Features (Week 2)
- Content display and search
- Watchlist functionality
- Basic video player interface
- Responsive design implementation

### Phase 3: Enhancement (Week 3)
- User interactions and ratings
- Advanced filtering
- Performance optimization
- Testing and bug fixes

### Phase 4: Polish (Week 4)
- UI/UX refinements
- Accessibility improvements
- Documentation completion
- Deployment preparation

## API Integration Guidelines

### HTTP Client Setup
- Base URL configuration
- Request/response interceptors
- Error handling middleware
- Authentication headers

### Data Fetching Patterns
- Loading states management
- Error boundary implementation
- Caching strategies
- Optimistic updates

### Type Safety
- TypeScript interfaces for API responses
- Proper error type definitions
- Generic API response types

## Testing Strategy

### Unit Testing
- Component testing with React Testing Library
- Custom hooks testing
- Utility function testing

### Integration Testing
- API integration tests
- User flow testing
- Cross-browser compatibility

### Performance Testing
- Bundle size optimization
- Loading time analysis
- Memory usage monitoring

## Deployment Considerations

### Build Optimization
- Code splitting
- Asset optimization
- Environment configuration

### Hosting Options
- Static hosting (Netlify, Vercel)
- CDN integration
- Environment variables setup

This guide provides the foundation for building a comprehensive Netflix clone frontend that seamlessly integrates with the existing backend infrastructure.