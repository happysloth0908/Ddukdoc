import { useLocation } from 'react-router-dom';
import SsafyS1DocPatch from './docPatchChildren/SsafyS1DocPatch';
import SsafyS6DocPatch from './docPatchChildren/SsafyS6DocPatch';

interface LocationState {
  templateCode: string;
}

const SsafyDocPatch = () => {
  const location = useLocation();
  const state = location.state as LocationState;

  const renderDocPatch = () => {
    switch (state?.templateCode) {
      case 'S1':
        return <SsafyS1DocPatch />;
      case 'S6':
        return <SsafyS6DocPatch />;
      default:
        return <div>지원하지 않는 문서 양식입니다.</div>;
    }
  };

  return <>{renderDocPatch()}</>;
};

export default SsafyDocPatch;
