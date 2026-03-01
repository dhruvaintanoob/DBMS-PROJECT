import { apiClient } from './api';
import { Content } from '../types';

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