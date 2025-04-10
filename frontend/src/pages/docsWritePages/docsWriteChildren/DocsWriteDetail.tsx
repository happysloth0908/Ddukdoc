import { Routes, Route, useNavigate } from 'react-router-dom';
import { DocsWriteSender } from './IOUWriteDetails/DocsWriteSender';
import { DocsWriteMoney } from './IOUWriteDetails/DocsWriteMoney';
import { DocsWriteRate } from './IOUWriteDetails/DocsWriteRate';
import { DocsWriteBank } from './IOUWriteDetails/DocsWriteBank';
import { DocsWriteSpecial } from './IOUWriteDetails/DocsWriteSpecial';
import { DocsWriteSignature } from './IOUWriteDetails/DocsWriteSignature';

import { useIOUDocsStore } from '@/store/docs';
import iouData from '@/types/iou';
import { useEffect } from 'react';

export const DocsWriteDetail = ({ templateCode, role }: { templateCode: string, role: string }) => {
  const { data, setData } = useIOUDocsStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (templateCode == '') {
      navigate("/", { replace: true });
    }
  }, []);

  const updateIOUData = (newData: Partial<iouData>) => {
    const updatedData = { ...data, ...newData };
    setData(updatedData);
    console.log('🟢 IOU 데이터 업데이트됨:', updatedData);
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Routes>
        <Route
          path="G1"
          element={
            <DocsWriteSender
              role={role}
              data={data}
              handleData={updateIOUData}
            />
          }
        />
        <Route
          path="G1/money"
          element={
            <DocsWriteMoney
              data={data}
              handleData={updateIOUData}
            />
          }
        />
        <Route
          path="G1/rate"
          element={
            <DocsWriteRate
              data={data}
              handleData={updateIOUData}
            />
          }
        />
        <Route
          path="G1/bank"
          element={
            <DocsWriteBank
              data={data}
              handleData={updateIOUData}
            />
          }
        />
        <Route
          path="G1/special"
          element={
            <DocsWriteSpecial
              data={data}
              handleData={updateIOUData}
            />
          }
        />
        <Route
          path="G1/signature"
          element={<DocsWriteSignature role={role} />}
        />
      </Routes>
    </div>
  );
};
