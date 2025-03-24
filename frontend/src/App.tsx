// import { useState } from 'react';
import { postRegister } from './apis/auth';
import { BrowserRouter } from 'react-router-dom';

const { worker } = await import('./mocks/browser');

if (import.meta.env.VITE_NODE_ENV === 'development') {
  worker.start();
}

function App() {
  return;
  <BrowserRouter>
    <div></div>;
  </BrowserRouter>;
}

export default App;
