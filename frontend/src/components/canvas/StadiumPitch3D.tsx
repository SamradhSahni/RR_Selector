import React, { useState } from 'react';
import * as THREE from 'three';
import { QuadraticBezierLine, Html } from '@react-three/drei';
import { PlayerStaticDossier, PitchDelivery3D } from '../../data/warRoomStaticData';

interface StadiumPitch3DProps {
  player: PlayerStaticDossier | null;
}

export const StadiumPitch3D: React.FC<StadiumPitch3DProps> = ({ player }) => {
  const [hoveredDelivery, setHoveredDelivery] = useState<PitchDelivery3D | null>(null);

  const deliveries = player?.deliveries_3d || [];

  return (
    <group position={[0, -0.9, 0]}>
      {/* Stadium Turf Ground Disc in Rajasthan Royals Midnight Navy */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <circleGeometry args={[14, 64]} />
        <meshStandardMaterial
          color="#001433"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Glowing Outer Boundary Rope in Rajasthan Royals Hot Pink */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[11.8, 11.96, 64]} />
        <meshBasicMaterial color="#EA1A85" />
      </mesh>

      {/* 30-Yard Inner Circle in Trophy Gold */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[5.8, 5.86, 64]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.5} />
      </mesh>

      {/* Central Clay Pitch Strip (Sawai Mansingh Stadium specifications) */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <planeGeometry args={[1.6, 6.8]} />
        <meshStandardMaterial
          color="#002255"
          roughness={0.65}
          metalness={0.15}
        />
      </mesh>

      {/* Pitch Crease Lines in Trophy Gold */}
      {/* Bowling Crease (Far end) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, -2.4]}>
        <planeGeometry args={[1.4, 0.06]} />
        <meshBasicMaterial color="#FFD700" opacity={0.9} transparent />
      </mesh>
      {/* Batting Crease (Near end) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 2.4]}>
        <planeGeometry args={[1.4, 0.06]} />
        <meshBasicMaterial color="#FFD700" opacity={0.9} transparent />
      </mesh>

      {/* LED Cricket Stumps (Striker & Non-Striker) in Trophy Gold & Royals Pink */}
      <group position={[0, 0.25, 2.6]}>
        {[-0.08, 0, 0.08].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.5, 12]} />
            <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.2} emissive="#EA1A85" emissiveIntensity={0.5} />
          </mesh>
        ))}
        {/* Bails */}
        <mesh position={[0, 0.26, 0]}>
          <boxGeometry args={[0.22, 0.02, 0.02]} />
          <meshBasicMaterial color="#FFD700" />
        </mesh>
      </group>

      <group position={[0, 0.25, -2.6]}>
        {[-0.08, 0, 0.08].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.5, 12]} />
            <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.2} emissive="#254AA5" emissiveIntensity={0.5} />
          </mesh>
        ))}
      </group>

      {/* 3D Delivery Parabolic Arcs in Rajasthan Royals Theme */}
      {deliveries.length > 0 && deliveries.map((d) => {
        // Map colors strictly to Royals theme
        const trajectoryColor = d.isWicket
          ? '#EA1A85' // Royals Pink for wickets
          : d.runs === 6
          ? '#FFD700' // Trophy Gold for 6s
          : d.runs === 4
          ? '#FF4DA6' // Light Royals Pink for 4s
          : '#254AA5'; // Royal Blue for dots/rotation

        return (
          <group key={d.id}>
            <QuadraticBezierLine
              start={new THREE.Vector3(...d.start)}
              mid={new THREE.Vector3(...d.mid)}
              end={new THREE.Vector3(...d.end)}
              color={trajectoryColor}
              lineWidth={hoveredDelivery?.id === d.id ? 4.5 : 2.2}
              transparent
              opacity={hoveredDelivery?.id === d.id ? 1.0 : 0.70}
            />
            {/* Landing / Impact Marker Pin */}
            <mesh
              position={new THREE.Vector3(...d.end)}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredDelivery(d);
              }}
              onPointerOut={() => setHoveredDelivery(null)}
            >
              <sphereGeometry args={[hoveredDelivery?.id === d.id ? 0.15 : 0.09, 16, 16]} />
              <meshBasicMaterial color={trajectoryColor} />
            </mesh>
          </group>
        );
      })}

      {/* Interactive Floating Tooltip when hovering any delivery on pitch */}
      {hoveredDelivery && (
        <Html position={new THREE.Vector3(...hoveredDelivery.end)} distanceFactor={12} zIndexRange={[100, 0]}>
          <div className="p-3 rounded-2xl bg-[#001D4A]/95 text-white border-2 border-[#FFD700] shadow-[0_0_40px_rgba(255,215,0,0.4)] w-60 text-xs backdrop-blur-xl pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-white/15">
              <span className="font-mono font-bold text-[#FFD700]">Over {hoveredDelivery.overBall}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#EA1A85] text-white">
                {hoveredDelivery.regime}
              </span>
            </div>
            <div className="font-extrabold text-sm text-white mt-1.5">{hoveredDelivery.outcomeLabel}</div>
            <div className="grid grid-cols-2 gap-1 mt-2 text-[11px] pt-1.5 border-t border-white/10">
              <div>
                <span className="text-slate-300">CPI Index:</span>{' '}
                <span className="font-bold text-[#EA1A85]">{hoveredDelivery.cpi}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-300">WPA Swing:</span>{' '}
                <span className="font-bold text-[#FFD700]">+{hoveredDelivery.wpaPct}%</span>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};
