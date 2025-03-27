import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // API의 기본 URL을 설정하세요.
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

export const contractChoice = async (templateCode: string) => {
    try {
        const response = await apiClient.get(
            import.meta.env.VITE_CONTRACT + "/" + templateCode
        );
        return response;
    } catch (error) {
        console.log("API 요청 에러 : ", error);
        throw error;
    }
}