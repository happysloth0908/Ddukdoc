import { apiClient } from '@/apis/ssafy/mypage';
import atoms from '@/components/atoms';
import { DocsDescription } from '@/components/atoms/infos/DocsDescription';
import { useShareInfoStore } from '@/store/mmStore';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import profile from '@/assets/images/ssafy/mypage/profile.svg';

interface User {
  id: string;
  username: string;
  nickname: string;
}

const SelectPerson = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, setReceiver_id } = useShareInfoStore();
  const [searchWord, setSearchWord] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectionError, setSelectionError] = useState('');

  const handleSearch = async () => {
    if (!searchWord.trim()) {
      setError('검색어는 필수입니다');
      setSelectionError('');
      return;
    }
    setError('');
    try {
      const response = await apiClient.post(`/api/share/mm/user`, {
        token: token,
        keyword: searchWord,
      });
      setUsers(response.data.data.users);
    } catch (error) {
      console.error('검색 중 오류가 발생했습니다:', error);
    }
  };

  const handleNext = () => {
    if (!selectedUser) {
      setSelectionError('사용자를 선택하지 않았습니다');
      setError('');
      return;
    }
    setSelectionError('');
    setReceiver_id(selectedUser.id);
    navigate(`/ssafy/mypage/share/${id}/message`);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <DocsDescription
        title={'공유할 사용자를 선택해주세요!'}
        subTitle={''}
        description={'사용자를 검색해주세요'}
      />
      <div className="relative mt-4">
        <atoms.Input
          value={searchWord}
          onChange={(e) => {
            setSearchWord(e.target.value);
            if (e.target.value.trim()) {
              setError('');
            }
          }}
          placeholder="이름을 입력하세요"
          className={`bg-white pr-10 ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <button
          onClick={handleSearch}
          className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center space-x-2 text-gray-600"
        >
          <span className="text-lg text-gray-400">|</span>{' '}
          <Search className="h-5 w-5" />
        </button>
      </div>
      {!selectionError && error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      {selectionError && (
        <p className="mt-1 text-sm text-red-500">{selectionError}</p>
      )}
      <div className="my-4 flex-1 overflow-y-auto rounded-lg">
        {users.map((user) => (
          <div
            key={user.id}
            className={`mb-2 flex cursor-pointer items-center gap-x-4 rounded-lg p-4 ${selectedUser?.id === user.id ? 'bg-primary-100' : 'bg-white'}`}
            onClick={() => {
              setSelectedUser(user);
              setError('');
              setSelectionError('');
            }}
          >
            <img
              src={profile}
              alt="profile"
              className="h-10 w-10 rounded-full"
            />
            <div className="text-lg">{user.nickname}</div>
          </div>
        ))}
      </div>
      <div className="mb-20">
        <atoms.LongButton onClick={handleNext}>다음</atoms.LongButton>
      </div>
    </div>
  );
};

export default SelectPerson;
