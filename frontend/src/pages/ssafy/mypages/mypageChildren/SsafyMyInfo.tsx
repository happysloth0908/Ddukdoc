import api from '@/apis/axios';
import { DocsDescription } from '@/components/atoms/infos/DocsDescription';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface MyInfoData {
  name: string | null;
  email: string | null;
  region: string | null;
  retire_yn: string | null;
  category: string | null;
  project_name: string | null;
}

export const SsafyMyInfo = () => {
  const [user, setUser] = useState<MyInfoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const InfoFetcher = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(`/api/ssafy/users/info`);
        const responseData = response.data;

        if (!responseData.success) {
          throw new Error('API에서 데이터를 가져오지 못했습니다.');
        }

        setUser(responseData.data);
      } catch (e) {
        const errorMessage = axios.isAxiosError(e)
          ? e.response?.data?.message || e.message
          : 'API 요청 중 오류가 발생했습니다.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    InfoFetcher();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;
  if (!user) return <div>사용자 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="flex w-full flex-col space-y-4 pt-4">
      <DocsDescription
        title={user.name || ''}
        subTitle={''}
        description={user.email || ''}
      />
      <div className="flex items-center justify-between">
        <span className="text-lg font-normal text-black">{user.region}</span>
        <span className="text-2xl text-gray-400">|</span>
        <span className="text-lg font-normal text-black">{user.category}</span>
        <span className="text-2xl text-gray-400">|</span>
        <span className="text-lg font-normal text-black">
          {user.project_name}
        </span>
      </div>
    </div>
  );
};
