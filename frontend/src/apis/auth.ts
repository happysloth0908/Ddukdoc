import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // API의 기본 URL을 설정하세요.
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// API 정의 부분 

// 회원가입
export const getToken = async () => {
  try {
    const response = await apiClient.get(import.meta.env.VITE_TOKEN_FOR_DEV);
    console.log(response);
    return response;
  } catch (error) {
    console.log("API 요청 에러:", error);
    throw error;
  }
};