import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import docsWriteChildren from "./docsWriteChildren";

export const DocsWrite = () => {
  const [templateCode, setTemplateCode] = useState<string>('G1');
  const [role, setRole] = useState('채권자');

  return (
    <Routes>
      <Route index element={<docsWriteChildren.DocsChoose templateCode={templateCode} onTemplateCode={setTemplateCode} />} />
      <Route path='check' element={<docsWriteChildren.DocsCheck curTemplate={templateCode} role={role} />} />
      <Route path='role' element={<docsWriteChildren.DocsRoleChoose templateCode={templateCode} role={role} onRole={setRole} />} />
      <Route path='detail/*' element={<docsWriteChildren.DocsWriteDetail role={role} />}/>
      <Route path='share' element={<docsWriteChildren.DocsShareComplete />} />
    </Routes>
  );
};