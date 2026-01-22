'use client';
// import CustomImage from "@/lib/reusable/CustomImage";
// import { useStrikeoTheme } from "@/lib/utils/useStrikeoTheme";
import { Environment } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import dynamic from 'next/dynamic';
import React from 'react';
const Nissa = dynamic(() => import('./model'), { ssr: false });

const NissaModel = () => {
  // const { isLight } = useStrikeoTheme();

  // if (isLight) {
  //   return (
  //     <CustomImage
  //       className="object-cover object-top w-full h-full  bg-viking-800 rounded-md dark:rounded-none"
  //       src="/image/nisa_white-skin.png"
  //       width={400}
  //       height={400}
  //       alt="clip"
  //     />
  //   );
  // }

  return (
    <Canvas
      id="storeCanvas"
      style={{
        width: '100%',
        height: '100%',
      }}
      camera={{
        fov: 35,
        position: [0, 0, 6],
      }}
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Environment
        files={'models/metro_noord_2k.hdr'}
        path="/"
        background={true}
        blur={0.2}
        environmentIntensity={0.8}
        backgroundIntensity={0.4}
        backgroundBlurriness={1}
      />
      <group position={[0, 0, 0]}>
        <Nissa position={[-0.4, -11.5, 0]} scale={4.5} />
      </group>
    </Canvas>
  );
};

export default React.memo(NissaModel);
