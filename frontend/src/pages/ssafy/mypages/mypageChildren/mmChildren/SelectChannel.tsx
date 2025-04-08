import { apiClient } from '@/apis/ssafy/mypage';
import atoms from '@/components/atoms';
import { DocsDescription } from '@/components/atoms/infos/DocsDescription';
import { useShareInfoStore } from '@/store/mmStore';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import profile from '@/assets/images/ssafy/mypage/profile.svg';
import { Lock } from 'lucide-react';

interface Channel {
  id: string;
  type: string;
  display_name: string;
}

const SelectChannel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user_id, team_id, token, setChannel_id } = useShareInfoStore();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [selectionError, setSelectionError] = useState('');

  const getChannels = async () => {
    try {
      const response = await apiClient.post(`/api/share/mm/channel`, {
        user_id: user_id,
        token: token,
        team_id: team_id,
      });
      setChannels(response.data.data.channels);
    } catch (error) {
      console.error('채널 로딩 중 오류가 발생했습니다:', error);
    }
  };

  const handleNext = () => {
    if (!selectedChannel) {
      setSelectionError('채널을 선택하지 않았습니다');
      return;
    }
    setSelectionError('');
    setChannel_id(selectedChannel.id);
    navigate(`/ssafy/mypage/share/${id}/message`);
  };

  useEffect(() => {
    getChannels();
  }, []);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <DocsDescription
        title={'공유할 채널을 선택해주세요!'}
        subTitle={''}
        description={'채널을 선택해주세요'}
      />
      {selectionError && (
        <p className="mt-1 text-sm text-red-500">{selectionError}</p>
      )}
      <div className="my-4 flex-1 overflow-y-auto rounded-lg">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className={`mb-2 flex cursor-pointer items-center gap-x-4 rounded-lg p-4 ${selectedChannel?.id === channel.id ? 'bg-primary-100' : 'bg-white'}`}
            onClick={() => {
              setSelectedChannel(channel);
              setSelectionError('');
            }}
          >
            <img
              src={profile}
              alt="channel"
              className="h-10 w-10 rounded-full"
            />
            <div>
              <div className="flex items-center gap-1 text-lg">
                {channel.type === 'P' && <Lock size={16} />}
                {channel.display_name}
              </div>
              <div className="text-sm text-gray-500">
                {channel.type === 'P' ? 'Private Channel' : 'Public Channel'}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mb-20">
        <atoms.LongButton onClick={handleNext}>다음</atoms.LongButton>
      </div>
    </div>
  );
};

export default SelectChannel;
