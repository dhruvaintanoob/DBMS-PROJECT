import { apiClient } from './api';
import { Watchlist } from '../types';

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