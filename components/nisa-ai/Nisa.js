'use client';
// import CustomImage from "@/lib/reusable/CustomImage";
// import { useStrikeoTheme } from "@/lib/utils/useStrikeoTheme";
import { Environment } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import dynamic from 'next/dynamic';
import React, { useCallback, useState } from 'react';
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

  // WebGL only auto-restores a lost context if the `webglcontextlost`
  // handler calls preventDefault(). react-three-fiber doesn't do this for
  // us, so without it the avatar goes blank forever after a context loss.
  // On restore, remount the canvas so three.js/drei re-upload all GPU
  // resources (textures, geometries) from a clean slate.
  const [canvasKey, setCanvasKey] = useState(0);

  const handleCreated = useCallback(({ gl }) => {
    const canvasEl = gl.domElement;

    const handleContextLost = (event) => {
      event.preventDefault();
      console.warn('Nisa 3D avatar: WebGL context lost, recovering...');
    };
    const handleContextRestored = () => {
      setCanvasKey((prev) => prev + 1);
    };

    canvasEl.addEventListener('webglcontextlost', handleContextLost, false);
    canvasEl.addEventListener(
      'webglcontextrestored',
      handleContextRestored,
      false
    );
  }, []);

  return (
    <Canvas
      key={canvasKey}
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
      onCreated={handleCreated}
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
