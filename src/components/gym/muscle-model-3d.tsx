'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowRight, RotateCw } from 'lucide-react';
import * as THREE from 'three';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';

type Side = 'front' | 'back';

export interface MuscleDef {
  id: string;
  name: string;
  slug: string;
  side: Side;
  description: string;
  exerciseCount: number;
}

const MUSCLES: MuscleDef[] = [
  // FRONT
  { id: 'chest',     name: 'Chest',     slug: 'chest',     side: 'front', description: 'Build pressing power and upper body strength.', exerciseCount: 24 },
  { id: 'shoulders', name: 'Shoulders', slug: 'shoulders', side: 'front', description: 'Cap, define, and stabilize every press.', exerciseCount: 18 },
  { id: 'biceps',    name: 'Biceps',    slug: 'biceps',    side: 'front', description: 'Pulling power and arm definition.', exerciseCount: 16 },
  { id: 'forearms',  name: 'Forearms',  slug: 'forearms',  side: 'front', description: 'Grip strength and arm endurance.', exerciseCount: 10 },
  { id: 'abs',       name: 'Abs',       slug: 'abs',       side: 'front', description: 'Core stability, bracing, and definition.', exerciseCount: 20 },
  { id: 'quads',     name: 'Quads',     slug: 'quads',     side: 'front', description: 'Squat strength and lower-body drive.', exerciseCount: 22 },
  // BACK
  { id: 'triceps',     name: 'Triceps',     slug: 'triceps',     side: 'back', description: 'Lockout strength and arm size.', exerciseCount: 16 },
  { id: 'lats',        name: 'Lats',        slug: 'back',        side: 'back', description: 'V-taper width and pulling power.', exerciseCount: 20 },
  { id: 'upper-back',  name: 'Upper Back',  slug: 'back',        side: 'back', description: 'Postural density and pulling strength.', exerciseCount: 18 },
  { id: 'lower-back',  name: 'Lower Back',  slug: 'back',        side: 'back', description: 'Spinal strength and deadlift base.', exerciseCount: 10 },
  { id: 'glutes',      name: 'Glutes',      slug: 'glutes',      side: 'back', description: 'Hip drive and powerhouse strength.', exerciseCount: 18 },
  { id: 'hamstrings',  name: 'Hamstrings',  slug: 'hamstrings',  side: 'back', description: 'Posterior chain and hinge power.', exerciseCount: 16 },
];

const HIGHLIGHT = '#3B82F6';
const SKIN = '#cfd4dc';
const SKIN_DIM = '#5b6168';

interface MuscleMeshProps {
  id: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  geometry: 'box' | 'sphere' | 'capsule';
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function MuscleMesh({ id, position, rotation, scale, geometry, selectedId, onSelect }: MuscleMeshProps) {
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const isSelected = selectedId === id;
  const isDim = selectedId !== null && !isSelected;

  useFrame((_, dt) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    const targetColor = new THREE.Color(isDim ? SKIN_DIM : SKIN);
    mat.color.lerp(targetColor, Math.min(1, dt * 6));
    const targetEmissive = new THREE.Color(isSelected ? HIGHLIGHT : '#000000');
    mat.emissive.lerp(targetEmissive, Math.min(1, dt * 6));
    const pulse = isSelected ? 0.55 + Math.sin(performance.now() * 0.005) * 0.25 : 0;
    mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, pulse, Math.min(1, dt * 6));
    const targetScale = isSelected ? 1.04 : hovered ? 1.02 : 1;
    ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale).multiply(new THREE.Vector3(...(scale ?? [1, 1, 1]))), Math.min(1, dt * 8));
  });

  const handle = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect(id);
  };

  return (
    <mesh
      ref={ref}
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = ''; }}
      onClick={handle}
    >
      {geometry === 'box' && <boxGeometry args={[1, 1, 1]} />}
      {geometry === 'sphere' && <sphereGeometry args={[0.5, 32, 32]} />}
      {geometry === 'capsule' && <capsuleGeometry args={[0.5, 1, 8, 16]} />}
      <meshStandardMaterial color={SKIN} roughness={0.55} metalness={0.05} />
    </mesh>
  );
}

