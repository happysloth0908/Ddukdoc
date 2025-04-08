// components/Viewer.tsx
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense } from 'react';

function Model() {
  const { scene } = useGLTF('/assets/three/bitcoin.glb'); // public/models/에 넣어두면 됨
  return <primitive object={scene} scale={3} />;
}

export const Viewer = () => {
  return (
    <div className="my-7 h-1/2 w-full">
      <Canvas>
            <Suspense fallback={null}>
                <ambientLight intensity={1.5} />
                <directionalLight position={[-2, 5, 2]} intensity={1} />
                <Environment preset="sunset" />
                <Model />
                <OrbitControls enableZoom={true} />
            </Suspense>
        </Canvas>
    </div>
  );
};
