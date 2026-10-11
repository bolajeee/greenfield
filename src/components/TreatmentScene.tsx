"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import type { MotionValue } from "motion/react";

/**
 * A small site (warehouse, office block, tank farm) that a band of mist crosses
 * as the visitor scrolls. Each zone turns from grey to clean white and green
 * once the mist has passed it.
 *
 * How scroll reaches the scene: `progress` is a motion value (0 to 1). We read
 * it inside useFrame, which runs once per rendered frame. Nothing here calls
 * setState, so scrolling never re-renders React; it only changes numbers that
 * three.js draws on the next frame.
 */

type Shared = {
  /** x position of the mist front, in scene units */
  front: number;
  /** 0 = untreated, 1 = treated, one entry per zone */
  treated: [number, number, number];
};

const ZONE_X = [-3.3, 0.3, 3.6] as const;
const FRONT_START = -8;
const FRONT_END = 8;

const COLORS = {
  ground: "#c9d6e3",
  wallBefore: "#aebccb",
  wallAfter: "#ffffff",
  trimBefore: "#8496a8",
  trimAfter: "#8cc342",
  dark: "#10212f",
  leaf: "#8cc342",
  canopy: "#3c6630",
  padBefore: "#b7c5d3",
  padAfter: "#e6f3cf",
  plinth: "#dfe8f1",
  road: "#9fb0c1",
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

/** Small seeded random generator, so the mist looks the same on every load. */
function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Reads scroll progress once per frame and updates the shared numbers. */
function Driver({
  progress,
  shared,
  site,
}: {
  progress: MotionValue<number>;
  shared: RefObject<Shared>;
  site: RefObject<THREE.Group | null>;
}) {
  const { camera, size } = useThree();

  // Fit the whole site in the canvas at any size. For an orthographic camera,
  // zoom is simply "pixels per scene unit".
  useEffect(() => {
    camera.zoom = Math.min(size.width / 14, size.height / 10);
    camera.lookAt(0, 0.4, 0);
    camera.updateProjectionMatrix();
  }, [camera, size]);

  useFrame(({ pointer, clock }, delta) => {
    const p = progress.get();
    const state = shared.current;
    state.front = lerp(FRONT_START, FRONT_END, clamp01((p - 0.14) / 0.78));

    // Ease each zone toward treated/untreated instead of snapping.
    const ease = Math.min(1, delta * 4);
    for (let i = 0; i < ZONE_X.length; i += 1) {
      const target = state.front > ZONE_X[i] + 0.8 ? 1 : 0;
      state.treated[i] += (target - state.treated[i]) * ease;
    }

    if (site.current) {
      // Scroll turns the site; the pointer nudges it, so the model feels like an object you can lean around.
      const follow = Math.min(1, delta * 5);
      const targetRotation = lerp(-0.14, 0.2, p) + pointer.x * 0.09;
      site.current.rotation.y += (targetRotation - site.current.rotation.y) * follow;
      site.current.rotation.x += (-pointer.y * 0.04 - site.current.rotation.x) * follow;
      // A very slow float, so the diorama never looks frozen between scroll steps.
      site.current.position.y = Math.sin(clock.elapsedTime * 0.7) * 0.05;
    }
  });

  return null;
}

/** A material whose colour follows how treated its zone is. */
function Tint({
  shared,
  zone,
  from,
  to,
}: {
  shared: RefObject<Shared>;
  zone: number;
  from: string;
  to: string;
}) {
  const ref = useRef<THREE.MeshLambertMaterial>(null);
  const colors = useMemo(() => ({ from: new THREE.Color(from), to: new THREE.Color(to) }), [from, to]);

  useFrame(() => {
    ref.current?.color.copy(colors.from).lerp(colors.to, shared.current.treated[zone]);
  });

  return <meshLambertMaterial ref={ref} color={from} />;
}

/** A green marker that rises over a zone once it is treated. */
function Beacon({ shared, zone, position }: { shared: RefObject<Shared>; zone: number; position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);

  const bulb = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const ringMaterial = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    const t = shared.current.treated[zone];
    ref.current?.scale.setScalar(Math.max(0.0001, t));

    // The bulb bobs gently; a ring expands from it and fades, like a "clear" ping.
    const time = clock.elapsedTime + zone;
    if (bulb.current) bulb.current.position.y = 0.72 + Math.sin(time * 2) * 0.04;
    const pulse = (time * 0.6) % 1;
    if (ring.current) ring.current.scale.setScalar(0.6 + pulse * 1.6);
    if (ringMaterial.current) ringMaterial.current.opacity = (1 - pulse) * 0.55 * t;
  });

  return (
    <group ref={ref} position={position} scale={0.0001}>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.6, 8]} />
        <meshBasicMaterial color={COLORS.dark} />
      </mesh>
      <mesh ref={bulb} position={[0, 0.72, 0]}>
        <sphereGeometry args={[0.17, 20, 20]} />
        <meshBasicMaterial color={COLORS.leaf} />
      </mesh>
      <mesh ref={ring} position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.34, 48]} />
        <meshBasicMaterial ref={ringMaterial} color={COLORS.leaf} transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

