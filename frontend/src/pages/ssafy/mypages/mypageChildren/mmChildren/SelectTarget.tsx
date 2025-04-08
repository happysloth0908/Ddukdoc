import atoms from '@/components/atoms';
import RoleSelectCard from '@/components/atoms/buttons/RoleSelectCard';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import personal from '@/assets/images/ssafy/mypage/personal.svg';
import team from '@/assets/images/ssafy/mypage/team.svg';
import { useShareInfoStore } from '@/store/mmStore';

const SelectTarget = () => {
  const { id } = useParams();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setShare_type } = useShareInfoStore();

  const handleToggleClick = (id: string) => {
    setSelectedId(id);
  };

  const handleNextClick = () => {
    if (selectedId === '1') {
      setShare_type('user');
      navigate(`/ssafy/mypage/share/${id}/personal`);
    } else if (selectedId === '2') {
      setShare_type('channel');
      navigate(`/ssafy/mypage/share/${id}/team`);
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-between">
      <div className="mt-20 flex flex-col gap-y-10">
        <div className="flex flex-col justify-center">
          <div className="text-2xl font-bold">공유하실 방법을</div>
          <div className="text-2xl font-bold">선택해주세요</div>
        </div>
        <div className="flex flex-col gap-4">
          <RoleSelectCard
            id={'1'}
            isSelected={selectedId === '1'}
            onToggleClick={() => handleToggleClick('1')}
            className={`${selectedId === '1' ? 'bg-primary text-white' : ''}`}
          >
            <div className="flex items-center gap-3 text-2xl font-bold">
              개인 DM 전송 <img src={personal} alt="" />
            </div>
          </RoleSelectCard>
          <RoleSelectCard
            id={'2'}
            isSelected={selectedId === '2'}
            onToggleClick={() => handleToggleClick('2')}
            className={`${selectedId === '2' ? 'bg-primary text-white' : ''}`}
          >
            <div className="flex items-center gap-3 text-2xl font-bold">
              팀 채널에 전송 <img src={team} alt="" />
            </div>
          </RoleSelectCard>
        </div>
        <atoms.LongButton
          className={`mt-40`}
          onClick={handleNextClick}
          colorType="black"
        >
          다음
        </atoms.LongButton>
      </div>
    </div>
  );
};

export default SelectTarget;
