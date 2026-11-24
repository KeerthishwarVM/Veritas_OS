import { Component, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { isMobile } from '../theme'

const MODEL_URL = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb'

class ErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(err) { console.warn('Head model failed to load, using procedural fallback:', err) }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}

const gauss = (v, c, s) => Math.exp(-((v - c) ** 2) / s)

// Sculpted fallback: cranium, eye sockets, brow, nose bridge, cheekbones, lips, tapered jaw and chin.
function makeProcHead(seg) {
  const g = new THREE.SphereGeometry(1, seg, seg)
  const p = g.attributes.position
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i) * 0.76, y = p.getY(i) * 1.08, z = p.getZ(i) * 0.9
    if (y < -0.1) { const k = Math.pow(Math.min(1, (-0.1 - y) / 0.95), 1.3); x *= 1 - 0.48 * k; z *= 1 - 0.1 * k; y -= 0.06 * k }
    if (z > 0) {
      const ax = Math.abs(x)
      z -= 0.13 * gauss(ax, 0.3, 0.02) * gauss(y, 0.14, 0.015)
      z += 0.07 * gauss(y, 0.3, 0.008) * Math.exp(-(x * x) / 0.35)
      z += 0.16 * gauss(x, 0, 0.006) * gauss(y, 0, 0.05)
      z += 0.2 * gauss(x, 0, 0.012) * gauss(y, -0.2, 0.012)
      z += 0.09 * gauss(ax, 0.46, 0.02) * gauss(y, -0.05, 0.03)
      z += 0.05 * gauss(x, 0, 0.05) * gauss(y, -0.48, 0.004)
      z += 0.07 * gauss(x, 0, 0.025) * gauss(y, -0.88, 0.008)
    }
    p.setXYZ(i, x, y, z)
  }
  g.computeVertexNormals()
  return g
}

const RIM_VERT = 'varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }'
const RIM_FRAG = 'uniform vec3 uColor; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.5); gl_FragColor = vec4(uColor * f * 1.4, f); }'

// Shared glitch rig: matte core + wireframe + chromatic ghosts + rim light + vertex tearing + floating blocks.
function Rig({ geometry, overRef, mobile, wireOpacity, y = 0, children }) {
  const group = useRef(), blocksRef = useRef(), ghosts = useRef([])
  const burst = useRef({ end: 0, next: 1, y: 0, off: 0, h: 0.1 })
  const dirty = useRef(false)
  const base = useMemo(() => geometry.attributes.position.array.slice(), [geometry])
  const rim = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color('#CCFF00') } }, vertexShader: RIM_VERT, fragmentShader: RIM_FRAG,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }), [])
  const blocks = useMemo(() => Array.from({ length: mobile ? 6 : 14 }, () => ({
    p: [(Math.random() - 0.5) * 4.4, (Math.random() - 0.4) * 3.6, (Math.random() - 0.2) * 1.5],
    s: [0.12 + Math.random() * 0.35, 0.04 + Math.random() * 0.08, 0.05],
    c: Math.random() > 0.5 ? '#CCFF00' : '#FF5500',
  })), [mobile])

  useFrame((s, dt) => {
    const t = s.clock.elapsedTime, over = overRef.current, g = group.current
    const k = Math.min(1, dt * (over ? 8 : 3))
    g.rotation.y += (s.pointer.x * (over ? 1 : 0.35) + Math.sin(t * 0.5) * 0.15 - g.rotation.y) * k
    g.rotation.x += (-s.pointer.y * 0.25 - g.rotation.x) * k
    g.rotation.z = over ? (Math.random() - 0.5) * 0.06 : g.rotation.z * 0.8
    g.scale.setScalar(1 + Math.sin(t * 1.5) * 0.012)

    const b = burst.current
    if (t > b.next) {
      b.end = t + (over ? 0.25 : 0.12)
      b.next = t + (over ? 0.12 + Math.random() * 0.2 : 1.8 + Math.random() * 2.5)
      b.y = (Math.random() * 2 - 1) * 1.2; b.h = 0.08 + Math.random() * (over ? 0.4 : 0.15); b.off = (Math.random() - 0.5) * (over ? 0.9 : 0.35)
    }
    const active = t < b.end
    if (active || dirty.current) {
      const pos = geometry.attributes.position.array
      for (let i = 0; i < pos.length; i += 3) pos[i] = base[i] + (active && Math.abs(base[i + 1] - b.y) < b.h ? b.off : 0)
      geometry.attributes.position.needsUpdate = true
      dirty.current = active
    }

    const split = over ? 0.07 + Math.random() * 0.05 : active ? 0.03 : 0.012
    ghosts.current[0].position.x = split; ghosts.current[1].position.x = -split
    ghosts.current.forEach((m) => { m.visible = !mobile || over || active })
    rim.uniforms.uColor.value.set(over || active ? '#FF5500' : '#CCFF00')
    blocksRef.current.children.forEach((m, i) => {
      if (Math.random() < (over ? 0.2 : 0.02)) { m.position.x = blocks[i].p[0] + (Math.random() - 0.5) * 0.8; m.visible = Math.random() > 0.2 }
    })
  })

  return (
    <group ref={group} position={[0, y, 0]}>
      <mesh geometry={geometry}>
        <meshBasicMaterial color="#0A0A0A" polygonOffset polygonOffsetFactor={1} polygonOffsetUnits={1} />
      </mesh>
      <mesh geometry={geometry}><meshBasicMaterial color="#F2EFE9" wireframe transparent opacity={wireOpacity} /></mesh>
      <mesh geometry={geometry}><primitive object={rim} attach="material" /></mesh>
      <mesh ref={(el) => (ghosts.current[0] = el)} geometry={geometry}><meshBasicMaterial color="#FF5500" wireframe transparent opacity={0.3} depthWrite={false} /></mesh>
      <mesh ref={(el) => (ghosts.current[1] = el)} geometry={geometry}><meshBasicMaterial color="#00E5FF" wireframe transparent opacity={0.22} depthWrite={false} /></mesh>
      {children}
      <group ref={blocksRef}>
        {blocks.map((b, i) => (<mesh key={i} position={b.p}><boxGeometry args={b.s} /><meshBasicMaterial color={b.c} /></mesh>))}
      </group>
    </group>
  )
}

