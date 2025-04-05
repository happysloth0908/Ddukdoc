import { Routes, Route } from 'react-router-dom';
import { DocsWriteData} from './S1WriteDetails/DocsWriteData';
import { DocsWriteSignature } from './S1WriteDetails/DocsWriteSignature';

export const DocsWriteDetail = () => {

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Routes>
        <Route
          path="S1"
          element={
            <DocsWriteData />
          }
        />
        <Route
          path="S1/signature"
          element={<DocsWriteSignature />}
        />
      </Routes>
    </div>
  );
};
