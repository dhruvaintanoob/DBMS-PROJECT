import { apiClient } from './api';
import { User, LoginRequest, RegisterRequest } from '../types';

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
  },

  // Local storage helpers
  saveUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  },

  removeUser(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentProfile');
    localStorage.removeItem('authToken');
  },

  saveProfile(profile: any): void {
    localStorage.setItem('currentProfile', JSON.stringify(profile));
  },

  getProfile(): any | null {
    const profileStr = localStorage.getItem('currentProfile');
    return profileStr ? JSON.parse(profileStr) : null;
  }
};