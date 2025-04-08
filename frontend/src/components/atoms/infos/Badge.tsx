interface BadgeProps {
  type: string;
  title?: string;
}

export const Badge = ({ type, title }: BadgeProps) => {
  // 차용증, 근로계약서
  if (type === 'G1' || type === 'G2') {
    return (
      <div className="flex w-14 items-center justify-center rounded-md border border-secondary-g2 bg-secondary-g1">
        <span className="text-[10px] font-bold text-secondary-g3">{title}</span>
      </div>
    );
  }

  if (
    type === 'S1' ||
    type === 'S2' ||
    type === 'S3' ||
    type === 'S4' ||
    type === 'S5' ||
    type === 'S6'
  ) {
    const badgeTitle = {
      S1: '노트북 반출서약서',
      S2: '노트북 수령확인서',
      S3: '출결 확인서',
      S4: '출결 변경요청서',
      S5: '소스코드 반출 요청서',
      S6: '프로젝트 활용 동의서',
    }[type];

    return (
      <div className="flex w-1/2 items-center justify-center rounded-md border border-secondary-g2 bg-secondary-g1">
        <span className="text-[10px] font-bold text-secondary-g3">
          {badgeTitle}
        </span>
      </div>
    );
  }

  // 서명 대기
  else if (type === '서명 대기') {
    return (
      <div className="flex w-14 items-center justify-center rounded-md border border-gray-400 bg-gray-100">
        <span className="text-[10px] font-bold text-[#4F4F4F]">서명 대기</span>
      </div>
    );
  }
  // 반송
  else if (type === '반송') {
    return (
      <div className="flex w-14 items-center justify-center rounded-md border border-secondary-y2 bg-[#FFF3C2]">
        <span className="text-[10px] font-bold text-[#4F4F4F]">반송</span>
      </div>
    );
  }
  // 나머지
  else {
    return null;
  }
};
