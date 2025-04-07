import { Routes, Route } from 'react-router-dom';
import { SsafyMain } from './mainPages/SsafyMain';
import { DocsWrite } from './docsWritePages/DocsWrite';

function SsafyRouter() {
  return (
    <div className="h-full w-full">
      <Routes>
        <Route index element={<SsafyMain />} />
        <Route path="docs/*" element={<DocsWrite />} />
      </Routes>
    </div>
  );
}

export default SsafyRouter;
