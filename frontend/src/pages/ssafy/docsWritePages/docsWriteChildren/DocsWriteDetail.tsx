import { Routes, Route, useParams } from 'react-router-dom';
import { S1WriteData } from './S1WriteDetails/S1WriteData';
import { S6WriteData } from './S6WriteDetails/S6WriteData';
import { DocsWriteSignature } from './S1WriteDetails/DocsWriteSignature';

export const DocsWriteDetail = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Routes>
        <Route
          index
          element={ id === "S1" ?
            <S1WriteData /> :
            <S6WriteData />
          }
        />
        <Route
          path="signature"
          element={<DocsWriteSignature curTemplate={id || ""} />}
        />
      </Routes>
    </div>
  );
};
