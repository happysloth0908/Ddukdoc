import { ProgressBar } from '@/components/atoms/infos/ProgressBar.tsx';

// 문서 정보 입력하는거. 이거 어떻게 해야할지 한 번 고민좀...
// 이 안에서 각 컴포넌트가 바뀌고 그에 따라서 프로그레스바의 curStage를 useState로 바꿔주면 되지않을까?
const DocInfoInput = () => {
  return (
    <div>
      <ProgressBar curStage={1} totalStage={4} />
    </div>
  );
};

export default DocInfoInput;
