import axios from 'axios';
import { useAppStore } from '../store';

/**
 * Centralised Axios instance.
 * Base URL: VITE_API_BASE_URL env var, falls back to /api/v1 (Vite proxy → localhost:5000)
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT Bearer token from Zustand store (persisted via localStorage)
api.interceptors.request.use((config) => {
  const token = useAppStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401 — clear session (token expired or invalid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAppStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
