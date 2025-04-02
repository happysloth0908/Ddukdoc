import atoms from "@/components/atoms";
import { Link } from "react-router-dom";


export const DocsShareComplete = () => {


    return (
        <div className="h-full flex flex-col gap-y-6 overflow-hidden">
            <div className="flex flex-1 items-center justify-center">
                <atoms.CompletePage type="share" />
            </div>
            <Link to="/">
                <atoms.LongButton className='mb-20' children="문서 목록으로" colorType='black' />
            </Link>
        </div>
    );
}