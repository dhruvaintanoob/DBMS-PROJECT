import { apiClient } from './api';
import { Profile } from '../types';

export const profileService = {
  async createProfile(
    userId: number,
    profileName: string,
    isKidProfile: boolean = false,
    avatarUrl?: string
  ): Promise<string> {
    const response = await apiClient.post('/api/profiles/create', null, {
      params: { userId, profileName, isKidProfile, avatarUrl }
    });
    return response.data;
  },

  async getUserProfiles(userId: number): Promise<Profile[]> {
    const response = await apiClient.get(`/api/profiles/user/${userId}`);
    return response.data;
  },

  async getProfileById(profileId: number): Promise<Profile> {
    const response = await apiClient.get(`/api/profiles/${profileId}`);
    return response.data;
  },

  async updateProfile(
    profileId: number,
    profileName?: string,
    isKidProfile?: boolean,
    avatarUrl?: string
  ): Promise<string> {
    const response = await apiClient.put(`/api/profiles/update/${profileId}`, null, {
      params: { profileName, isKidProfile, avatarUrl }
    });
    return response.data;
  },

  async deleteProfile(profileId: number): Promise<string> {
    const response = await apiClient.delete(`/api/profiles/delete/${profileId}`);
    return response.data;
  }
};
