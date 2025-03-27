import LongButton from '@/components/atoms/buttons/LongButton.tsx';
import ShortButton from '@/components/atoms/buttons/ShortButton';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import BottomRollup from '@/components/atoms/inputs/BottomRollup.tsx';
import Refuse from '@/pages/mypage/mypagechildren/Refuse.tsx';

const DocDetail = () => {
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={'flex h-full w-full flex-col items-center justify-between'}>
      <h1>마이페이지 문서 상세 페이지</h1>
      {/* 이 밑에꺼는 문서가 서명완료 상태일 때 상세페이지를 들어갔을 때 보여주는 부분 */}
      <div className={'flex w-full justify-between gap-x-4'}>
        <Link to={`files`} className={'w-1/2'}>
          <ShortButton children={'추가자료'} className={'w-full'} />
        </Link>
        <ShortButton children={'문서 다운로드'} className={'w-1/2'} />
      </div>

      {/* 문서정보 PDF가 들어갈 부분 */}
      <h3>{id}</h3>

      {/* 이 밑에꺼는 문서가 서명대기 상태일 때 상세페이지를 들어갔을 때 보여주는 부분 */}
      <div className={'mb-3 w-full'}>
        <LongButton children={'정보입력'} colorType={'black'} />
        <div
          onClick={() => setIsOpen(true)}
          className="mt-3 cursor-pointer justify-center text-center text-md font-medium text-status-warning underline"
        >
          문서 내용이 잘못되었나요? 반송하기
        </div>
      </div>

      <BottomRollup isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Refuse />
      </BottomRollup>
    </div>
  );
};

export default DocDetail;
