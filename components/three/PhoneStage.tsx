"use client";

import { useEffect, useMemo, useRef, useState, type MutableRefObject, type RefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Html, Lightformer } from "@react-three/drei";
import PhoneModel from "./PhoneModel";
import { JobRows, type ScreenCopy } from "./PhoneScreen";
import { cn } from "@/lib/cn";

type V3 = [number, number, number];
type Key = { cam: V3; look: V3; pos: V3; rot: V3 };

/**
 * Camera + phone keyframes, one per story beat:
 * 0 hero · 1 missed call · 2 text thread · 3 job card · 4 booked.
 * Scroll progress interpolates between neighbours; the rig then springs
 * toward that target every frame, so motion stays continuous and can be
 * reversed at any instant by scrolling back.
 */
const DESKTOP: Key[] = [
  { cam: [0, 0.25, 10.4], look: [0.2, 0, 0], pos: [2.35, -0.05, 0], rot: [0.1, -0.5, 0.07] },
  { cam: [0.3, 0.1, 9.7], look: [0.8, 0, 0], pos: [2.15, 0, 0], rot: [0.02, -0.14, 0] },
  { cam: [-1.8, 0.75, 9.3], look: [1.0, 0.1, 0], pos: [2.2, 0, 0], rot: [-0.02, 0.36, -0.02] },
  { cam: [1.4, -0.3, 9.0], look: [1.3, 0.1, 0], pos: [2.75, 0, 0], rot: [0.06, -0.3, 0.03] },
  { cam: [0, 0.05, 10.2], look: [0.5, 0, 0], pos: [2.2, 0, 0], rot: [0, 0, 0] },
];

// Phones: the copy owns the bottom ~45% of the screen, so the handset is
// framed in the top half (look target sits below it).
const MOBILE: Key[] = [
  { cam: [0, 0.2, 12.6], look: [0, -1.25, 0], pos: [0, 0.2, 0], rot: [0.1, -0.38, 0.05] },
  // Beats only carry a two-line caption, so the camera moves in closer.
  { cam: [0.2, 0.1, 8.9], look: [0, -0.35, 0], pos: [0, 0.25, 0], rot: [0.03, -0.12, 0] },
  { cam: [-1.1, 0.5, 8.7], look: [0, -0.3, 0], pos: [0, 0.25, 0], rot: [0, 0.28, -0.02] },
  { cam: [0.9, -0.1, 8.6], look: [0, -0.3, 0], pos: [0, 0.25, 0], rot: [0.05, -0.22, 0.02] },
  { cam: [0, 0.05, 9.0], look: [0, -0.35, 0], pos: [0, 0.25, 0], rot: [0, 0, 0] },
];

const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp3 = (a: V3, b: V3, t: number): V3 => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

type RigProps = {
  progress: MutableRefObject<number>;
  portal: RefObject<HTMLElement | null>;
  step: number;
  copy: ScreenCopy;
  reduce: boolean;
};