function ModelBust(props) {
  const { scene } = useGLTF(MODEL_URL)
  const geometry = useMemo(() => {
    scene.updateMatrixWorld(true)
    let mesh = null
    scene.traverse((o) => { if (o.isMesh && !mesh) mesh = o })
    if (!mesh) throw new Error('No mesh found in GLB')
    const g = mesh.geometry.clone()
    const pa = g.attributes.position, arr = new Float32Array(pa.count * 3)
    for (let i = 0; i < pa.count; i++) { arr[i * 3] = pa.getX(i); arr[i * 3 + 1] = pa.getY(i); arr[i * 3 + 2] = pa.getZ(i) }
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    g.applyMatrix4(mesh.matrixWorld)
    g.computeBoundingBox()
    const size = g.boundingBox.getSize(new THREE.Vector3()), c = g.boundingBox.getCenter(new THREE.Vector3())
    g.translate(-c.x, -c.y, -c.z)
    const k = 2.7 / size.y
    g.scale(k, k, k)
    return g
  }, [scene])
  return <Rig geometry={geometry} wireOpacity={0.5} {...props} />
}

function ProcBust(props) {
  const head = useMemo(() => makeProcHead(props.mobile ? 28 : 44), [props.mobile])
  const shoulders = useMemo(() => { const g = new THREE.SphereGeometry(1, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2); g.scale(1.9, 0.75, 0.95); return g }, [])
  const neck = useMemo(() => new THREE.CylinderGeometry(0.32, 0.42, 0.9, 14, 8), [])
  return (
    <Rig geometry={head} wireOpacity={0.9} y={0.3} {...props}>
      <mesh geometry={neck} position={[0, -1.2, 0]}><meshBasicMaterial color="#F2EFE9" wireframe transparent opacity={0.5} /></mesh>
      <mesh geometry={shoulders} position={[0, -1.65, 0]}><meshBasicMaterial color="#F2EFE9" wireframe transparent opacity={0.45} /></mesh>
    </Rig>
  )
}

export default function HeroBust3D() {
  const overRef = useRef(false), ptr = useRef({ x: 0, y: 0 }), tm = useRef(null)
  const [over, setOverUi] = useState(false)
  const [hud, setHud] = useState({ x: 0, y: 0, z: 0, p: 87 })
  const mobile = isMobile()
  const setOver = (v) => { overRef.current = v; setOverUi(v) }

  useEffect(() => {
    const id = setInterval(() => setHud({ x: ptr.current.x, y: ptr.current.y, z: +(Math.sin(Date.now() / 700) * 0.5).toFixed(2), p: overRef.current ? 60 + Math.floor(Math.random() * 40) : 85 + Math.floor(Math.random() * 4) }), 120)
    return () => { clearInterval(id); clearTimeout(tm.current) }
  }, [])

  const rig = { overRef, mobile }
  return (
    <div
      className={`relative h-[340px] w-full overflow-hidden md:h-[420px] ${over ? 'bust-over' : ''}`}
      style={{ touchAction: 'pan-y' }}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setOver(true)}
      onPointerLeave={() => setOver(false)}
      onPointerDown={(e) => {
        if (e.pointerType !== 'touch') return
        setOver(true); clearTimeout(tm.current); tm.current = setTimeout(() => setOver(false), 1500)
      }}
      onPointerMove={(e) => {
        const b = e.currentTarget.getBoundingClientRect()
        ptr.current = { x: +(((e.clientX - b.left) / b.width - 0.5) * 2).toFixed(2), y: +(-((e.clientY - b.top) / b.height - 0.5) * 2).toFixed(2) }
      }}
    >
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5.2], fov: 40 }} gl={{ antialias: false, alpha: true }}>
        <ErrorBoundary fallback={<ProcBust {...rig} />}>
          <Suspense fallback={<ProcBust {...rig} />}>
            <ModelBust {...rig} />
          </Suspense>
        </ErrorBoundary>
      </Canvas>
      <div className="scanlines pointer-events-none absolute inset-0" />
      <div className={`pointer-events-none absolute left-2 top-2 font-mono text-[10px] ${over ? 'text-crimson' : 'text-lime'}`}>
        &gt;RENDERING... {hud.p}%
      </div>
      <div className="pointer-events-none absolute bottom-2 left-2 font-mono text-[10px] leading-4 text-bone/80">
        <div>X {hud.x >= 0 ? '+' : ''}{hud.x.toFixed(2)}</div><div>Y {hud.y >= 0 ? '+' : ''}{hud.y.toFixed(2)}</div><div>Z {hud.z >= 0 ? '+' : ''}{hud.z.toFixed(2)}</div>
      </div>
      <div className="pointer-events-none absolute bottom-2 right-2 font-mono text-[10px] text-orange">{over ? 'OVERDRIVE // SIGNAL BREACH' : 'IDLE // SCANNING'}</div>
    </div>
  )
}