'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Stars } from '@react-three/drei';
import { useMemo } from 'react';

const towers = [
  { x: 0, z: 0, w: 1.7, h: 5.2, d: 1.7, c: '#4b9cff' },
  { x: -4, z: -1, w: 1.3, h: 3.4, d: 1.3, c: '#27d8d0' },
  { x: 3.7, z: -1.5, w: 1.2, h: 4.1, d: 1.2, c: '#7a75ff' },
  { x: -3.3, z: 3, w: 1.4, h: 2.7, d: 1.4, c: '#4b9cff' },
  { x: 3.4, z: 2.7, w: 1.5, h: 3.1, d: 1.5, c: '#e0b75b' },
  { x: -6.2, z: -3.5, w: 1.1, h: 2.1, d: 1.1, c: '#27d8d0' },
  { x: 6.2, z: -3.6, w: 1.2, h: 2.5, d: 1.2, c: '#7a75ff' },
  { x: -6, z: 4.5, w: 1.1, h: 1.8, d: 1.1, c: '#4b9cff' },
  { x: 6, z: 4.4, w: 1.1, h: 2.0, d: 1.1, c: '#27d8d0' },
];
function Tower({ x, z, w, h, d, c }: typeof towers[number]) {
  const windows = useMemo(() => Array.from({ length: Math.floor(h * 3) }, (_, i) => i), [h]);
  return <group position={[x, h / 2, z]}>
    <mesh castShadow receiveShadow><boxGeometry args={[w, h, d]} /><meshStandardMaterial color="#101d37" metalness={0.7} roughness={0.25} /></mesh>
    <mesh position={[0, h / 2 + .035, 0]}><boxGeometry args={[w + .12, .07, d + .12]} /><meshStandardMaterial color={c} emissive={c} emissiveIntensity={1.8} /></mesh>
    {windows.map(i => <group key={i} position={[0, -h/2 + .35 + i*.29, d/2 + .012]}>{[-.28,0,.28].map(xx => <mesh key={xx} position={[xx,0,0]}><boxGeometry args={[.09,.12,.025]} /><meshBasicMaterial color={i%3===0 ? c : '#b9d9ff'} /></mesh>)}</group>)}
    <mesh position={[0, h/2 + .28, 0]}><sphereGeometry args={[.09,12,12]} /><meshBasicMaterial color={c} /></mesh>
  </group>;
}
function City() {
  return <>
    <color attach="background" args={['#050b18']} /><fog attach="fog" args={['#050b18',12,28]} />
    <ambientLight intensity={1.1} /><pointLight position={[0,10,0]} intensity={90} color="#4b9cff" distance={24} /><pointLight position={[-8,5,7]} intensity={35} color="#16c9d2" distance={18} />
    <Stars radius={70} depth={35} count={900} factor={2} fade speed={0.3} />
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.08,0]} receiveShadow><planeGeometry args={[32,32]} /><meshStandardMaterial color="#08142a" metalness={.5} roughness={.7} /></mesh>
    <gridHelper args={[32,32,'#16365a','#0b2039']} />
    {towers.map((t,i) => <Tower key={i} {...t} />)}
    <Float speed={1.3} floatIntensity={.3}><mesh position={[0,6.2,0]}><torusGeometry args={[1.7,.018,8,100]} /><meshBasicMaterial color="#49b9ff" /></mesh></Float>
    <OrbitControls enablePan={false} minDistance={8} maxDistance={22} maxPolarAngle={Math.PI/2.08} minPolarAngle={.55} />
  </>;
}
export default function CityScene() { return <Canvas camera={{ position:[11,10,13], fov:42 }} dpr={[1,1.7]} gl={{ antialias:true }}><City /></Canvas>; }