/** Static, non-selectable body parts (head, neck, hands, feet, base torso fill) */
function BodyBase() {
  return (
    <group>
      {/* Head */}
      <mesh position={[0, 3.5, 0]}>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial color={SKIN} roughness={0.6} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 3.0, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 0.35, 16]} />
        <meshStandardMaterial color={SKIN} roughness={0.6} />
      </mesh>
      {/* Pelvis */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.05, 0.55, 0.55]} />
        <meshStandardMaterial color={SKIN} roughness={0.6} />
      </mesh>
      {/* Hands */}
      <mesh position={[-1.5, 0.2, 0]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color={SKIN} roughness={0.6} />
      </mesh>
      <mesh position={[1.5, 0.2, 0]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color={SKIN} roughness={0.6} />
      </mesh>
      {/* Feet */}
      <mesh position={[-0.3, -3.2, 0.12]}>
        <boxGeometry args={[0.32, 0.18, 0.55]} />
        <meshStandardMaterial color={SKIN} roughness={0.6} />
      </mesh>
      <mesh position={[0.3, -3.2, 0.12]}>
        <boxGeometry args={[0.32, 0.18, 0.55]} />
        <meshStandardMaterial color={SKIN} roughness={0.6} />
      </mesh>
    </group>
  );
}

interface BodyProps {
  rotationTargetY: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function Body({ rotationTargetY, selectedId, onSelect }: BodyProps) {
  const group = useRef<THREE.Group>(null!);
  useFrame((_, dt) => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      rotationTargetY,
      Math.min(1, dt * 3),
    );
  });

  return (
    <group ref={group}>
      <BodyBase />

      {/* ===== FRONT MUSCLES (z = positive) ===== */}
      {/* Chest — two pecs */}
      <MuscleMesh id="chest" geometry="sphere" position={[-0.32, 2.35, 0.28]} scale={[0.55, 0.42, 0.35]} selectedId={selectedId} onSelect={onSelect} />
      <MuscleMesh id="chest" geometry="sphere" position={[0.32, 2.35, 0.28]} scale={[0.55, 0.42, 0.35]} selectedId={selectedId} onSelect={onSelect} />

      {/* Shoulders (front delts) */}
      <MuscleMesh id="shoulders" geometry="sphere" position={[-0.85, 2.55, 0.18]} scale={[0.45, 0.42, 0.42]} selectedId={selectedId} onSelect={onSelect} />
      <MuscleMesh id="shoulders" geometry="sphere" position={[0.85, 2.55, 0.18]} scale={[0.45, 0.42, 0.42]} selectedId={selectedId} onSelect={onSelect} />

      {/* Biceps */}
      <MuscleMesh id="biceps" geometry="capsule" position={[-1.05, 1.75, 0.18]} scale={[0.32, 0.45, 0.32]} rotation={[0, 0, 0.15]} selectedId={selectedId} onSelect={onSelect} />
      <MuscleMesh id="biceps" geometry="capsule" position={[1.05, 1.75, 0.18]} scale={[0.32, 0.45, 0.32]} rotation={[0, 0, -0.15]} selectedId={selectedId} onSelect={onSelect} />

      {/* Forearms */}
      <MuscleMesh id="forearms" geometry="capsule" position={[-1.28, 0.85, 0.1]} scale={[0.28, 0.5, 0.28]} rotation={[0, 0, 0.18]} selectedId={selectedId} onSelect={onSelect} />
      <MuscleMesh id="forearms" geometry="capsule" position={[1.28, 0.85, 0.1]} scale={[0.28, 0.5, 0.28]} rotation={[0, 0, -0.18]} selectedId={selectedId} onSelect={onSelect} />

      {/* Abs — one large block */}
      <MuscleMesh id="abs" geometry="box" position={[0, 1.35, 0.28]} scale={[0.72, 1.2, 0.22]} selectedId={selectedId} onSelect={onSelect} />

      {/* Quads */}
      <MuscleMesh id="quads" geometry="capsule" position={[-0.3, -1.3, 0.18]} scale={[0.4, 0.85, 0.4]} selectedId={selectedId} onSelect={onSelect} />
      <MuscleMesh id="quads" geometry="capsule" position={[0.3, -1.3, 0.18]} scale={[0.4, 0.85, 0.4]} selectedId={selectedId} onSelect={onSelect} />

      {/* ===== BACK MUSCLES (z = negative) ===== */}
      {/* Upper back / traps */}
      <MuscleMesh id="upper-back" geometry="box" position={[0, 2.55, -0.28]} scale={[1.1, 0.55, 0.22]} selectedId={selectedId} onSelect={onSelect} />

      {/* Lats */}
      <MuscleMesh id="lats" geometry="sphere" position={[-0.5, 1.95, -0.25]} scale={[0.55, 0.75, 0.3]} selectedId={selectedId} onSelect={onSelect} />
      <MuscleMesh id="lats" geometry="sphere" position={[0.5, 1.95, -0.25]} scale={[0.55, 0.75, 0.3]} selectedId={selectedId} onSelect={onSelect} />

      {/* Triceps */}
      <MuscleMesh id="triceps" geometry="capsule" position={[-1.05, 1.75, -0.18]} scale={[0.32, 0.45, 0.32]} rotation={[0, 0, 0.15]} selectedId={selectedId} onSelect={onSelect} />
      <MuscleMesh id="triceps" geometry="capsule" position={[1.05, 1.75, -0.18]} scale={[0.32, 0.45, 0.32]} rotation={[0, 0, -0.15]} selectedId={selectedId} onSelect={onSelect} />

      {/* Lower back */}
      <MuscleMesh id="lower-back" geometry="box" position={[0, 1.0, -0.28]} scale={[0.7, 0.7, 0.22]} selectedId={selectedId} onSelect={onSelect} />

      {/* Glutes */}
      <MuscleMesh id="glutes" geometry="sphere" position={[-0.28, -0.05, -0.28]} scale={[0.42, 0.42, 0.32]} selectedId={selectedId} onSelect={onSelect} />
      <MuscleMesh id="glutes" geometry="sphere" position={[0.28, -0.05, -0.28]} scale={[0.42, 0.42, 0.32]} selectedId={selectedId} onSelect={onSelect} />

      {/* Hamstrings */}
      <MuscleMesh id="hamstrings" geometry="capsule" position={[-0.3, -1.3, -0.18]} scale={[0.4, 0.85, 0.4]} selectedId={selectedId} onSelect={onSelect} />
      <MuscleMesh id="hamstrings" geometry="capsule" position={[0.3, -1.3, -0.18]} scale={[0.4, 0.85, 0.4]} selectedId={selectedId} onSelect={onSelect} />

      {/* Calves (lower legs visible from both sides) */}
      <mesh position={[-0.3, -2.55, 0]}>
        <capsuleGeometry args={[0.22, 0.55, 8, 16]} />
        <meshStandardMaterial color={SKIN} roughness={0.6} />
      </mesh>
      <mesh position={[0.3, -2.55, 0]}>
        <capsuleGeometry args={[0.22, 0.55, 8, 16]} />
        <meshStandardMaterial color={SKIN} roughness={0.6} />
      </mesh>
    </group>
  );
}

