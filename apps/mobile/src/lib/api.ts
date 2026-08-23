import { ApiClient } from '@sanken/core';
import { useAuthStore } from '@/store/auth-store';

export const api = new ApiClient({
  baseUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000',
  getToken: () => useAuthStore.getState().token,
});
