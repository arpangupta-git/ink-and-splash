import { useState, useMemo, useEffect, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows, OrbitControls, useGLTF, Decal } from '@react-three/drei';
import { HiOutlineArrowLeft, HiOutlinePlus, HiOutlineTrash, HiOutlineMagnifyingGlassPlus, HiOutlineMagnifyingGlassMinus, HiOutlineArrowsRightLeft, HiOutlineEye, HiOutlinePencilSquare } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import DesignerTour from '../components/DesignerTour';
import './Designer.css';

// --------------------------------------------------------------------------------------------------
// Subcomponent for each Decal Layer
// --------------------------------------------------------------------------------------------------
function DecalLayer({ decal, isActive, isHidden }) {
  const [texture, setTexture] = useState(null);
  
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(decal.url, (tex) => {
      tex.anisotropy = 16;
      tex.colorSpace = THREE.SRGBColorSpace;
      setTexture(tex);
    });
  }, [decal.url]);

  if (!texture) return null;

  // Determine projection rotation automatically based on Z coordinate (positive Z = front, negative Z = back)
  const sideRotation = decal.z > 0 ? 0 : Math.PI;

  return (
    <Decal 
      position={[decal.x, decal.y, decal.z]} 
      rotation={[0, sideRotation, 0]} 
      // Limit depth scale to 0.1 so it doesn't pierce through to the other side of the shirt!
      scale={[decal.scale * decal.aspectRatio, decal.scale, 0.1]} 
      map={texture}
      emissive={isActive ? "#ffffff" : "#000000"}
      emissiveIntensity={isActive ? 0.1 : 0}
      visible={!isHidden}
    />
  );
}