function LoadingState() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
      <div className="relative h-32 w-16 animate-pulse">
        <div className="absolute left-1/2 top-0 h-6 w-6 -translate-x-1/2 rounded-full bg-white/10" />
        <div className="absolute left-1/2 top-7 h-12 w-12 -translate-x-1/2 rounded-md bg-white/10" />
        <div className="absolute left-1/2 top-20 h-10 w-10 -translate-x-1/2 rounded-md bg-white/10" />
      </div>
      <p className="font-mono text-xs uppercase tracking-widest text-white/60">Loading 3D Model…</p>
    </div>
  );
}

export function MuscleModel3D() {
  const [side, setSide] = useState<Side>('front');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // rotate body group: 0 for front, PI for back
  const rotationTargetY = side === 'front' ? 0 : Math.PI;

  const selected = useMemo(() => MUSCLES.find((m) => m.id === selectedId) ?? null, [selectedId]);

  // Auto-switch side when selecting a muscle from the opposite side
  useEffect(() => {
    if (!selected) return;
    if (selected.side !== side) setSide(selected.side);
    setOpen(true);
  }, [selected]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-white/[0.08] bg-[#050505]">
      {/* Header */}
      <div className="relative z-10 flex flex-col items-center px-6 pt-6 text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/50">Gym Lift</span>
        <h2 className="mt-2 font-display text-3xl font-bold leading-tight text-white">
          Tap a Muscle.<br />
          <span className="text-[hsl(217,91%,60%)]">Train Smarter.</span>
        </h2>

        {/* Front/Back toggle */}
        <div className="mt-5 inline-flex rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur">
          {(['front', 'back'] as const).map((s) => (
            <button
              key={s}
              onClick={() => { setSide(s); setSelectedId(null); }}
              className={cn(
                'rounded-full px-6 py-1.5 text-xs font-semibold uppercase tracking-widest transition-all',
                side === s ? 'bg-white text-black shadow-lg' : 'text-white/60 hover:text-white',
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="relative mx-auto h-[60vh] min-h-[420px] w-full">
        <Suspense fallback={<LoadingState />}>
          <Canvas
            dpr={[1, 2]}
            camera={{ position: [0, 0.5, 7], fov: 35 }}
            gl={{ antialias: true, alpha: true }}
          >
            <color attach="background" args={['#050505']} />
            <fog attach="fog" args={['#050505', 8, 16]} />

            <ambientLight intensity={0.35} />
            <directionalLight position={[5, 6, 5]} intensity={0.9} />
            <directionalLight position={[-5, 3, -5]} intensity={0.5} color="#5b9dff" />
            <pointLight position={[0, 2, 4]} intensity={0.6} color="#ffffff" />

            <Body rotationTargetY={rotationTargetY} selectedId={selectedId} onSelect={handleSelect} />

            {/* Subtle ground glow */}
            <mesh position={[0, -3.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[2.2, 64]} />
              <meshBasicMaterial color="#3B82F6" transparent opacity={0.08} />
            </mesh>

            <Environment preset="city" />

            <OrbitControls
              enablePan={false}
              enableZoom={false}
              minPolarAngle={Math.PI / 2.6}
              maxPolarAngle={Math.PI / 1.7}
              minAzimuthAngle={-Math.PI / 2}
              maxAzimuthAngle={Math.PI / 2}
              rotateSpeed={0.6}
              target={[0, 0.5, 0]}
            />
          </Canvas>
        </Suspense>

        {/* Rotate hint */}
        <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-white/60 backdrop-blur">
          <RotateCw className="h-3 w-3" /> Drag to rotate
        </div>
      </div>

      {/* Bottom Sheet */}
      <Drawer open={open} onOpenChange={(v) => { setOpen(v); if (!v) setSelectedId(null); }}>
        <DrawerContent className="border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl">
          {selected && (
            <>
              <DrawerHeader className="text-left">
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[hsl(217,91%,60%)]">
                  Muscle Group
                </span>
                <DrawerTitle className="mt-1 font-display text-4xl font-bold text-white">
                  {selected.name}
                </DrawerTitle>
                <DrawerDescription className="text-base text-white/70">
                  {selected.description}
                </DrawerDescription>
              </DrawerHeader>

              <div className="px-4 pb-2">
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-[hsl(217,91%,60%)]" />
                  {selected.exerciseCount} exercises
                </div>
              </div>

              <div className="p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate({ to: '/muscles/$slug', params: { slug: selected.slug } });
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[hsl(217,91%,60%)] px-6 py-4 text-base font-semibold text-white shadow-[0_8px_30px_-8px_hsl(217,91%,60%)] transition-transform active:scale-[0.98]"
                >
                  View Workouts <ArrowRight className="h-5 w-5" />
                </button>
                <Link
                  to="/exercises"
                  onClick={() => setOpen(false)}
                  className="mt-2 block text-center text-xs font-medium uppercase tracking-widest text-white/40 hover:text-white/70"
                >
                  Browse all exercises
                </Link>
              </div>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
