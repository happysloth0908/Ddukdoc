import { Route, Routes } from 'react-router-dom';
import DocCheck from './DocDetailChildren/DocCheck';
import InfoInput from './DocDetailChildren/InfoInput';
import iouData from '@/types/iou';
import { useIOUDocsStore } from '@/store/docs';
import SignPage from './DocDetailChildren/SignPage';
import FinalCheck from './DocDetailChildren/FinalCheck';

const DocDetail = () => {
  const { setData, recipientRoleId } = useIOUDocsStore();

  const handleData = (newData: Partial<iouData>) => {
    setData(newData);
  };
  return (
    <Routes>
      <Route index element={<DocCheck />} />
      <Route
        path="input"
        element={<InfoInput role={recipientRoleId} handleData={handleData} />}
      />
      <Route path="signature" element={<SignPage role={recipientRoleId} />} />
      <Route path="check" element={<FinalCheck role={recipientRoleId} />} />
    </Routes>
  );
};

export default DocDetail;
