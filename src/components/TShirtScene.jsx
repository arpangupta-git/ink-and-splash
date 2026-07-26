import { useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, ContactShadows, OrbitControls, useGLTF, Decal, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';

function HeroModel() {
  const { nodes, materials } = useGLTF('./tshirt.glb');
  const spiderSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="#0a0a0a">
    <path d="M50 30 C 55 30 60 35 60 45 C 60 55 55 60 50 60 C 45 60 40 55 40 45 C 40 35 45 30 50 30 Z" />
    <path d="M48 45 L 20 20 M 48 48 L 15 40 M 48 51 L 20 70 M 48 54 L 35 85" stroke="#0a0a0a" stroke-width="4" fill="none" stroke-linecap="round" />
    <path d="M52 45 L 80 20 M 52 48 L 85 40 M 52 51 L 80 70 M 52 54 L 65 85" stroke="#0a0a0a" stroke-width="4" fill="none" stroke-linecap="round" />
  </svg>`;
  const spiderLogoUrl = "data:image/svg+xml;base64," + btoa(spiderSvg);
  const spiderLogo = useTexture(spiderLogoUrl);

  const meshNode = useMemo(() => Object.values(nodes).find(n => n.type === 'Mesh' || n.isMesh), [nodes]);
  const originalMaterial = useMemo(() => Object.values(materials)[0], [materials]);
  
  const material = useMemo(() => {
    if (!originalMaterial) return new THREE.MeshPhysicalMaterial();
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#dc2626'), // Spiderman Red
      map: originalMaterial.map,
      normalMap: originalMaterial.normalMap,
      roughness: 0.3,
      metalness: 0.1,
      clearcoat: 0.3,
      clearcoatRoughness: 0.1,
    });
    return mat;
  }, [originalMaterial]);

  if (!meshNode) return null;

  return (
    <group position={[0, -0.1, 0]} scale={[1.4, 1.4, 1.4]}>
      <mesh
        castShadow
        receiveShadow
        geometry={meshNode.geometry}
        material={material}
        dispose={null}
      >
        {/* Front Spider Logo */}
        <Decal position={[0, 0.05, 0.15]} rotation={[0, 0, 0]} scale={0.12} map={spiderLogo} />
        {/* Back Spider Logo */}
        <Decal position={[0, 0.05, -0.15]} rotation={[0, Math.PI, 0]} scale={0.12} map={spiderLogo} />
      </mesh>
    </group>
  );
}

useGLTF.preload('./tshirt.glb');

export default function TShirtScene() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        <Canvas
          className="tshirt-canvas hover-target"
          camera={{ position: [0, 0, 1.4], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          shadows
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 5, 5]} intensity={2.5} color="#ffffff" castShadow shadow-mapSize={[1024, 1024]} />
          <directionalLight position={[-4, 3, 3]} intensity={1.5} color="#3b82f6" />
          <directionalLight position={[0, 2, -5]} intensity={2} color="#ffffff" />
          <spotLight position={[-4, 4, 6]} intensity={30} color="#dc2626" angle={0.4} penumbra={0.8} />
          
          <Suspense fallback={null}>
            <HeroModel />
          </Suspense>

          <ContactShadows position={[0, -0.8, 0]} opacity={0.4} scale={3} blur={2.5} far={4} color="#dc2626" />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.5} />
        </Canvas>
      </div>
      
      <div className="tshirt-scene__btn-wrap">
        <button 
          onClick={() => navigate('/designer')}
          className="btn-primary hover-target"
          style={{ padding: '12px 24px', whiteSpace: 'nowrap', boxShadow: '0 10px 30px rgba(124, 58, 237, 0.4)' }}
        >
          Open 3D Designer
        </button>
      </div>
    </div>
  );
}
