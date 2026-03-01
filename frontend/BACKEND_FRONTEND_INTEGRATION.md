# Backend-Frontend Integration Guide

## Overview
This document outlines the integration strategy between the Spring Boot backend and React frontend for the Netflix clone application.

## Backend Configuration

### CORS Setup
The backend already has `@CrossOrigin` annotations on controllers, enabling cross-origin requests from the frontend.

### API Base URL
- **Development**: `http://localhost:8080`
- **Production**: Configure based on deployment environment

## Frontend API Integration

### HTTP Client Configuration

```typescript
// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## API Service Layer

### User Authentication Service

```typescript
// src/services/authService.ts
import { apiClient } from './api';
import { User, LoginRequest, RegisterRequest } from '../types/auth';

export const authService = {
  async login(credentials: LoginRequest): Promise<User> {
    const response = await apiClient.post('/api/users/login', credentials);
    return response.data;
  },

  async register(userData: RegisterRequest): Promise<string> {
    const response = await apiClient.post('/api/users/register', userData);
    return response.data;
  },

  async getAllUsers(): Promise<User[]> {
    const response = await apiClient.get('/api/users/all');
    return response.data;
  }
};
```

### Content Service

```typescript
// src/services/contentService.ts
import { apiClient } from './api';
import { Content } from '../types/content';

export const contentService = {
  async getAllContent(): Promise<Content[]> {
    const response = await apiClient.get('/api/content/all');
    return response.data;
  },

  async getContentById(id: number): Promise<Content> {
    const response = await apiClient.get(`/api/content/${id}`);
    return response.data;
  },

  async searchContent(title: string): Promise<Content[]> {
    const response = await apiClient.get('/api/content/search', {
      params: { title }
    });
    return response.data;
  },

  async filterByGenre(genre: string): Promise<Content[]> {
    const response = await apiClient.get('/api/content/filter', {
      params: { genre }
    });
    return response.data;
  },

  async addContent(content: Omit<Content, 'id'>): Promise<Content> {
    const response = await apiClient.post('/api/content/add', content);
    return response.data;
  }
};
```

### Watchlist Service

```typescript
// src/services/watchlistService.ts
import { apiClient } from './api';
import { Watchlist } from '../types/watchlist';

export const watchlistService = {
  async addToWatchlist(profileId: number, contentId: number): Promise<string> {
    const response = await apiClient.post('/api/watchlist/add', null, {
      params: { profileId, contentId }
    });
    return response.data;
  },

  async getProfileWatchlist(profileId: number): Promise<Watchlist[]> {
    const response = await apiClient.get(`/api/watchlist/profile/${profileId}`);
    return response.data;
  },

  async removeFromWatchlist(profileId: number, contentId: number): Promise<string> {
    const response = await apiClient.delete('/api/watchlist/remove', {
      params: { profileId, contentId }
    });
    return response.data;
  }
};
```

### User Interaction Service

```typescript
// src/services/interactionService.ts
import { apiClient } from './api';
import { UserContentInteraction } from '../types/interaction';

export const interactionService = {
  async recordInteraction(
    profileId: number, 
    contentId: number, 
    type: string
  ): Promise<string> {
    const response = await apiClient.post('/api/interactions/add', null, {
      params: { profileId, contentId, type }
    });
    return response.data;
  },

  async getProfileHistory(profileId: number): Promise<UserContentInteraction[]> {
    const response = await apiClient.get(`/api/interactions/profile/${profileId}`);
    return response.data;
  },

  async getInteractionsByType(
    profileId: number, 
    type: string
  ): Promise<UserContentInteraction[]> {
    const response = await apiClient.get(
      `/api/interactions/profile/${profileId}/type`,
      { params: { type } }
    );
    return response.data;
  }
};
```

## TypeScript Type Definitions

### Core Types

```typescript
// src/types/auth.ts
export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  subscriptionPlan: string;
  profiles: Profile[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  subscriptionPlan: string;
}

// src/types/profile.ts
export interface Profile {
  id: number;
  profileName: string;
  avatarUrl?: string;
  isKidProfile: boolean;
  user: User;
}

// src/types/content.ts
export interface Content {
  id: number;
  title: string;
  genre: string;
  releaseDate: string;
  duration: number;
  rating: string;
  description: string;
}

// src/types/watchlist.ts
export interface Watchlist {
  id: number;
  profile: Profile;
  content: Content;
  addedAt: string;
}

// src/types/interaction.ts
export interface UserContentInteraction {
  interactionId: number;
  profile: Profile;
  content: Content;
  interactionType: string;
  interactionDate: string;
}
```

## State Management Integration

### API Context Provider

```typescript
// src/context/ApiContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { authService } from '../services/authService';
import { contentService } from '../services/contentService';
import { watchlistService } from '../services/watchlistService';
import { interactionService } from '../services/interactionService';

interface ApiContextType {
  auth: typeof authService;
  content: typeof contentService;
  watchlist: typeof watchlistService;
  interactions: typeof interactionService;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const apiServices = {
    auth: authService,
    content: contentService,
    watchlist: watchlistService,
    interactions: interactionService,
  };

  return (
    <ApiContext.Provider value={apiServices}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};
```

## Error Handling Strategy

### API Error Types

```typescript
// src/types/errors.ts
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export class ApiException extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiException';
  }
}
```

### Error Handling Hook

```typescript
// src/hooks/useErrorHandler.ts
import { useState, useCallback } from 'react';
import { ApiError } from '../types/errors';

export const useErrorHandler = () => {
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAsync = useCallback(async <T>(
    asyncFn: () => Promise<T>
  ): Promise<T | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await asyncFn();
      return result;
    } catch (err: any) {
      const apiError: ApiError = {
        message: err.response?.data?.message || err.message || 'An error occurred',
        status: err.response?.status || 500,
        code: err.response?.data?.code
      };
      setError(apiError);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { error, isLoading, handleAsync, clearError };
};
```

## Development Workflow

### 1. Backend Development
- Ensure Spring Boot application runs on port 8080
- Test API endpoints using Postman or similar tools
- Verify CORS configuration allows frontend requests

### 2. Frontend Development
- Start React development server on port 3000
- Configure proxy in package.json if needed:
```json
{
  "proxy": "http://localhost:8080"
}
```

### 3. Integration Testing
- Test API calls from frontend components
- Verify data flow between frontend and backend
- Handle loading states and error scenarios

## Database Integration Considerations

### Profile Management
- Backend currently has empty ProfileController
- Frontend should handle profile creation through User entity
- Consider implementing ProfileService and ProfileController in backend

### Content Management
- Backend supports full CRUD operations
- Frontend should implement admin interface for content management
- Consider file upload for movie posters/thumbnails

### User Sessions
- Current backend doesn't implement JWT or session management
- Consider adding Spring Security for proper authentication
- Frontend should handle token storage and refresh

## Performance Optimization

### Caching Strategy
- Implement React Query or SWR for API caching
- Cache frequently accessed content data
- Implement optimistic updates for user interactions

### Lazy Loading
- Implement content pagination
- Lazy load images and video thumbnails
- Code splitting for different application sections

## Security Considerations

### Authentication
- Implement proper JWT token handling
- Secure token storage (httpOnly cookies recommended)
- Handle token expiration and refresh

### Data Validation
- Validate all user inputs on frontend
- Sanitize data before API calls
- Handle malicious input attempts

### HTTPS Configuration
- Ensure HTTPS in production
- Configure secure headers
- Implement CSRF protection

This integration guide ensures seamless communication between the Spring Boot backend and React frontend while maintaining security and performance best practices.