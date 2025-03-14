// import { useState } from 'react';
import { Button } from './stories/Button'
import { postRegister } from './apis/auth';

const { worker } = await import('./mocks/browser')

if (import.meta.env.VITE_NODE_ENV === "development") {
  worker.start();
}

function App() {
  const test = async () => {
    const res = await postRegister();
    console.log(res);
  };

  return (
    <div>
      test
      <Button onClick={test} label='버튼 테스트' />
    </div>
  );
}

export default App;
