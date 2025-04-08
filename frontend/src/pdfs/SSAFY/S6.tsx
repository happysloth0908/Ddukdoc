import { useS6Data } from '@/store/docs';

export const S6 = () => {
  const { data, signature } = useS6Data();
  const date = new Date();
  const dateData = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  }

    return (
        <div className="max-h-[55vh] overflow-scroll border border-black p-4 text-xs leading-relaxed text-gray-900">
        <h1 className="text-center text-xl font-bold mb-8 underline">삼성청년 SW 아카데미 교육결과물 활용 동의서</h1>

        <ol className="list-decimal pl-6 space-y-4 mb-8">
            <li className="leading-relaxed">
                "삼성 청년 소프트웨어 아카데미(Samsung SW Academy For Youth)" (이하 "SSAFY")가 본인이 "SSAFY 교육 중 수행한 프로젝트의 결과물(코드, UCC, 발표 자료 및 기타 인터뷰 영상 등 모두 포함, 이하 총칭하여 "결과물 등")을 SSAFY 교육(후배 기수 교육을 위한 교보재 등재, 강의자료 활용 등 포함), 행사, 홍보 시 활용하는 것에 동의합니다.
            </li>
            <li className="leading-relaxed">
                결과물 등이 제 3자의 저작권 등 타인의 권리를 침해하지 않음을 보증하며, 결과물 등이 활용과정에서 수정/편집/복제될 수 있음을 인지하였습니다.
            </li>
            <li className="leading-relaxed">
                SSAFY는 결과물 등 양도 시 경우에 따라 본인의 성명, 소속, 팀명 등을 표기할 수 있습니다.
            </li>
        </ol>

        <p className="mb-8 pl-4">- SSAFY 공통 프로젝트 결과인 "{data.project_name ? data.project_name : <span className="border-b border-gray-400 inline-block w-8"></span>}"과 관련된 전체 결과물</p>

        <div className="text-center space-y-4 mb-8">
            <p className="font-medium">본인은 위 내용을 확인하고 동의합니다.</p>
            <p>2025 년 {dateData.month} 월 {dateData.day} 일</p>
            <div className="flex relative justify-center items-center flex-wrap gap-2 mt-6">
                <span>생년월일 : </span>
                {data.birth ? data.birth.replace(/-/g, '.') : <span className="inline-block w-8 border-b border-gray-800"></span>}
                <span className="ml-4">성 명 : </span>
                {data.name ? data.name : <span className="inline-block w-8 border-b border-gray-800"></span>}
                <span className="ml-2">(날인/서명)</span>
                {signature ? <img src={signature} className='absolute w-12 right-6' /> : null}
            </div>
        </div>

        <div className="text-center mt-12 space-y-2">
            <p className="font-bold">주식회사 멀티캠퍼스 귀중</p>
            <p className="text-[8px] text-gray-600">※ 본 서약서는 회사의 규정된 절차에 의해 스캔하여 파일형태로 보관됩니다.</p>
        </div>
    </div>     
    );
};
