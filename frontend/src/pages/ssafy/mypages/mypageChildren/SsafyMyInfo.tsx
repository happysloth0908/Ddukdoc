import { DocsDescription } from '@/components/atoms/infos/DocsDescription';
import { useEffect } from 'react';
import { useSsafyMyStore } from '@/store/ssafyMyInfoStore';

export const SsafyMyInfo = () => {
  const { data, loading, error, setData } = useSsafyMyStore();

  useEffect(() => {
    if (!data.name) {
      setData();
    }
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error.message}</div>;
  if (!data) return <div>사용자 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="flex w-full flex-col space-y-4 pt-4">
      <DocsDescription
        title={data.name || ''}
        subTitle={''}
        description={data.email || ''}
      />
      <div className="flex items-center justify-between">
        <span className="text-lg font-normal text-black">{data.region}</span>
        <span className="text-2xl text-gray-400">|</span>
        <span className="text-lg font-normal text-black">{data.category}</span>
        <span className="text-2xl text-gray-400">|</span>
        <span className="text-lg font-normal text-black">
          {data.project_name}
        </span>
      </div>
    </div>
  );
};
