import { apiClient } from '@/apis/ssafy/mypage';
import atoms from '@/components/atoms';
import { DocsDescription } from '@/components/atoms/infos/DocsDescription';
import { useShareInfoStore } from '@/store/mmStore';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import profile from '@/assets/images/ssafy/mypage/profile.svg';
import Spinner from '@/components/atoms/feedback/Spinner';

interface Team {
  id: string;
  display_name: string;
}

const SelectTeam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user_id, token, setTeam_id } = useShareInfoStore();
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectionError, setSelectionError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getTeams = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await apiClient.post(`/api/share/mm/team`, {
        user_id: user_id,
        token: token,
      });
      setTeams(response.data.data.teams);
    } catch (error) {
      console.error('팀 공유 중 오류가 발생했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (!selectedTeam) {
      setSelectionError('팀을 선택하지 않았습니다');
      return;
    }
    setSelectionError('');
    setTeam_id(selectedTeam.id);

    navigate(`/ssafy/mypage/share/${id}/channel`);
  };

  useEffect(() => {
    getTeams();
  }, []);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <DocsDescription
        title={'공유할 팀을 선택해주세요!'}
        subTitle={''}
        description={'팀을 선택해주세요'}
      />
      {selectionError && (
        <p className="mt-1 text-sm text-red-500">{selectionError}</p>
      )}
      <div className="my-4 flex-1 overflow-y-auto rounded-lg">
        {isLoading ? (
          <Spinner />
        ) : (
          teams.map((team) => (
            <div
              key={team.id}
              className={`mb-2 flex cursor-pointer items-center gap-x-4 rounded-lg p-4 ${selectedTeam?.id === team.id ? 'bg-primary-100' : 'bg-white'}`}
              onClick={() => {
                setSelectedTeam(team);
                setSelectionError('');
              }}
            >
              <img
                src={profile}
                alt="team"
                className="h-10 w-10 rounded-full"
              />
              <div>
                <div className="text-lg">{team.display_name}</div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mb-20">
        <atoms.LongButton onClick={handleNext}>다음</atoms.LongButton>
      </div>
    </div>
  );
};

export default SelectTeam;
