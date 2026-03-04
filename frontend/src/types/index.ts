// User types
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

// Profile types
export interface Profile {
  id: number;
  profileName: string;
  avatarUrl?: string;
  isKidProfile: boolean;
  user?: User;
}

// Content types
export interface Content {
  id: number;
  title: string;
  genre: string;
  releaseDate: string;
  duration: number;
  rating: string;
  description: string;
  videoLocation?: string; // 'youtube' or 'local'
  youtubeUrl?: string; // For YouTube videos
  localVideoPath?: string; // For local videos
  thumbnailUrl?: string;
  requiredPlan?: string; // Minimum subscription plan required
}

// Watchlist types
export interface Watchlist {
  id: number;
  profile: Profile;
  content: Content;
  addedAt: string;
}

// Interaction types
export interface UserContentInteraction {
  interactionId: number;
  profile: Profile;
  content: Content;
  interactionType: string;
  interactionDate: string;
}

// API Error types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// UI State types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface AuthState {
  user: User | null;
  currentProfile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}