/** A flat pad under a zone that turns from concrete grey to fresh green once treated. */
function Pad({
  shared,
  zone,
  position,
  size,
}: {
  shared: RefObject<Shared>;
  zone: number;
  position: [number, number, number];
  size: [number, number];
}) {
  return (
    <mesh position={position} receiveShadow>
      <boxGeometry args={[size[0], 0.06, size[1]]} />
      <Tint shared={shared} zone={zone} from={COLORS.padBefore} to={COLORS.padAfter} />
    </mesh>
  );
}

/** Round-topped tree in the logo's greens. Purely decorative. */
function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.07, 0.4, 8]} />
        <meshLambertMaterial color="#6b5a45" />
      </mesh>
      <mesh position={[0, 0.62, 0]} castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshLambertMaterial color={COLORS.canopy} />
      </mesh>
      <mesh position={[0.08, 0.84, -0.03]} castShadow>
        <icosahedronGeometry args={[0.18, 1]} />
        <meshLambertMaterial color={COLORS.leaf} />
      </mesh>
    </group>
  );
}

/** A compact service vehicle makes the site feel active rather than architectural. */
function ServiceVehicle() {
  return (
    <group position={[-1.7, 0.18, 3.05]} rotation={[0, -0.02, 0]}>
      <mesh position={[0, 0.22, 0]} castShadow>
        <boxGeometry args={[1.45, 0.42, 0.68]} />
        <meshLambertMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.34, 0.53, 0]} castShadow>
        <boxGeometry args={[0.64, 0.35, 0.64]} />
        <meshLambertMaterial color={COLORS.canopy} />
      </mesh>
      <mesh position={[0.68, 0.54, 0]}>
        <boxGeometry args={[0.03, 0.2, 0.5]} />
        <meshLambertMaterial color="#b8d7e6" />
      </mesh>
      <mesh position={[-0.42, 0.43, 0.351]}>
        <boxGeometry args={[0.48, 0.14, 0.02]} />
        <meshBasicMaterial color={COLORS.leaf} />
      </mesh>
      {[-0.48, 0.48].flatMap((x) =>
        [-0.36, 0.36].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.05, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.15, 0.1, 18]} />
            <meshLambertMaterial color={COLORS.dark} />
          </mesh>
        )),
      )}
    </group>
  );
}

function Warehouse({ shared }: { shared: RefObject<Shared> }) {
  return (
    <group position={[ZONE_X[0], 0, -0.2]}>
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 1.5, 2.8]} />
        <Tint shared={shared} zone={0} from={COLORS.wallBefore} to={COLORS.wallAfter} />
      </mesh>
      {/* roof */}
      <mesh position={[0, 1.56, 0]} castShadow>
        <boxGeometry args={[3.4, 0.12, 3]} />
        <Tint shared={shared} zone={0} from={COLORS.trimBefore} to={COLORS.trimAfter} />
      </mesh>
      {/* roller doors on the front face */}
      {[-0.8, 0.8].map((x) => (
        <mesh key={x} position={[x, 0.5, 1.41]}>
          <boxGeometry args={[1, 1, 0.04]} />
          <meshLambertMaterial color={COLORS.dark} />
        </mesh>
      ))}
      {/* pallets of goods on the apron */}
      {[
        [-1.1, 0.18, 2.2],
        [-0.55, 0.18, 2.2],
        [-0.82, 0.54, 2.2],
        [0.9, 0.18, 2.3],
      ].map(([x, y, z]) => (
        <mesh key={`${x}-${y}`} position={[x, y, z]} castShadow>
          <boxGeometry args={[0.46, 0.36, 0.46]} />
          <meshLambertMaterial color="#d9b25a" />
        </mesh>
      ))}
      <Beacon shared={shared} zone={0} position={[0, 1.62, 0]} />
    </group>
  );
}

