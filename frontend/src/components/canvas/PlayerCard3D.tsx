import React, { useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { PlayerStaticDossier } from '../../data/warRoomStaticData';
import { useWarRoomStore } from '../../store/useWarRoomStore';
import { buildCardSvgDataUri } from '../../utils/cardArtSynthesizer';

interface PlayerCard3DProps {
  player: PlayerStaticDossier;
  position: [number, number, number];
  rotation: [number, number, number];
  isFocal?: boolean;
}

export const PlayerCard3D: React.FC<PlayerCard3DProps> = ({
  player,
  position,
  rotation,
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { selectedPlayerId, selectPlayer, activeRegimeFilter, lbmoStressTestActive } = useWarRoomStore();

  const isSelected = selectedPlayerId === player.player_id;
  const isBat = player.role === 'BATTER';

  // Dynamic SVG card art texture in Rajasthan Royals colors
  const cardDataUri = useMemo(() => buildCardSvgDataUri(player), [player]);
  
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(cardDataUri);
    tex.anisotropy = 8;
    return tex;
  }, [cardDataUri]);

  // Regime elevation calculation
  const regimeElevation = useMemo(() => {
    if (lbmoStressTestActive || activeRegimeFilter === 'LBMO') {
      return player.eb_lbmo_pb * 1.5;
    }
    if (activeRegimeFilter === 'CRISIS') return player.eb_crisis_pb * 1.8;
    if (activeRegimeFilter === 'ESCALATION') return player.eb_escalation_pb * 1.8;
    if (activeRegimeFilter === 'CRUNCH') return player.eb_crunch_pb * 2.0;
    return 0;
  }, [activeRegimeFilter, lbmoStressTestActive, player]);

  // Frame animation loop with zero GC allocations
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Hover or selected elevation target
    const targetY = position[1] + regimeElevation + (hovered ? 0.45 : 0) + (isSelected ? 0.6 : 0);
    const targetScale = isSelected ? 1.15 : hovered ? 1.08 : 1.0;

    // Smooth exponential damping
    meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, targetY, 6, delta);
    meshRef.current.scale.setScalar(THREE.MathUtils.damp(meshRef.current.scale.x, targetScale, 6, delta));

    // Subtle breathing floating rotation
    if (!isSelected) {
      const wobble = Math.sin(state.clock.elapsedTime * 1.5 + Number(player.player_id)) * 0.02;
      meshRef.current.rotation.y = THREE.MathUtils.damp(meshRef.current.rotation.y, rotation[1] + wobble, 4, delta);
    } else {
      meshRef.current.rotation.y = THREE.MathUtils.damp(meshRef.current.rotation.y, 0, 8, delta);
    }
  });

  const primaryColor = isBat ? '#EA1A85' : '#254AA5';
  const glowColor = isSelected ? '#FFD700' : hovered ? '#EA1A85' : '#FFD700';

  return (
    <group
      ref={meshRef}
      position={[position[0], position[1] + regimeElevation, position[2]]}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation();
        selectPlayer(isSelected ? null : player.player_id, player.role);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* 3D Card Body in Titanium Navy & Royals Pink */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.5, 2.1, 0.045]} />
        <meshStandardMaterial
          attach="material-4"
          map={texture}
          roughness={0.25}
          metalness={0.35}
        />
        <meshStandardMaterial
          attach="material-5"
          color="#001433"
          roughness={0.4}
          metalness={0.8}
        />
        <meshStandardMaterial
          attach="material-0"
          color="#001D4A"
          metalness={0.9}
          roughness={0.2}
        />
        <meshStandardMaterial
          attach="material-1"
          color="#001D4A"
          metalness={0.9}
          roughness={0.2}
        />
        <meshStandardMaterial
          attach="material-2"
          color="#001D4A"
          metalness={0.9}
          roughness={0.2}
        />
        <meshStandardMaterial
          attach="material-3"
          color="#001D4A"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Holographic Specular Outer Rim in Gold / Pink */}
      <mesh position={[0, 0, 0.005]}>
        <ringGeometry args={[0.95, 1.02, 32]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={hovered || isSelected ? 0.95 : 0.35}
          wireframe
        />
      </mesh>

      {/* Interactive Quick Floating Tooltip on Hover */}
      {(hovered || isSelected) && (
        <Html position={[0, -1.35, 0.1]} center distanceFactor={14}>
          <div className="px-4 py-2 rounded-full text-xs font-black tracking-wider shadow-2xl border-2 flex items-center gap-2.5 whitespace-nowrap bg-[#001D4A]/98 text-white border-[#FFD700]">
            <span className="text-[#EA1A85] text-sm">●</span>
            <span className="font-extrabold text-white">#{player.unstop_rank} {player.player_name.toUpperCase()}</span>
            <span className="text-[#FFD700] font-mono font-black">★ {player.pressure_reliability_score.toFixed(1)}</span>
            <span className="text-[11px] text-[#FF4DA6] font-bold">({isBat ? `+${player.eb_primary_pb.toFixed(3)} RAAA` : `+${player.eb_primary_pb.toFixed(3)} WAAA`})</span>
          </div>
        </Html>
      )}
    </group>
  );
};
