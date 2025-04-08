import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const getSsafyDocs = async (page: number) => {
  const response = await apiClient.get(`api/ssafy/docs?page=${page}`);
  console.log(response.data);
  return response.data;
};

export const patchSsafyDocs = async (
  docId: number,
  jsonData: {
    role_id: number;
    title: string;
    data: { field_id: number; name: string; field_value: string }[];
  },
  signatureURL: string
) => {
  try {
    const image = await fetch(signatureURL);
    const signatureBlob = await image.blob();
    const signatureFile = new File([signatureBlob], 'signature.png', {
      type: 'image/png',
    });

    const data = new FormData();
    const jsonBlob = new Blob([JSON.stringify(jsonData)], {
      type: 'application/json',
    });
    data.append('jsonData', jsonBlob);
    data.append('signature', signatureFile as File);

    const response = await apiClient.put(`/api/ssafy/docs/${docId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.log('API 요청 에러 : ', error);
    throw error;
  }
};
