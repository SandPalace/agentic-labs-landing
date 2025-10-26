'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function FloatingGeometry({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const torusRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    console.log('[FloatingGeometry] Component mounted');
    return () => console.log('[FloatingGeometry] Component unmounted');
  }, []);

  useEffect(() => {
    console.log('[FloatingGeometry] Scroll progress updated:', scrollProgress);
    if (meshRef.current) {
      meshRef.current.rotation.x = scrollProgress * Math.PI * 2;
      meshRef.current.rotation.y = scrollProgress * Math.PI * 3;
      meshRef.current.position.y = Math.sin(scrollProgress * Math.PI * 2) * 2;
    }
    if (torusRef.current) {
      torusRef.current.rotation.x = scrollProgress * Math.PI * 4;
      torusRef.current.rotation.z = scrollProgress * Math.PI * 2;
    }
  }, [scrollProgress]);

  return (
    <group>
      {/* Main Box */}
      <mesh ref={meshRef} position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial
          color="#4f46e5"
          metalness={0.8}
          roughness={0.2}
          envMapIntensity={1}
        />
      </mesh>

      {/* Torus */}
      <mesh ref={torusRef} position={[3, 0, -2]} castShadow receiveShadow>
        <torusGeometry args={[1, 0.4, 16, 100]} />
        <meshStandardMaterial
          color="#ec4899"
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={1}
        />
      </mesh>

      {/* Sphere */}
      <mesh position={[-3, 1, -1]} castShadow receiveShadow>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color="#8b5cf6"
          metalness={0.7}
          roughness={0.3}
          envMapIntensity={1}
        />
      </mesh>

      {/* Ground plane for reflections */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

interface Scene3DProps {
  scrollProgress?: number;
  onLoaded?: () => void;
}

export default function Scene3D({ scrollProgress = 0, onLoaded }: Scene3DProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.debugLogs = window.debugLogs || [];
      window.debugLogs.push('[Scene3D] Component mounted at ' + new Date().toISOString());
    }
    console.log('[Scene3D] Component mounted, scrollProgress:', scrollProgress);
    return () => {
      console.log('[Scene3D] Component UNMOUNTING!!!');
      if (typeof window !== 'undefined') {
        window.debugLogs.push('[Scene3D] Component UNMOUNTED at ' + new Date().toISOString());
      }
    };
  }, []);

  useEffect(() => {
    console.log('[Scene3D] ScrollProgress prop changed:', scrollProgress);
  }, [scrollProgress]);

  return (
    <Canvas
      shadows
      className="w-full h-full"
      gl={{
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false
      }}
      dpr={[1, 2]}
      frameloop="always"
      onCreated={(state) => {
        console.log('[Scene3D] Canvas created successfully');
        if (typeof window !== 'undefined') {
          window.debugLogs = window.debugLogs || [];
          window.debugLogs.push('[Scene3D] Canvas created at ' + new Date().toISOString());
        }
        state.gl.setClearColor('#000000', 0);

        // Handle context loss
        const canvas = state.gl.domElement;
        canvasRef.current = canvas;

        const handleContextLost = (event: Event) => {
          console.error('[Scene3D] WebGL context lost!', event);
          event.preventDefault();
        };

        const handleContextRestored = () => {
          console.log('[Scene3D] WebGL context restored');
        };

        canvas.addEventListener('webglcontextlost', handleContextLost);
        canvas.addEventListener('webglcontextrestored', handleContextRestored);

        if (onLoaded) {
          onLoaded();
        }
      }}
    >
      <PerspectiveCamera makeDefault position={[0, 2, 10]} fov={50} />

      {/* Cinematic Lighting Setup */}
      <ambientLight intensity={0.2} />

      {/* Key Light */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Fill Light */}
      <directionalLight position={[-5, 3, -5]} intensity={0.5} color="#4f46e5" />

      {/* Rim Light */}
      <directionalLight position={[0, 5, -10]} intensity={0.8} color="#ec4899" />

      {/* Point lights for accent */}
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[5, 0, 5]} intensity={0.3} color="#06b6d4" />

      <FloatingGeometry scrollProgress={scrollProgress} />

      <Environment preset="city" />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
