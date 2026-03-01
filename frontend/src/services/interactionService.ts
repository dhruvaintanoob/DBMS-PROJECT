import { apiClient } from './api';
import { UserContentInteraction } from '../types';

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