import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useWarRoomStore } from '../../store/useWarRoomStore';
import { TOP10_BATTERS_STATIC, TOP10_BOWLERS_STATIC, ALL_PLAYERS_STATIC } from '../../data/warRoomStaticData';
import { PlayerCard3D } from './PlayerCard3D';
import { StadiumPitch3D } from './StadiumPitch3D';

// Camera controller that transitions to pitch or top-down without blocking 360 OrbitControls in arena mode
const CameraController: React.FC<{ controlsRef: React.RefObject<OrbitControlsImpl> }> = ({ controlsRef }) => {
  const { activeMode, selectedPlayerId, manualRotationAngle } = useWarRoomStore();
  const prevAngleRef = useRef(0);

  useEffect(() => {
    if (controlsRef.current && manualRotationAngle !== prevAngleRef.current) {
      const delta = manualRotationAngle - prevAngleRef.current;
      controlsRef.current.setAzimuthalAngle(controlsRef.current.getAzimuthalAngle() + delta);
      prevAngleRef.current = manualRotationAngle;
    }
  }, [manualRotationAngle, controlsRef]);

  useFrame((state, delta) => {
    // Only take over camera position when inspecting a specific player in Pitch mode
    if (activeMode === 'PITCH_DOSSIER' && selectedPlayerId) {
      const targetPos = new THREE.Vector3(-2.8, 3.2, 7.6);
      const targetLook = new THREE.Vector3(-0.8, 0.5, 0);
      state.camera.position.lerp(targetPos, 0.06);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLook, 0.06);
      }
    }
  });

  return null;
};

export const WarRoomCanvas: React.FC = () => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const {
    activeRoleFilter,
    selectedPlayerId,
    isAutoRotating,
  } = useWarRoomStore();

  const selectedPlayer = useMemo(() => {
    if (!selectedPlayerId) return null;
    return ALL_PLAYERS_STATIC.find((p) => p.player_id === selectedPlayerId) || null;
  }, [selectedPlayerId]);

  // Generate radial coordinates for amphitheater rings
  // Batters: Inner ring (radius 6.2m)
  const batterCards = useMemo(() => {
    const r = 6.2;
    return TOP10_BATTERS_STATIC.map((player, idx) => {
      const angle = (idx / 10) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const rotY = -angle - Math.PI / 2;
      return {
        player,
        position: [x, 0.4, z] as [number, number, number],
        rotation: [0, rotY, 0] as [number, number, number],
      };
    });
  }, []);

  // Bowlers: Outer ring (radius 9.2m)
  const bowlerCards = useMemo(() => {
    const r = 9.2;
    return TOP10_BOWLERS_STATIC.map((player, idx) => {
      const angle = (idx / 10) * Math.PI * 2 - Math.PI / 2 + 0.15;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const rotY = -angle - Math.PI / 2;
      return {
        player,
        position: [x, 0.7, z] as [number, number, number],
        rotation: [0, rotY, 0] as [number, number, number],
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full bg-[#000C1F] z-0">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 5.8, 13.5], fov: 45 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
        }}
      >
        <color attach="background" args={['#000C1F']} />

        {/* Ambient lighting & Rajasthan Royals Stadium Floodlights */}
        <ambientLight intensity={0.70} color="#FFFFFF" />
        <directionalLight
          position={[10, 20, 12]}
          intensity={1.6}
          color="#FFF5E6"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        {/* Royals Pink & Trophy Gold Rim Floodlights */}
        <pointLight position={[-9, 7, -9]} intensity={1.2} color="#EA1A85" />
        <pointLight position={[9, 7, 9]} intensity={1.2} color="#FFD700" />
        <pointLight position={[0, 9, 0]} intensity={0.8} color="#254AA5" />

        {/* Deep Sky Atmospheric Stars */}
        <Stars radius={45} depth={30} count={1400} factor={3.5} saturation={0.8} fade speed={1.2} />

        {/* 3D Cricket Pitch & Stadium Ground */}
        <StadiumPitch3D player={selectedPlayer} />

        {/* Hall of Clutch Titans Amphitheater Cards */}
        {/* Batters Ring */}
        {(activeRoleFilter === 'ALL' || activeRoleFilter === 'BATTER') &&
          batterCards.map(({ player, position, rotation }) => (
            <PlayerCard3D
              key={player.player_id}
              player={player}
              position={position}
              rotation={rotation}
              isFocal={selectedPlayerId === player.player_id}
            />
          ))}

        {/* Bowlers Ring */}
        {(activeRoleFilter === 'ALL' || activeRoleFilter === 'BOWLER') &&
          bowlerCards.map(({ player, position, rotation }) => (
            <PlayerCard3D
              key={player.player_id}
              player={player}
              position={position}
              rotation={rotation}
              isFocal={selectedPlayerId === player.player_id}
            />
          ))}

        {/* Dynamic camera transitions */}
        <CameraController controlsRef={controlsRef} />

        {/* 360-Degree Interactive Orbit Controls */}
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.06}
          autoRotate={isAutoRotating && !selectedPlayerId}
          autoRotateSpeed={0.7}
          maxPolarAngle={Math.PI / 2.05}
          minDistance={3.5}
          maxDistance={25}
          enablePan={false}
        />
      </Canvas>
    </div>
  );
};
