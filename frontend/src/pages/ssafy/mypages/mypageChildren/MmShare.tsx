import { Route, Routes } from 'react-router-dom';
import MmLogin from './mmChildren/mmLogin';
import SelectTarget from './mmChildren/SelectTarget';
import SelectPerson from './mmChildren/SelectPerson';
import SelectTeam from './mmChildren/SelectTeam';
import SelectMessage from './mmChildren/SelectMessage';
import SelectChannel from './mmChildren/SelectChannel';

const MmShare = () => {
  return (
    <Routes>
      <Route index element={<MmLogin />} />
      <Route path="select" element={<SelectTarget />} />
      <Route path="personal" element={<SelectPerson />} />
      <Route path="team" element={<SelectTeam />} />
      <Route path="channel" element={<SelectChannel />} />
      <Route path="message" element={<SelectMessage />} />
    </Routes>
  );
};

export default MmShare;
