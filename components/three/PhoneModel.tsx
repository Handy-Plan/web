"use client";

import { forwardRef, useMemo, type RefObject } from "react";
import * as THREE from "three";
import { Html, RoundedBox } from "@react-three/drei";
import PhoneScreen, { SCREEN_PX, type ScreenCopy } from "./PhoneScreen";

/** Phone body in world units (roughly a 6.1" handset at 1u = 4.5cm). */
export const PHONE = { w: 1.62, h: 3.32, d: 0.19, r: 0.25 } as const;
const GLASS = { w: 1.5, h: 3.18, r: 0.2 } as const;

/** Rounded-rectangle outline, centred on the origin. */
function roundedRect(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

type Props = {
  step: number;
  copy: ScreenCopy;
  /** Stable DOM host for <Html>; see PhoneStage. */
  portal: RefObject<HTMLElement | null>;
};

/**
 * Procedural handset: brushed-titanium frame, black glass, side keys and a
 * camera plateau on the back (seen when the phone spins on "booked"). The
 * live screen is real DOM projected onto the glass with drei's <Html
 * transform>, so text is crisp and translatable. The forwarded ref is the
 * screen's DOM wrapper, which the stage hides when the glass faces away.
 */
const PhoneModel = forwardRef<HTMLDivElement, Props>(function PhoneModel({ step, copy, portal }, screenRef) {
  const glassGeo = useMemo(() => new THREE.ShapeGeometry(roundedRect(GLASS.w, GLASS.h, GLASS.r), 24), []);

  // CSS px → world units: drei maps 1px to distanceFactor / 400 units.
  const distanceFactor = (GLASS.w * 400) / SCREEN_PX.w;

  return (
    <group>
      {/* Frame */}
      <RoundedBox args={[PHONE.w, PHONE.h, PHONE.d]} radius={PHONE.r} smoothness={10} bevelSegments={6} creaseAngle={0.5}>
        <meshPhysicalMaterial color="#3a3f47" metalness={0.92} roughness={0.32} clearcoat={0.7} clearcoatRoughness={0.25} envMapIntensity={1.25} />
      </RoundedBox>

      {/* Front glass (black until the DOM screen sits on it) */}
      <mesh geometry={glassGeo} position={[0, 0, PHONE.d / 2 + 0.001]}>
        <meshPhysicalMaterial color="#020305" roughness={0.06} metalness={0.2} clearcoat={1} reflectivity={0.6} />
      </mesh>

      {/* Back glass + camera plateau */}
      <mesh geometry={glassGeo} position={[0, 0, -PHONE.d / 2 - 0.001]} rotation={[0, Math.PI, 0]}>
        <meshPhysicalMaterial color="#1b2a3a" roughness={0.42} metalness={0.3} clearcoat={0.8} />
      </mesh>
      <group position={[-0.36, 1.18, -PHONE.d / 2 - 0.035]}>
        <RoundedBox args={[0.66, 0.66, 0.06]} radius={0.16} smoothness={6}>
          <meshPhysicalMaterial color="#223447" roughness={0.3} metalness={0.4} clearcoat={1} />
        </RoundedBox>
        {[
          [-0.14, 0.14],
          [0.14, -0.04],
          [-0.14, -0.18],
        ].map(([x, y], i) => (
          <mesh key={i} position={[x, y, -0.04]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.105, 0.105, 0.05, 40]} />
            <meshPhysicalMaterial color="#05070a" roughness={0.05} metalness={0.6} clearcoat={1} />
          </mesh>
        ))}
      </group>

      {/* Side keys */}
      {[
        { x: PHONE.w / 2 + 0.012, y: 0.62, h: 0.5 },
        { x: -PHONE.w / 2 - 0.012, y: 0.86, h: 0.2 },
        { x: -PHONE.w / 2 - 0.012, y: 0.44, h: 0.36 },
        { x: -PHONE.w / 2 - 0.012, y: 0.0, h: 0.36 },
      ].map((k, i) => (
        <RoundedBox key={i} args={[0.03, k.h, 0.07]} radius={0.012} position={[k.x, k.y, 0]}>
          <meshPhysicalMaterial color="#4a5059" metalness={0.95} roughness={0.25} />
        </RoundedBox>
      ))}

      {/* Live screen */}
      <Html
        transform
        portal={portal as RefObject<HTMLElement>}
        distanceFactor={distanceFactor}
        position={[0, 0, PHONE.d / 2 + 0.004]}
        zIndexRange={[4, 0]}
        pointerEvents="none"
      >
        <div ref={screenRef} style={{ backfaceVisibility: "hidden" }}>
          <PhoneScreen step={step} copy={copy} />
        </div>
      </Html>
    </group>
  );
});

export default PhoneModel;
