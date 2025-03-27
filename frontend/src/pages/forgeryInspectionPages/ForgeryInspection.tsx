import { Routes, Route } from 'react-router-dom';
import forgeryInspectionChildren from './forgeryInspectionChildren';
export const ForgeryInspection = () => {
  return (
    <div className="relative flex flex-1">
      <Routes>
        <Route index element={<forgeryInspectionChildren.FileUpload />} />
      </Routes>
    </div>
  );
};
