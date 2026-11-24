import { useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useRef } from 'react'
import GlitchText from './GlitchText'
import { Panel } from './ui'
import { isMobile } from '../theme'

function Globe() {
  const ref = useRef()
  const mobile = isMobile()
  const nodes = useMemo(() => {
    const n = mobile ? 40 : 90, arr = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(1.5)
      arr.set([v.x, v.y, v.z], i * 3)
    }
    return arr
  }, [mobile])
  useFrame((_, dt) => { ref.current.rotation.y += dt * 0.15 })
  return (
    <group ref={ref}>
      <mesh><sphereGeometry args={[1.5, mobile ? 18 : 28, mobile ? 12 : 18]} /><meshBasicMaterial color="#F2EFE9" wireframe transparent opacity={0.25} /></mesh>
      <mesh rotation={[Math.PI / 2.3, 0, 0]}><torusGeometry args={[1.9, 0.008, 8, 90]} /><meshBasicMaterial color="#FF5500" /></mesh>
      <points>
        <bufferGeometry><bufferAttribute attach="attributes-position" count={nodes.length / 3} array={nodes} itemSize={3} /></bufferGeometry>
        <pointsMaterial color="#CCFF00" size={0.07} />
      </points>
    </group>
  )
}

const STEPS = [
  ['YOUTUBE / SHORTS', 'The video link goes straight to the AI, which watches and listens to it, then checks what is said and shown.'],
  ['ARTICLE & WEB LINKS', 'We open the page like a browser, pull out the readable article text and verify it.'],
  ['RAW TEXT', 'Paste any post, headline or forwarded message and it is analysed claim by claim.'],
  ['PHOTO SCAN', 'Screenshots, memes and forwarded images are read by the AI, including the text inside them.'],
]

export default function AboutPage() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden px-4 py-10 md:px-8">
      <div className="absolute inset-0 opacity-70 md:left-1/3">
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 45 }}>
          <Globe />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.2} />
        </Canvas>
      </div>
      <div className="pointer-events-none relative z-10 max-w-3xl space-y-6">
        <GlitchText as="h1" className="pointer-events-auto font-display text-5xl md:text-8xl">ABOUT VERITAS_OS</GlitchText>
        <Panel tag="/ORIGIN" className="pointer-events-auto bg-carbon/80">
          <GlitchText as="p" className="font-mono text-sm leading-relaxed">
            Veritas is Latin for truth. Roman tradition made it a goddess, said to hide at the bottom of a well. VERITAS_OS is a tool for digging her out: paste a claim, link or image and get an evidence-based verdict in seconds.
          </GlitchText>
        </Panel>
        <Panel tag="/HOW_IT_WORKS // 4 MODES" className="pointer-events-auto bg-carbon/80">
          <ul className="space-y-4">
            {STEPS.map(([t, d]) => (
              <li key={t}><GlitchText as="div" className="font-mono text-xs font-bold text-orange">{t}</GlitchText><GlitchText as="p" className="font-mono text-xs leading-relaxed text-bone/80">{d}</GlitchText></li>
            ))}
          </ul>
          <GlitchText as="p" className="mt-4 font-mono text-xs leading-relaxed text-bone/80">Every mode returns the same dossier: a verdict, a confidence score, sensationalism and manipulation levels, a fact-versus-opinion split, highlighted red flags and a card for each claim.</GlitchText>
        </Panel>
        <Panel tag="/CAPABILITIES" className="pointer-events-auto bg-carbon/80">
          <GlitchText as="p" className="font-mono text-xs leading-relaxed text-bone/80">Video, link, text and image checking. Claim-by-claim evidence. Local scan history you can open or delete anytime. Nothing is stored on a server.</GlitchText>
        </Panel>
      </div>
    </section>
  )
}
