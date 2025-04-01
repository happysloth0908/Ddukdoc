import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // API의 기본 URL을 설정하세요.
  withCredentials: true,
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

export const contractSave = async (
    templateCode: string,
    jsonData: { role_id: number; title: string; data: { field_id: number; name: string; field_value: string; }[] },
    signatureURL: string
  ) => {
  try {
    const image = await fetch(signatureURL);
    const signatureBlob = await image.blob();
    const signatureFile = new File([signatureBlob], "signature.png", { type: "image/png" });

    const data = new FormData();
    const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: "application/json" })
    data.append("jsonData", jsonBlob);
    data.append("signature", signatureFile as File);

    const response = await apiClient.post(
      import.meta.env.VITE_CONTRACT + "/" + templateCode,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true,
      }
    );

    return response.data;

  } catch (error) {
    console.log("API 요청 에러 : ", error);
    throw error;
  }
}