function Rig({ progress, portal, step, copy, reduce }: RigProps) {
  const { size } = useThree();
  // Track the cursor on window: the copy overlay sits above the canvas, so
  // R3F's own pointer would never update.
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const move = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
  const phone = useRef<THREE.Group>(null);
  const screen = useRef<HTMLDivElement>(null);
  const look = useRef(new THREE.Vector3());
  const tmp = useMemo(
    () => ({ normal: new THREE.Vector3(), toCam: new THREE.Vector3(), q: new THREE.Quaternion() }),
    [],
  );
  const mobile = size.width / size.height < 0.9;
  const keys = mobile ? MOBILE : DESKTOP;
  // Phones: shrink a little more on short screens (e.g. 360x640) so the
  // handset never touches the nav bar.
  const scale = mobile ? 0.7 * THREE.MathUtils.clamp(size.height / 760, 0.84, 1) : 1;

  useFrame((state, dt) => {
    const g = phone.current;
    if (!g) return;
    const camera = state.camera;
    const d = Math.min(dt, 1 / 30);

    // Scroll → continuous stage index (0..4) → interpolated keyframe.
    const s = Math.min(Math.max(progress.current * 5, 0), 4);
    const i = Math.min(Math.floor(s), 3);
    const f = reduce ? Math.round(s - i) : smooth(s - i);
    const a = keys[i];
    const b = keys[i + 1];
    const cam = lerp3(a.cam, b.cam, f);
    const tgt = lerp3(a.look, b.look, f);
    const pos = lerp3(a.pos, b.pos, f);
    const rot = lerp3(a.rot, b.rot, f);

    // The "booked" beat: one full turn of the phone, landing face-on.
    if (i === 3) rot[1] += Math.PI * 2 * f;

    // Idle life + cursor parallax (skipped for reduced motion).
    const t = state.clock.elapsedTime;
    if (!reduce) {
      pos[1] += Math.sin(t * 0.9) * 0.06;
      const p = pointer.current;
      rot[0] += Math.sin(t * 0.7) * 0.02 - p.y * 0.08;
      rot[1] += p.x * 0.14;
      cam[0] += p.x * 0.35;
      cam[1] += p.y * 0.2;
    }

    // Spring-like damping toward the target (frame-rate independent).
    const k = reduce ? 30 : 4.2;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, cam[0], k, d);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, cam[1], k, d);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, cam[2], k, d);
    look.current.x = THREE.MathUtils.damp(look.current.x, tgt[0], k, d);
    look.current.y = THREE.MathUtils.damp(look.current.y, tgt[1], k, d);
    look.current.z = THREE.MathUtils.damp(look.current.z, tgt[2], k, d);
    camera.lookAt(look.current);

    g.position.x = THREE.MathUtils.damp(g.position.x, pos[0], k, d);
    g.position.y = THREE.MathUtils.damp(g.position.y, pos[1], k, d);
    g.position.z = THREE.MathUtils.damp(g.position.z, pos[2], k, d);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, rot[0], k, d);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, rot[1], k, d);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, rot[2], k, d);

    // Hide the projected DOM screen whenever the glass faces away.
    const el = screen.current;
    if (el) {
      g.getWorldQuaternion(tmp.q);
      tmp.normal.set(0, 0, 1).applyQuaternion(tmp.q);
      tmp.toCam.copy(camera.position).sub(g.position).normalize();
      const facing = tmp.normal.dot(tmp.toCam);
      el.style.opacity = String(THREE.MathUtils.clamp((facing - 0.08) * 6, 0, 1));
    }
  });

  return (
    <>
      <group ref={phone} scale={scale}>
        <PhoneModel ref={screen} step={step} copy={copy} portal={portal} />
        <Waves active={step <= 1} missed={step === 1} reduce={reduce} />
        <FloatingCards step={step} copy={copy} mobile={mobile} portal={portal} />
      </group>
      <ContactShadows position={[mobile ? 0 : 2.2, mobile ? -1.6 : -2.3, 0]} opacity={0.32} scale={9} blur={2.8} far={4} resolution={512} color="#0b2236" />
    </>
  );
}

