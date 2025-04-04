import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // baseURL: import.meta.env.VITE_MSW_URL,
  headers: {
    // 'Content-Type': 'application/json',
    'X-DEV-USER': 1,
  },
});

export const sendReceiveData = async (
  doc_id: number,
  jsonData: {
    role_id: number;
    data: {
      field_id: number;
      name: string;
      field_value: string;
    }[];
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

    const response = await apiClient.post(
      import.meta.env.VITE_CONTRACT + '/' + doc_id + '/signature',
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.log('API 요청 에러 : ', error);
    throw error;
  }
};

export const sendFileData = async (doc_id: number, fileData: File) => {
  const data = new FormData();
  data.append('file', fileData);

  const jsonData = {
    title: fileData.name,
  };

  const jsonBlob = new Blob([JSON.stringify(jsonData)], {
    type: 'application/json',
  });
  data.append('title', jsonBlob);

  const response = await apiClient.post(`/api/materials/${doc_id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  });

  return response.data;
};

export const deleteDoc = async (doc_id: number) => {
  try {
    const response = await apiClient.patch(`/api/docs/${doc_id}/delete`);
    return response.data;
  } catch (error) {
    console.error('문서 삭제 API 요청 에러:', error);
    throw error;
  }
};
