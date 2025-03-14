import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://example.com", // API의 기본 URL을 설정하세요.
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// API 정의 부분 

// 회원가입
export const postRegister = async () => {
  try {
    const response = await apiClient.get("/user");
    return response;
  } catch (error) {
    console.log("API 요청 에러:", error);
    throw error;
  }
};