/** Expanding rings around the handset while it rings / just rang. */
function Waves({ active, missed, reduce }: { active: boolean; missed: boolean; reduce: boolean }) {
  const rings = useRef<THREE.Mesh[]>([]);
  const color = useMemo(() => new THREE.Color(), []);
  const level = useRef(0);

  useFrame((state, dt) => {
    level.current = THREE.MathUtils.damp(level.current, active ? 1 : 0, 5, dt);
    color.set(missed ? "#ff453a" : "#38bdf8");
    rings.current.forEach((m, i) => {
      if (!m) return;
      const t = reduce ? 0.35 + i * 0.2 : (state.clock.elapsedTime * 0.45 + i / 3) % 1;
      const s = 1.05 + t * 1.7;
      m.scale.set(s * 1.05, s * 1.75, 1);
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity = (1 - t) * 0.55 * level.current;
      mat.color.lerp(color, 0.08);
    });
  });

  return (
    <group position={[0, 0, -0.25]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(m) => { if (m) rings.current[i] = m; }}>
          <ringGeometry args={[0.98, 1, 96]} />
          <meshBasicMaterial transparent opacity={0} color="#38bdf8" depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

/** Glass cards that lift off the handset at the right beat. */
function FloatingCards({
  step,
  copy,
  mobile,
  portal,
}: {
  step: number;
  copy: ScreenCopy;
  mobile: boolean;
  portal: RefObject<HTMLElement | null>;
}) {
  const df = 2.1;
  const card = (on: boolean) =>
    cn(
      "transition-[opacity,transform,filter] duration-[900ms] ease-[var(--ease-spring)]",
      on ? "opacity-100 translate-y-0 scale-100 blur-0" : "opacity-0 translate-y-8 scale-90 blur-sm",
    );

  return (
    <>
      <Html transform portal={portal as RefObject<HTMLElement>} distanceFactor={df} position={mobile ? [-0.5, -1.15, 0.7] : [-1.25, 1.15, 0.55]} rotation={[0, 0.28, 0]} zIndexRange={[6, 5]} pointerEvents="none">
        <div className={card(step === 1 || step === 2)}>
          <div className="glass flex items-center gap-3 rounded-[22px] px-4 py-3 text-ink">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 3.5c-5 0-9 3.3-9 7.5 0 2.3 1.2 4.3 3.1 5.7L5.5 20l3.9-2.1c.8.2 1.7.3 2.6.3 5 0 9-3.3 9-7.5S17 3.5 12 3.5Z" /></svg>
            </span>
            <div className="whitespace-nowrap">
              <p className="text-[15px] font-semibold">{copy.autoReplyLabel}</p>
              <p className="font-mono text-[12px] text-slate">09:42:07</p>
            </div>
          </div>
        </div>
      </Html>

      <Html transform portal={portal as RefObject<HTMLElement>} distanceFactor={df} position={mobile ? [0, 0.15, 0.9] : [-1.2, -0.35, 0.85]} rotation={[0, 0.32, 0]} zIndexRange={[6, 5]} pointerEvents="none">
        <div className={card(step === 3)}>
          <div className="w-[300px] rounded-[26px] bg-white p-5 shadow-[0_30px_80px_-20px_rgba(3,40,70,0.55)] ring-1 ring-black/5">
            <p className="mb-3 text-[13px] font-semibold text-[#0369a1]">{copy.jobCard}</p>
            <JobRows copy={copy} large />
          </div>
        </div>
      </Html>

      <Html transform portal={portal as RefObject<HTMLElement>} distanceFactor={df} position={mobile ? [0.45, -1.25, 0.7] : [1.25, 1.35, 0.6]} rotation={[0, -0.2, 0]} zIndexRange={[6, 5]} pointerEvents="none">
        <div className={card(step >= 4)}>
          <div className="glass flex items-center gap-3 rounded-full py-2.5 pl-2.5 pr-5 text-ink">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-success text-white">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
            </span>
            <span className="whitespace-nowrap text-[15px] font-semibold">{copy.booked}</span>
          </div>
        </div>
      </Html>
    </>
  );
}

/** Slow drifting dust motes: depth cues that make camera moves read as 3D. */
function Dust({ reduce }: { reduce: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const n = 420;
    const p = new Float32Array(n * 3);
    // Deterministic pseudo-random so server/client and re-mounts match.
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < n; i++) {
      p[i * 3] = (rnd() - 0.5) * 18;
      p[i * 3 + 1] = (rnd() - 0.5) * 11;
      p[i * 3 + 2] = (rnd() - 0.5) * 9 - 1.5;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    return g;
  }, []);

  useFrame((_, dt) => {
    if (reduce || !ref.current) return;
    ref.current.rotation.y += dt * 0.012;
    ref.current.position.y = (ref.current.position.y + dt * 0.04) % 1;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.028} color="#5fb6f0" transparent opacity={0.55} depthWrite={false} sizeAttenuation />
    </points>
  );
}

type StageProps = {
  progress: MutableRefObject<number>;
  step: number;
  copy: ScreenCopy;
  className?: string;
};

/**
 * drei's <Html> picks its DOM host from R3F's event target, which only
 * appears after the first commit; the host change re-creates its React root
 * on the same element and the old root's deferred unmount then wipes the
 * new content. Handing every <Html> this stable wrapper as `portal` avoids
 * the race.
 *
 * WebGL stage for the scroll story. Renders only while on screen, and fades
 * in once the first frame is ready so there's never a black flash.
 */
export default function PhoneStage({ progress, step, copy, className }: StageProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  // Client-only component (loaded with ssr: false), so window is available.
  const [reduce] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={wrap}
      className={cn(
        "transition-opacity duration-[1400ms] ease-[var(--ease-out-expo)]",
        ready ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, 1.8]}
        camera={{ fov: 30, near: 0.1, far: 60, position: [0, 0.25, 10.4] }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={() => requestAnimationFrame(() => setReady(true))}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 6, 5]} intensity={1.6} />
        <directionalLight position={[-6, -2, -4]} intensity={0.6} color="#7cc4ff" />
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={3} position={[0, 4, 4]} scale={[8, 2, 1]} />
          <Lightformer form="rect" intensity={2} color="#7cc4ff" position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 1.2, 1]} />
          <Lightformer form="rect" intensity={1.6} position={[5, -1, 1]} rotation-y={-Math.PI / 2} scale={[6, 1.2, 1]} />
          <Lightformer form="ring" intensity={1.2} color="#e0f2fe" position={[0, 0, -6]} scale={4} />
        </Environment>
        <Dust reduce={reduce} />
        <Rig progress={progress} portal={wrap} step={step} copy={copy} reduce={reduce} />
      </Canvas>
    </div>
  );
}
