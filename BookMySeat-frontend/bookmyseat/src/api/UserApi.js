import { apiClient } from './Client';

export const UserApi = {
  getAll: () => apiClient('users'),
  getById: (id) => apiClient(`users/${id}`),
  update: (id, data) => apiClient(`users/${id}`, { method: 'PUT', body: data }),
  getProfile: () => apiClient('api/users/showProfile'),
};