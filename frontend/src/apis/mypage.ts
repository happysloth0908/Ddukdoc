import axios from 'axios';

export const apiClient = axios.create({
  // baseURL: import.meta.env.VITE_API_URL,
  baseURL: import.meta.env.VITE_MSW_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-DEV-USER': 1,
  },
});
