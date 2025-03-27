import atoms from "@/components/atoms"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { pdf } from "@react-pdf/renderer";
import { Documents } from "@/pdfs/Documents";

export const DocsCheck = ({ curTemplate }: { curTemplate: string }) => {

    // pdf 미리보기
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  
    useEffect(() => {
      const generatePdf = async () => {
        if (curTemplate === "G1") {
            const blob = await pdf(<Documents templateCode="G1" />).toBlob();
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
        } else if (curTemplate === "G2") {
            const blob = await pdf(<Documents templateCode="G2" />).toBlob();
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
        }
      };
  
      generatePdf();
    }, []);

    return (
        <div className="flex-1 flex flex-col">
            <div className="flex-1 flex flex-col gap-y-6 justify-center">
                <atoms.DocsDescription title="작성하실 문서입니다" subTitle="문서를" description="확인하고 다음을 눌러주세요!" />
                {pdfUrl ? (
                    <iframe
                    src={pdfUrl+"#toolbar=0&navpanes=0&scrollbar=0"}
                    className="w-full h-[600px]"
                    />
                ) : (
                    <p>PDF 생성 중...</p>
                )}
            </div>
            <Link to="/docs/role">
                <atoms.LongButton className='mb-20' children="다음" colorType='black' />
            </Link>
        </div>
    )
}