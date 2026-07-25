import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

import { useGLTF } from '@react-three/drei';

function ExternalModel() {
  const groupRef = useRef();
  
  // The user will place their 3D file at public/tshirt.glb
  // We use useGLTF to load it. If it's missing, it will suspend/fail gracefully if handled,
  // but we assume the user will add it.
  try {
    const { scene } = useGLTF('/tshirt.glb');
    
    useFrame((state) => {
      if (groupRef.current) {
        // Revolving animation
        groupRef.current.rotation.y = state.clock.elapsedTime * 0.25;
        // Subtle floating up and down
        groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
      }
    });

    return (
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
        <group ref={groupRef} scale={1.2} position={[0, -0.1, 0]}>
          <primitive object={scene} />
        </group>
      </Float>
    );
  } catch (err) {
    // Fallback if the model isn't uploaded yet
    return (
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#7c3aed" wireframe />
        </mesh>
      </Float>
    );
  }
}

// Preload the model so it doesn't pop in (optional, but good practice)
useGLTF.preload('/tshirt.glb');

function FloatingOrbs() {
  const orbs = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 7,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5 - 2,
      ],
      scale: 0.04 + Math.random() * 0.1,
      speed: 0.2 + Math.random() * 0.6,
      color: ['#7c3aed', '#ec4899', '#06b6d4', '#a78bfa', '#f472b6'][i % 5],
    })), []);

  return orbs.map((orb, i) => (
    <Float key={i} speed={orb.speed} rotationIntensity={0} floatIntensity={2}>
      <mesh position={orb.position}>
        <sphereGeometry args={[orb.scale, 24, 24]} />
        <meshStandardMaterial
          color={orb.color}
          emissive={orb.color}
          emissiveIntensity={2}
          transparent
          opacity={0.5}
          metalness={1}
          roughness={0}
        />
      </mesh>
    </Float>
  ));
}

function GlowRing() {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = Math.PI / 2;
      ref.current.rotation.z = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <mesh ref={ref} position={[0, -0.1, 0]}>
      <torusGeometry args={[2.8, 0.015, 16, 100]} />
      <meshStandardMaterial
        color="#7c3aed"
        emissive="#7c3aed"
        emissiveIntensity={3}
        transparent
        opacity={0.3}
        metalness={1}
        roughness={0}
      />
    </mesh>
  );
}

export default function TShirtScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 42 }}
      style={{ width: '100%', height: '100%' }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      shadows
    >
      <color attach="background" args={['transparent']} />
      
      <directionalLight position={[5, 5, 5]} intensity={2.5} color="#ffffff" castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-4, 3, 3]} intensity={1.5} color="#93c5fd" />
      <spotLight position={[-4, 4, 6]} intensity={50} color="#7c3aed" angle={0.4} penumbra={0.8} distance={15} castShadow />
      <spotLight position={[4, -2, 6]} intensity={40} color="#ec4899" angle={0.5} penumbra={0.7} distance={12} />
      <spotLight position={[0, 5, 4]} intensity={30} color="#06b6d4" angle={0.6} penumbra={0.9} distance={10} />
      <pointLight position={[0, 0, -4]} intensity={5} color="#a78bfa" distance={12} />
      <ambientLight intensity={0.5} />

      <ExternalModel />
      <FloatingOrbs />
      <GlowRing />

      <ContactShadows position={[0, -2.2, 0]} opacity={0.4} scale={8} blur={2.5} far={4} color="#7c3aed" />
    </Canvas>
  );
}