function OfficeBlock({ shared }: { shared: RefObject<Shared> }) {
  return (
    <group position={[ZONE_X[1], 0, -0.6]}>
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 2.4, 2]} />
        <Tint shared={shared} zone={1} from={COLORS.wallBefore} to={COLORS.wallAfter} />
      </mesh>
      {/* window bands on the two faces the camera sees */}
      {[0.6, 1.2, 1.8].map((y) => (
        <group key={y}>
          <mesh position={[0, y, 1.01]}>
            <boxGeometry args={[1.7, 0.28, 0.03]} />
            <meshLambertMaterial color={COLORS.dark} />
          </mesh>
          <mesh position={[1.01, y, 0]}>
            <boxGeometry args={[0.03, 0.28, 1.7]} />
            <meshLambertMaterial color={COLORS.dark} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 2.46, 0]} castShadow>
        <boxGeometry args={[2.15, 0.12, 2.15]} />
        <Tint shared={shared} zone={1} from={COLORS.trimBefore} to={COLORS.trimAfter} />
      </mesh>
      <Beacon shared={shared} zone={1} position={[0, 2.52, 0]} />
    </group>
  );
}

function TankFarm({ shared }: { shared: RefObject<Shared> }) {
  return (
    <group position={[ZONE_X[2], 0, 0]}>
      {[-0.95, 0, 0.95].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          {/* A cylinder's axis is vertical by default; rotating it a quarter turn lays the tank on its side. */}
          <mesh position={[0, 0.62, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.4, 0.4, 2.3, 28]} />
            <Tint shared={shared} zone={2} from={COLORS.wallBefore} to={COLORS.wallAfter} />
          </mesh>
          {[-0.7, 0.7].map((z) => (
            <mesh key={z} position={[0, 0.14, z]} castShadow>
              <boxGeometry args={[0.6, 0.28, 0.2]} />
              <Tint shared={shared} zone={2} from={COLORS.trimBefore} to={COLORS.trimAfter} />
            </mesh>
          ))}
        </group>
      ))}
      <Beacon shared={shared} zone={2} position={[0, 1.05, 0]} />
    </group>
  );
}

const mistVertexShader = /* glsl */ `
  attribute float aPhase;
  attribute float aSize;
  uniform float uTime;
  uniform float uFront;
  uniform float uPixel;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    // Slide the whole cloud to the front position, then let each puff wander.
    p.x += uFront + sin(uTime * 0.5 + aPhase) * 0.3;
    p.y += sin(uTime * 0.35 + aPhase * 1.7) * 0.18;
    p.z += cos(uTime * 0.3 + aPhase * 1.3) * 0.25;

    // Dense at the leading edge, thinning out behind it and with height.
    float along = smoothstep(-3.4, -0.5, position.x) * (1.0 - smoothstep(0.3, 1.0, position.x));
    float height = 1.0 - smoothstep(1.4, 3.0, position.y);
    vAlpha = along * height;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * uPixel;
  }
`;

const mistFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;

  void main() {
    // Each point is drawn as a square; fade it to a soft round puff.
    float distanceFromCentre = length(gl_PointCoord - 0.5);
    float puff = smoothstep(0.5, 0.0, distanceFromCentre);
    gl_FragColor = vec4(uColor, puff * puff * vAlpha * uOpacity);
  }
