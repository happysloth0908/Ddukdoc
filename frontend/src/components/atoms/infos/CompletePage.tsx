import DefaultImages from '@/assets/images/default';

interface CompletePageProps {
  type: string;
}

export const CompletePage = ({ type }: CompletePageProps) => {
  const value = {
    imageUrl: DefaultImages.CheckIcon,
    title: '',
    context: '',
  };
  if (type === 'share') {
    value.title = '공유가 완료되었습니다';
    value.context = '작성하신 문서를 안전하게 암호화 해서 저장했어요';
  } else if (type === 'save') {
    value.title = '저장이 완료되었습니다';
    value.context = '작성하신 문서를 안전하게 암호화 해서 저장했어요';
  } else {
    return <div>CompletePage 인자 에러!</div>;
  }
  return (
    <div className="flex max-w-56 flex-col items-center justify-center gap-8 text-text-default">
      <img className="h-32 w-32" src={value.imageUrl} alt={value.title} />
      <div className="flex flex-col items-center justify-center gap-2">
        <p className="text-info-large font-bold">{value.title}</p>
        <p className="w-4/5 break-keep text-center text-xl">{value.context}</p>
      </div>
    </div>
  );
};
