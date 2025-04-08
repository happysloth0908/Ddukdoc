import { Routes, Route } from 'react-router-dom';
import { DocsWriteData} from './S1WriteDetails/DocsWriteData';
import { DocsWriteSignature } from './S1WriteDetails/DocsWriteSignature';

export const DocsWriteDetail = ({curTemplate}: {curTemplate: string}) => {

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Routes>
        <Route
          path={curTemplate}
          element={
            <DocsWriteData />
          }
        />
        <Route
          path={curTemplate + "/signature"}
          element={<DocsWriteSignature curTemplate={curTemplate} />}
        />
      </Routes>
    </div>
  );
};
