// // components/Viewer.tsx
// import { Canvas } from '@react-three/fiber';
// import { Environment, OrbitControls, useGLTF } from '@react-three/drei';
// import { Suspense } from 'react';

// function Model() {
//   const bitcoin = useGLTF('/assets/three/bitcoin.glb'); // public/models/에 넣어두면 됨
//   const block = useGLTF('/assets/three/block/scene.gltf'); // public/models/에 넣어두면 됨
  
//   if(true) {
//     return <primitive object={bitcoin.scene} scale={2} />;
//   } else {
//     return <primitive object={block.scene} scale={0.02} />;
//   }
// }

// export const Viewer = () => {
//   return (
//     <div className="my-7 h-1/2 w-full">
//       <Canvas>
//             <Suspense fallback={null}>
//                 <ambientLight intensity={1.5} />
//                 <directionalLight position={[-2, 5, 2]} intensity={1} />
//                 <Environment preset="sunset" />
//                 <Model />
//                 <OrbitControls enableZoom={true} />
//             </Suspense>
//         </Canvas>
//     </div>
//   );
// };


// components/Viewer.tsx
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense, useState } from 'react';

function Model( {showBitcoin}: {showBitcoin: boolean} ) {
  const bitcoin = useGLTF('/assets/three/bitcoin.glb');
  const block = useGLTF('/assets/three/block/scene.gltf');
  
  if(showBitcoin) {
    return <primitive object={bitcoin.scene} scale={2} />;
  } else {
    return <primitive object={block.scene} scale={0.015} />;
  }
}

export const Viewer = () => {
  const [showBitcoin, setShowBitcoin] = useState(true);
  
  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 grid grid-cols-2 items-center justify-center">
        <button 
          onClick={() => setShowBitcoin(true)}
          className={`mr-2 px-4 py-2 rounded-l-lg ${showBitcoin ? 'bg-blue-300 font-bold' : 'bg-gray-200'}`}
        >
          비트코인
        </button>
        <button 
          onClick={() => setShowBitcoin(false)}
          className={`px-4 py-2 rounded-r-lg ${!showBitcoin ? 'bg-blue-300 font-bold' : 'bg-gray-200'}`}
        >
          블록
        </button>
      </div>
      
      <div className="my-7 h-96 w-full">
        <Canvas>
          <Suspense fallback={null}>
            <ambientLight intensity={1.5} />
            <directionalLight position={[-2, 5, 2]} intensity={1} />
            <Environment preset="sunset" />
            <Model showBitcoin={showBitcoin} />
            <OrbitControls enableZoom={true} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};