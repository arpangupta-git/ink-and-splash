import { useState, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows, OrbitControls, useGLTF, Decal } from '@react-three/drei';
import { HiArrowLeft } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

function ExternalModel({ color, decalUrl, decalProps }) {
  const { nodes, materials } = useGLTF('/tshirt.glb');
  
  const meshNode = useMemo(() => Object.values(nodes).find(n => n.type === 'Mesh' || n.isMesh), [nodes]);
  const originalMaterial = useMemo(() => Object.values(materials)[0], [materials]);
  
  const material = useMemo(() => {
    if (!originalMaterial) return new THREE.MeshPhysicalMaterial();
    // Upgrade the material to look polished and premium
    const mat = new THREE.MeshPhysicalMaterial({
      color: originalMaterial.color,
      map: originalMaterial.map,
      normalMap: originalMaterial.normalMap,
      roughness: 0.3,
      metalness: 0.1,
      clearcoat: 0.2,
      clearcoatRoughness: 0.1,
    });
    return mat;
  }, [originalMaterial]);

  useFrame((state, delta) => {
    if (material) {
      material.color.lerp(new THREE.Color(color), 0.1);
    }
  });

  const [decalTexture, setDecalTexture] = useState(null);
  useEffect(() => {
    if (decalUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(decalUrl, (texture) => {
        texture.anisotropy = 16;
        setDecalTexture(texture);
      });
    } else {
      setDecalTexture(null);
    }
  }, [decalUrl]);

  if (!meshNode) return null;

  return (
    <group position={[0, -0.4, 0]} scale={[2.5, 2.5, 2.5]}>
      <mesh
        castShadow
        receiveShadow
        geometry={meshNode.geometry}
        material={material}
        dispose={null}
      >
        {decalTexture && (
          <Decal 
            position={[decalProps.x, decalProps.y, 0.15]} 
            rotation={[0, 0, 0]} 
            scale={decalProps.scale} 
            map={decalTexture}
          />
        )}
      </mesh>
    </group>
  );
}

useGLTF.preload('/tshirt.glb');

export default function Designer() {
  const [color, setColor] = useState('#ffffff');
  const [decalUrl, setDecalUrl] = useState(null);
  const colors = ['#ffffff', '#0a0a0a', '#7c3aed', '#ec4899', '#06b6d4', '#ef4444', '#f59e0b', '#10b981'];
  const navigate = useNavigate();

  const [decalProps, setDecalProps] = useState({ scale: 0.15, x: 0, y: 0.04 });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setDecalUrl(url);
    }
  };

  const handleDownloadSnapshot = () => {
    const canvas = document.querySelector('.tshirt-canvas canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.setAttribute('download', 'custom-tshirt.png');
      link.setAttribute('href', canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'));
      link.click();
    }
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', backgroundColor: '#050505', overflow: 'hidden' }}>
      {/* Top Bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <button onClick={() => navigate('/')} className="btn-secondary hover-target" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '50px' }}>
          <HiArrowLeft /> Back to Home
        </button>
        <h2 style={{ color: 'white', margin: 0, fontSize: '1.5rem', fontFamily: 'var(--font-heading)' }}>3D Designer</h2>
        <div style={{ width: '120px' }}></div> {/* Spacer */}
      </div>

      <Canvas
        className="tshirt-canvas hover-target"
        camera={{ position: [0, 0, 2.2], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        shadows
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={2.5} color="#ffffff" castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[-4, 3, 3]} intensity={1.5} color="#3b82f6" />
        <directionalLight position={[0, 2, -5]} intensity={2} color="#ffffff" />
        
        <spotLight position={[-4, 4, 6]} intensity={30} color="#7c3aed" angle={0.4} penumbra={0.8} />
        
        <Suspense fallback={null}>
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
            {/* Moved up and completely visible */}
            <group position={[0, 0.1, 0]} scale={[1.4, 1.4, 1.4]}>
              <ExternalModel color={color} decalUrl={decalUrl} decalProps={decalProps} />
            </group>
          </Float>
        </Suspense>

        <ContactShadows position={[0, -0.8, 0]} opacity={0.4} scale={4} blur={3} far={4} color="#7c3aed" />
        <OrbitControls enableZoom={true} minDistance={1} maxDistance={4} enablePan={false} />
      </Canvas>

      {/* Horizontal Dock UI */}
      <div className="customizer-ui" style={{
        position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(15,15,15,0.7)', backdropFilter: 'blur(20px)', padding: '15px 30px',
        borderRadius: '100px', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '30px',
        border: '1px solid rgba(255,255,255,0.1)', zIndex: 10, width: 'max-content', maxWidth: '95vw',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)', flexWrap: 'wrap', justifyContent: 'center'
      }}>
        
        {/* Colors */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Color</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {colors.map(c => (
              <button 
                key={c}
                className="hover-target"
                onClick={() => setColor(c)}
                style={{
                  width: '28px', height: '28px', borderRadius: '50%', background: c,
                  border: color === c ? '2px solid white' : '2px solid transparent',
                  cursor: 'pointer', outline: 'none', transition: 'all 0.2s',
                  boxShadow: color === c ? '0 0 10px rgba(255,255,255,0.5)' : 'none'
                }}
              />
            ))}
          </div>
        </div>

        {/* Sliders */}
        {decalUrl && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '25px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Size</label>
              <input type="range" min="0.05" max="0.5" step="0.01" value={decalProps.scale} onChange={(e) => setDecalProps(p => ({...p, scale: parseFloat(e.target.value)}))} style={{ width: '80px', accentColor: '#7c3aed' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Pos Y</label>
              <input type="range" min="-0.2" max="0.3" step="0.01" value={decalProps.y} onChange={(e) => setDecalProps(p => ({...p, y: parseFloat(e.target.value)}))} style={{ width: '80px', accentColor: '#7c3aed' }} />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '10px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '25px' }}>
          <label className="btn-secondary hover-target" style={{ padding: '10px 20px', fontSize: '0.9rem', cursor: 'pointer', margin: 0, borderRadius: '50px' }}>
            {decalUrl ? 'Change Logo' : 'Upload Logo'}
            <input type="file" accept="image/png, image/jpeg" style={{ display: 'none' }} onChange={handleFileUpload} />
          </label>
          <button className="btn-primary hover-target" onClick={handleDownloadSnapshot} style={{ padding: '10px 24px', fontSize: '0.9rem', margin: 0, borderRadius: '50px' }}>
            Save Design
          </button>
        </div>
      </div>
    </div>
  );
}