// --------------------------------------------------------------------------------------------------
// Main T-Shirt Model (Handles Dragging)
// --------------------------------------------------------------------------------------------------
function ExternalModel({ color, decals, activeDecalId, activeDecal, setDecals, designerState }) {
  const { nodes, materials } = useGLTF('./tshirt.glb');
  
  const meshNode = useMemo(() => Object.values(nodes).find(n => n.type === 'Mesh' || n.isMesh), [nodes]);
  const originalMaterial = useMemo(() => Object.values(materials)[0], [materials]);
  
  const material = useMemo(() => {
    if (!originalMaterial) return new THREE.MeshPhysicalMaterial();
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

  const meshRef = useRef();
  const dragPlaneRef = useRef();
  const dragOffsetRef = useRef(new THREE.Vector3());
  const [dragging, setDragging] = useState(false);
  const [activeTexture, setActiveTexture] = useState(null);

  // Preload proxy texture
  useEffect(() => {
    if (activeDecal) {
      new THREE.TextureLoader().load(activeDecal.url, (tex) => {
        tex.anisotropy = 16;
        tex.colorSpace = THREE.SRGBColorSpace;
        setActiveTexture(tex);
      });
    }
  }, [activeDecal]);

  // Helper to get intersection perfectly flat against the Decal plane
  const getPlaneIntersection = (ray, zDepth) => {
    if (!meshRef.current) return null;
    const isFront = zDepth > 0;
    const mathematicalPlane = new THREE.Plane(
      new THREE.Vector3(0, 0, isFront ? 1 : -1), 
      -(isFront ? 1 : -1) * zDepth
    );
    const localRay = ray.clone().applyMatrix4(meshRef.current.matrixWorld.clone().invert());
    const localPoint = new THREE.Vector3();
    const result = localRay.intersectPlane(mathematicalPlane, localPoint);
    return result ? localPoint : null;
  };

  // Core Drag Logic (Proxy Ghost Plane to maintain 60fps)
  const handlePointerDown = (e) => {
    if (designerState.mode === 'edit' && activeDecalId && meshRef.current && activeDecal) {
      e.stopPropagation();
      e.target.setPointerCapture(e.pointerId);
      setDragging(true);
      document.body.style.cursor = 'grabbing';
      
      if (dragPlaneRef.current) {
        const localPoint = getPlaneIntersection(e.ray, activeDecal.z);
        if (localPoint) {
          // Prevent center-snapping by capturing the offset
          const currentCenter = new THREE.Vector3(activeDecal.x, activeDecal.y, activeDecal.z);
          dragOffsetRef.current.copy(currentCenter).sub(localPoint);

          dragPlaneRef.current.position.copy(currentCenter);
          const sideRotation = activeDecal.z > 0 ? 0 : Math.PI;
          dragPlaneRef.current.rotation.set(0, sideRotation, 0);
        }
      }
    }
  };

  const handlePointerMove = (e) => {
    if (dragging && designerState.mode === 'edit' && activeDecalId && meshRef.current && activeDecal) {
      e.stopPropagation();
      if (dragPlaneRef.current) {
        const localPoint = getPlaneIntersection(e.ray, activeDecal.z);
        if (localPoint) {
          // Apply the offset so the logo moves exactly with the cursor 1:1
          const finalPoint = localPoint.clone().add(dragOffsetRef.current);
          dragPlaneRef.current.position.copy(finalPoint);
          const sideRotation = activeDecal.z > 0 ? 0 : Math.PI;
          dragPlaneRef.current.rotation.set(0, sideRotation, 0);
        }
      }
    }
  };

  const handlePointerUp = (e) => {
    if (dragging) {
      e.stopPropagation();
      e.target.releasePointerCapture(e.pointerId);
      setDragging(false);
      document.body.style.cursor = 'auto';
      // Bake the final position back to the heavy DecalGeometry
      if (meshRef.current && e.ray && activeDecal) {
        const localPoint = getPlaneIntersection(e.ray, activeDecal.z);
        if (localPoint) {
          const finalPoint = localPoint.clone().add(dragOffsetRef.current);
          setDecals(prev => prev.map(d => d.id === activeDecalId ? { ...d, x: finalPoint.x, y: finalPoint.y } : d));
        }
      }
    }
  };

  if (!meshNode) return null;

  return (
    <group 
      position={[0, 0, 0]} 
      scale={[designerState.zoom, designerState.zoom, designerState.zoom]}
      rotation={[0, designerState.mode === 'edit' && designerState.view === 'back' ? Math.PI : 0, 0]}
    >
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        geometry={meshNode.geometry}
        material={material}
        dispose={null}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {decals.map(decal => (
          <DecalLayer 
            key={decal.id} 
            decal={decal} 
            isActive={decal.id === activeDecalId && designerState.mode === 'edit'} 
            isHidden={dragging && decal.id === activeDecalId}
          />
        ))}

        {/* The Proxy Drag Plane */}
        <mesh 
          ref={dragPlaneRef} 
          visible={dragging && activeTexture !== null} 
          scale={activeDecal ? [activeDecal.scale * activeDecal.aspectRatio, activeDecal.scale, 1] : [0.15, 0.15, 1]}
          onUpdate={(m) => { m.raycast = () => null; }}
        >
           <planeGeometry args={[1, 1]} />
           <meshBasicMaterial map={activeTexture} transparent depthTest={false} opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      </mesh>
    </group>
  );
}

useGLTF.preload('./tshirt.glb');

// --------------------------------------------------------------------------------------------------
// Master Designer Page
// --------------------------------------------------------------------------------------------------
export default function Designer() {
  const navigate = useNavigate();

  // Core State
  const [color, setColor] = useState('#ffffff');
  const [decals, setDecals] = useState([]);
  const [activeDecalId, setActiveDecalId] = useState(null);
  
  // App Modes
  const [designerState, setDesignerState] = useState({
    mode: 'edit', // 'edit' or 'preview'
    view: 'front', // 'front' or 'back'
    zoom: 1.3,
  });

  const colors = ['#ffffff', '#0a0a0a', '#7c3aed', '#ec4899', '#06b6d4', '#ef4444', '#f59e0b', '#10b981'];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const newDecal = {
          id: Date.now(),
          url,
          x: 0,
          y: 0.04,
          z: designerState.view === 'front' ? 0.15 : -0.15,
          scale: 0.15,
          side: designerState.view, // Add to whatever side we are currently looking at
          aspectRatio,
        };
        setDecals(prev => [...prev, newDecal]);
        setActiveDecalId(newDecal.id);
      };
      img.src = url;
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

  // Helper for active decal
  const activeDecal = decals.find(d => d.id === activeDecalId);

  return (
    <div className="designer-container">
      <DesignerTour />
      
      {/* Top Navigation Bar */}
      <motion.div 
        className="designer-topbar"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <button onClick={() => navigate('/')} className="btn-secondary hover-target tour-back" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '50px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <HiOutlineArrowLeft /> <span style={{ fontSize: '0.85rem' }}>Back</span>
        </button>
        
        {/* Mode Switcher */}
        <div className="tour-mode-switch" style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '50px', padding: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
           <button 
             className="hover-target"
             onClick={() => setDesignerState(prev => ({ ...prev, mode: 'edit' }))}
             style={{ cursor: 'pointer', border: 'none', padding: '8px 24px', fontSize: '0.9rem', borderRadius: '50px', background: designerState.mode === 'edit' ? 'white' : 'transparent', color: designerState.mode === 'edit' ? 'black' : 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s' }}
           ><HiOutlinePencilSquare /> Edit</button>
           <button 
             className="hover-target"
             onClick={() => setDesignerState(prev => ({ ...prev, mode: 'preview' }))}
             style={{ cursor: 'pointer', border: 'none', padding: '8px 24px', fontSize: '0.9rem', borderRadius: '50px', background: designerState.mode === 'preview' ? '#7c3aed' : 'transparent', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s' }}
           ><HiOutlineEye /> Preview</button>
        </div>

        <button className="btn-primary hover-target tour-download" onClick={handleDownloadSnapshot} style={{ padding: '8px 20px', fontSize: '0.85rem', margin: 0, borderRadius: '50px' }}>
          Save Design
        </button>
      </motion.div>

      {/* Layers Sidebar (Left) */}
      <AnimatePresence>
        {designerState.mode === 'edit' && (
          <motion.div 
            className="designer-sidebar tour-layers"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <h3 style={{ fontWeight: 500, letterSpacing: '0.5px' }}>Design Layers</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {decals.map((decal, index) => (
              <div 
                key={decal.id} 
                className="hover-target"
                onClick={() => setActiveDecalId(decal.id)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: activeDecalId === decal.id ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${activeDecalId === decal.id ? '#7c3aed' : 'transparent'}`, borderRadius: '8px', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={decal.url} alt="Logo" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                  <span style={{ color: 'white', fontSize: '0.85rem' }}>Logo {index + 1}</span>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setDecals(prev => prev.filter(d => d.id !== decal.id)); if (activeDecalId === decal.id) setActiveDecalId(null); }}
                  style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                >
                  <HiOutlineTrash size={16} />
                </button>
              </div>
            ))}
          </div>
          <label className="btn-secondary hover-target" style={{ padding: '10px', fontSize: '0.85rem', cursor: 'pointer', margin: 0, borderRadius: '8px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <HiOutlinePlus /> Add Logo
            <input type="file" accept="image/png, image/jpeg" style={{ display: 'none' }} onChange={handleFileUpload} />
          </label>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Camera Controls (Right) */}
      <AnimatePresence>
        {designerState.mode === 'edit' && (
          <motion.div 
            className="designer-controls tour-camera"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
             
             {/* Zoom Controls without the buggy pill container */}
           <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                className="hover-target" 
                onClick={() => setDesignerState(prev => ({ ...prev, zoom: Math.min(2.5, prev.zoom + 0.2) }))} 
                style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(20, 20, 25, 0.4)', backdropFilter: 'blur(30px) saturate(150%)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}
              >
                <HiOutlineMagnifyingGlassPlus size={22} />
              </button>
              
              <button 
                className="hover-target" 
                onClick={() => setDesignerState(prev => ({ ...prev, zoom: Math.max(0.8, prev.zoom - 0.2) }))} 
                style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(20, 20, 25, 0.4)', backdropFilter: 'blur(30px) saturate(150%)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}
              >
                <HiOutlineMagnifyingGlassMinus size={22} />
              </button>
           </div>
           
           <button 
             className="hover-target" 
             onClick={() => setDesignerState(prev => ({ ...prev, view: prev.view === 'front' ? 'back' : 'front' }))} 
             style={{ background: 'rgba(20, 20, 25, 0.4)', backdropFilter: 'blur(30px) saturate(150%)', border: '1px solid rgba(255,255,255,0.08)', padding: '12px', borderRadius: '50px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}
           >
             <HiOutlineArrowsRightLeft size={18} />
             <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{designerState.view === 'front' ? 'Flip to Back' : 'Flip to Front'}</span>
           </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Canvas */}
      <Canvas
        className="tshirt-canvas hover-target"
        camera={{ position: [0, 0, 2.2], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        shadows
      >
        <ambientLight intensity={0.5} />
        {/* Cinematic Studio Lighting */}
        <directionalLight position={[5, 5, 5]} intensity={2.0} color="#ffffff" castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[-4, 3, 3]} intensity={1.0} color="#a78bfa" />
        <directionalLight position={[0, 2, -5]} intensity={1.5} color="#ffffff" />
        <spotLight position={[-4, 4, 6]} intensity={25} color="#7c3aed" angle={0.5} penumbra={1} />
        {/* Dramatic Rim Light */}
        <pointLight position={[0, -2, -3]} intensity={15} color="#7c3aed" />
        
        <Suspense fallback={null}>
          {designerState.mode === 'preview' ? (
            <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.1}>
              <ExternalModel color={color} decals={decals} activeDecalId={activeDecalId} activeDecal={activeDecal} setDecals={setDecals} designerState={designerState} />
            </Float>
          ) : (
            // No float in Edit Mode to ensure flawless drag-and-drop
            <ExternalModel color={color} decals={decals} activeDecalId={activeDecalId} activeDecal={activeDecal} setDecals={setDecals} designerState={designerState} />
          )}
        </Suspense>

        <ContactShadows position={[0, -0.8, 0]} opacity={0.4} scale={4} blur={3} far={4} color="#7c3aed" />
        
        {/* Enable free 3D rotation ONLY in Preview Mode */}
        {designerState.mode === 'preview' && (
          <OrbitControls makeDefault enableZoom={true} minDistance={1} maxDistance={4} enablePan={false} />
        )}
      </Canvas>

      {/* Horizontal Dock UI */}
      <motion.div 
        className="customizer-ui designer-dock"
        initial={{ y: 100, opacity: 0, x: '-50%' }}
        animate={{ y: 0, opacity: 1, x: '-50%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.1 }}
      >
        
        {/* Colors */}
        <div className="tour-colors" style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>Shirt Color</span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
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

        {/* Edit Context Tools */}
        {designerState.mode === 'edit' && activeDecal && (
          <div className="tour-size" style={{ display: 'flex', alignItems: 'center', gap: '25px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '30px' }}>
            
            {/* Smooth Size Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '150px' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>Size</span>
              <input 
                type="range" 
                min="0.05" 
                max="0.4" 
                step="0.01" 
                value={activeDecal.scale}
                onChange={(e) => {
                  const newScale = parseFloat(e.target.value);
                  setDecals(prev => prev.map(d => d.id === activeDecal.id ? { ...d, scale: newScale } : d));
                }}
                className="hover-target"
                style={{
                  width: '100%',
                  accentColor: '#7c3aed',
                  cursor: 'pointer'
                }}
              />
            </div>

          </div>
        )}
      </motion.div>
    </div>
  );
}
