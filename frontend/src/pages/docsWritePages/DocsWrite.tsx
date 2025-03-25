import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import docsWriteChildren from "./docsWriteChildren";

export const DocsWrite = () => {
  const [templateCode, setTemplateCode] = useState('G1');

  // 템플릿 코드 변경
  const handleTemplateCode = (code: string) => {
    setTemplateCode(code);
  }

  useEffect(() => {
    console.log("업데이트!", templateCode);
  }, [templateCode])

  return (
    <div className='flex-1 flex flex-col gap-y-6'>
      <Routes>
        <Route index element={<docsWriteChildren.DocsChoose templateCode={templateCode} onTemplateCode={handleTemplateCode} />} />
        <Route path='check' element={<docsWriteChildren.DocsCheck curTemplate={templateCode} />} />
        <Route path='role' element={<docsWriteChildren.DocsRoleChoose />} />
      </Routes>
    </div>
  );
};
