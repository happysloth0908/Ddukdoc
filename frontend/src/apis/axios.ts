import axios, { AxiosInstance } from 'axios';

// 토큰 인증이 필요한 api 호출 시 사용하면 됨.
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

export default api;