`;

function Mist({ progress, shared, count }: { progress: MotionValue<number>; shared: RefObject<Shared>; count: number }) {
  const material = useRef<THREE.ShaderMaterial>(null);

  const { positions, phases, sizes } = useMemo(() => {
    const random = seededRandom(7);
    const positionArray = new Float32Array(count * 3);
    const phaseArray = new Float32Array(count);
    const sizeArray = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      // Skewed so most puffs sit just behind the front, with a long thin tail.
      positionArray[i * 3] = 1 - Math.pow(random(), 0.6) * 4.4;
      positionArray[i * 3 + 1] = 0.15 + Math.pow(random(), 1.5) * 2.8;
      positionArray[i * 3 + 2] = (random() - 0.5) * 6.4;
      phaseArray[i] = random() * Math.PI * 2;
      sizeArray[i] = 0.5 + random() * 0.7;
    }
    return { positions: positionArray, phases: phaseArray, sizes: sizeArray };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFront: { value: FRONT_START },
      uPixel: { value: 50 },
      uOpacity: { value: 0 },
      // Plain numbers rather than a THREE.Color, so the shader outputs exactly this sRGB tint.
      uColor: { value: new THREE.Vector3(0.93, 0.98, 0.86) },
    }),
    [],
  );

  useFrame((state) => {
    if (!material.current) return;
    const p = progress.get();
    const u = material.current.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uFront.value = shared.current.front;
    u.uPixel.value = state.camera.zoom * state.gl.getPixelRatio();
    // Fade the cloud in as the pass starts and out as it leaves the site.
    u.uOpacity.value = 0.3 * clamp01((p - 0.1) / 0.06) * (1 - clamp01((p - 0.9) / 0.07));
  });

  return (
    // The shader moves the points, so three.js must not cull them by their original bounds.
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={mistVertexShader}
        fragmentShader={mistFragmentShader}
        transparent
        depthWrite={false}
      />
    </points>
  );
}

function Site({ progress, shared, mistCount }: { progress: MotionValue<number>; shared: RefObject<Shared>; mistCount: number }) {
  const site = useRef<THREE.Group>(null);

  return (
    <>
      <Driver progress={progress} shared={shared} site={site} />
      {/* Sky-to-ground fill: tops of things catch cool light, undersides stay soft rather than flat grey. */}
      <hemisphereLight args={["#ffffff", "#aebccb", 1.1]} />
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[5, 9, 3]}
        intensity={2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-radius={4}
        shadow-bias={-0.0004}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-camera-near={1}
        shadow-camera-far={30}
      />
      <group ref={site}>
        {/* Two stacked slabs read as a model on a plinth rather than a box on the page. */}
        <mesh position={[0, -0.34, 0.4]} receiveShadow>
          <boxGeometry args={[12.3, 0.3, 6.9]} />
          <meshLambertMaterial color={COLORS.plinth} />
        </mesh>
        <mesh position={[0, -0.1, 0.4]} receiveShadow>
          <boxGeometry args={[11.8, 0.2, 6.4]} />
          <meshLambertMaterial color={COLORS.ground} />
        </mesh>
        {/* service road along the front of the site */}
        <mesh position={[0, 0.005, 3.1]} receiveShadow>
          <boxGeometry args={[11.8, 0.02, 1.1]} />
          <meshLambertMaterial color={COLORS.road} />
        </mesh>
        {[-4.8, -3.2, -1.6, 0, 1.6, 3.2, 4.8].map((x) => (
          <mesh key={x} position={[x, 0.02, 3.1]}>
            <boxGeometry args={[0.6, 0.01, 0.07]} />
            <meshLambertMaterial color="#ffffff" />
          </mesh>
        ))}
        <Pad shared={shared} zone={0} position={[ZONE_X[0], 0.01, 0.9]} size={[4.2, 4.4]} />
        <Pad shared={shared} zone={1} position={[ZONE_X[1], 0.01, -0.2]} size={[3, 3]} />
        <Pad shared={shared} zone={2} position={[ZONE_X[2], 0.01, 0.1]} size={[3.6, 3.2]} />
        <Tree position={[-5.3, 0, -2]} scale={1.1} />
        <Tree position={[-4.6, 0, -2.4]} scale={0.8} />
        <Tree position={[5.2, 0, -2.3]} scale={1} />
        <Tree position={[2, 0, -2.6]} scale={0.7} />
        <ServiceVehicle />
        <Warehouse shared={shared} />
        <OfficeBlock shared={shared} />
        <TankFarm shared={shared} />
        <Mist progress={progress} shared={shared} count={mistCount} />
      </group>
    </>
  );
}

export default function TreatmentScene({
  progress,
  active,
}: {
  progress: MotionValue<number>;
  /** false while the hero is off screen, so the GPU can rest */
  active: boolean;
}) {
  const shared = useRef<Shared>({ front: FRONT_START, treated: [0, 0, 0] });

  // Fewer puffs on small screens, which usually means a phone GPU.
  const mistCount = useMemo(
    () => (typeof window !== "undefined" && window.innerWidth < 700 ? 500 : 1000),
    [],
  );

  return (
    <Canvas
      className="hero-canvas"
      orthographic
      flat
      shadows
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [9, 7.5, 9], zoom: 50, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true }}
      aria-hidden="true"
    >
      <Site progress={progress} shared={shared} mistCount={mistCount} />
    </Canvas>
  );
}
