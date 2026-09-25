import { apiClient } from './Client';

export const Auth = {
  getLoginUrl: ()=> apiClient("api/auth/login"),
  getCurrentUser: () => apiClient("api/auth/me"),
  logout:()=> apiClient("api/auth/logout")
};