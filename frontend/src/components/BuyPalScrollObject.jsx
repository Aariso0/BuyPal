import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float, useGLTF } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import "./buypal-scroll-stage.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const chapters = [
  { id: "identity", eyebrow: "INTRODUCING BUYPAL", title: "Money moves\nbetter together.", body: "One connected experience for the way people pay, share and shop.", align: "left" },
  { id: "payments", eyebrow: "PAYMENTS, SIMPLIFIED", title: "Move money\nwithout friction.", body: "A clearer way to send, receive and keep track of money between people.", align: "right" },
  { id: "circles", eyebrow: "BUYPAL CIRCLES", title: "Keep your people\nin the picture.", body: "Bring trusted people together with shared access and clear control.", align: "left" },
  { id: "shopping", eyebrow: "INTELLIGENT SHOPPING", title: "A smarter way\nto find what you need.", body: "Discover options, compare choices and stay in control of every purchase.", align: "right" },
  { id: "together", eyebrow: "ONE CONNECTED WALLET", title: "Everything\nworks together.", body: "Payments, circles and shopping — connected in one BuyPal experience.", align: "center" },
];

function LogoModel({ progress }) {
  const root = useRef();
  const { scene } = useGLTF("/models/buypal-core.glb");
  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;
      // Keep the front and rear cyan solids opaque and correctly depth-tested.
      // The source GLB contains watertight front/back cyan meshes and a watertight blue body.
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      const clonedMaterials = materials.map((source) => {
        const material = source.clone();
        material.transparent = false;
        material.opacity = 1;
        material.depthWrite = true;
        material.side = THREE.FrontSide;
        if ("roughness" in material) material.roughness = 0.24;
        if ("metalness" in material) material.metalness = 0.18;
        material.needsUpdate = true;
        return material;
      });
      child.material = Array.isArray(child.material) ? clonedMaterials : clonedMaterials[0];
    });
    return clone;
  }, [scene]);

  useFrame((_, delta) => {
    if (!root.current) return;
    const p = progress.current;
    const smooth = (a, b, x) => {
      const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
      return t * t * (3 - 2 * t);
    };
    const reveal = smooth(0.02, 0.22, p);
    const turn = smooth(0.12, 0.91, p);
    const returnFront = smooth(0.82, 1, p);
    const rotation = turn * Math.PI * 1.45 * (1 - returnFront) + returnFront * Math.PI * 2;
    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, rotation, 4.5, delta);
    root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, -0.08 + Math.sin(p * Math.PI * 2) * 0.12, 4.5, delta);
    root.current.rotation.z = THREE.MathUtils.damp(root.current.rotation.z, Math.sin(p * Math.PI) * 0.045, 4.5, delta);
    const scale = 0.86 + reveal * 0.18 + Math.sin(p * Math.PI) * 0.035;
    root.current.scale.setScalar(THREE.MathUtils.damp(root.current.scale.x, scale, 4.5, delta));
    root.current.position.y = THREE.MathUtils.damp(root.current.position.y, Math.sin(p * Math.PI * 2) * 0.10, 4.5, delta);
  });

  return (
    <group ref={root} position={[0, 0, 0]}>
      <primitive object={model} scale={0.00355} />
    </group>
  );
}

function FinaleLogo({ progress }) {
  const root = useRef();
  const { scene } = useGLTF("/models/buypal-core.glb");
  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      const clonedMaterials = materials.map((source) => {
        const material = source.clone();
        material.transparent = false;
        material.opacity = 1;
        material.depthWrite = true;
        material.side = THREE.FrontSide;
        if ("roughness" in material) material.roughness = 0.2;
        if ("metalness" in material) material.metalness = 0.16;
        material.needsUpdate = true;
        return material;
      });
      child.material = Array.isArray(child.material) ? clonedMaterials : clonedMaterials[0];
      // The cyan front and rear layers begin slightly apart in depth, then
      // slide into their exact watertight positions around the solid blue core.
      if (child.name === "Cyan_Foreground_Front") child.position.z = 132;
      if (child.name === "Cyan_Foreground_Back") child.position.z = -132;
    });
    return clone;
  }, [scene]);

  useFrame((_, delta) => {
    if (!root.current) return;
    const p = THREE.MathUtils.clamp(progress.current, 0, 1);
    const settle = THREE.MathUtils.smoothstep(p, 0.08, 0.78);
    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, -0.72 + settle * (Math.PI * 2 + 0.72), 4.2, delta);
    root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, 0.12 * (1 - settle), 4.2, delta);
    root.current.scale.setScalar(THREE.MathUtils.damp(root.current.scale.x, 0.88 + settle * 0.16, 4.2, delta));
    root.current.position.y = THREE.MathUtils.damp(root.current.position.y, Math.sin(settle * Math.PI) * 0.08, 4.2, delta);
    model.traverse((child) => {
      if (child.name === "Cyan_Foreground_Front") child.position.z = THREE.MathUtils.damp(child.position.z, 0, 5, delta);
      if (child.name === "Cyan_Foreground_Back") child.position.z = THREE.MathUtils.damp(child.position.z, 0, 5, delta);
    });
  });

  return <group ref={root}><primitive object={model} scale={0.00355} /></group>;
}

function FinaleScene({ progress }) {
  return (
    <Canvas camera={{ position: [0, 0, 3.8], fov: 34 }} dpr={[1, 1.6]} gl={{ antialias: true, alpha: true }}>
      <color attach="background" args={["#f7fbff"]} />
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 5, 5]} intensity={2.3} />
      <directionalLight position={[-4, 1, 3]} intensity={1.15} color="#a8f5ff" />
      <Suspense fallback={null}>
        <Environment preset="studio" />
        <FinaleLogo progress={progress} />
        <ContactShadows position={[0, -0.88, 0]} opacity={0.2} scale={4.4} blur={2.8} far={2.5} />
      </Suspense>
    </Canvas>
  );
}

function Scene({ progress }) {
  return (
    <Canvas camera={{ position: [0, 0, 3.7], fov: 34 }} dpr={[1, 1.6]} gl={{ antialias: true, alpha: true }}>
      <color attach="background" args={["#ffffff"]} />
      <ambientLight intensity={1.15} />
      <directionalLight position={[3, 5, 5]} intensity={2.2} />
      <directionalLight position={[-4, 1, 3]} intensity={1.1} color="#a8f5ff" />
      <Suspense fallback={null}>
        <Environment preset="studio" />
        <Float speed={0.65} rotationIntensity={0.025} floatIntensity={0.09}>
          <LogoModel progress={progress} />
        </Float>
        <ContactShadows position={[0, -0.88, 0]} opacity={0.18} scale={4.5} blur={2.8} far={2.5} />
      </Suspense>
    </Canvas>
  );
}

export default function BuyPalScrollObject() {
  const host = useRef(null);
  const progress = useRef(0);
  const chapterRefs = useRef([]);
  const meter = useRef(null);
  const finale = useRef(null);
  const finaleProgress = useRef(0);

  useGSAP(() => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: host.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.1,
        invalidateOnRefresh: true,
      },
    });
    timeline.to(progress, { current: 1, duration: 1, ease: "none" }, 0);
    chapterRefs.current.forEach((chapter, index) => {
      if (!chapter) return;
      const start = index / chapters.length;
      const end = (index + 1) / chapters.length;
      timeline.fromTo(chapter,
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 0.08, ease: "power2.out" },
        start + 0.012
      );
      timeline.to(chapter, { autoAlpha: 0, y: -22, duration: 0.07, ease: "power2.in" }, end - 0.065);
    });
    if (meter.current) timeline.to(meter.current, { scaleX: 1, duration: 1, ease: "none" }, 0);
    gsap.to(finaleProgress, {
      current: 1,
      ease: "none",
      scrollTrigger: {
        trigger: finale.current,
        start: "top bottom",
        end: "center center",
        scrub: 1.15,
        invalidateOnRefresh: true,
      },
    });
    return () => {
      timeline.scrollTrigger?.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === finale.current) trigger.kill();
      });
    };
  }, { scope: host });

  return (
    <main className="buypal-experience">
      <header className="bp-nav">
        <a className="bp-brand" href="#top" aria-label="BuyPal home">
          <img src="/buypal-logo.png" alt="BuyPal" />
        </a>
        <nav aria-label="Main navigation">
          <a href="#payments">Payments</a><a href="#circles">Circles</a><a href="#shopping">AI Shopping</a>
        </nav>
        <div className="bp-nav-actions"><a className="bp-nav-login" href="/login">Log in</a><a className="bp-nav-cta" href="/register">Get started <span>↗</span></a></div>
      </header>

      <section className="bp-intro" id="top">
        <div className="bp-intro-copy">
          <h1>Money moves<br />better together.</h1>
          <p>Payments, people and smarter shopping — connected in one place.</p>
          <a className="bp-primary" href="#experience">Explore BuyPal <span>↓</span></a>
        </div>
        <div className="bp-intro-art">
          <img
            src="/buypal-dashboard-circle.webp"
            alt="BuyPal dashboard on a laptop with the My Circle card floating beside it"
            fetchPriority="high"
          />
        </div>
      </section>

      <section className="buypal-scroll-stage" id="experience" ref={host}>
        <div className="buypal-sticky-scene">
          <div className="bp-scene-label">THE BUYPAL CORE</div>
          <Scene progress={progress} />
          <div className="bp-chapter-layer">
            {chapters.map((chapter, index) => (
              <article key={chapter.id} id={chapter.id} className={`bp-chapter bp-chapter-${chapter.align}`} ref={(el) => (chapterRefs.current[index] = el)}>
                <span className="bp-kicker">{chapter.eyebrow}</span>
                <h2>{chapter.title.split("\n").map((line, i) => <span key={i}>{line}</span>)}</h2>
                <p>{chapter.body}</p>
              </article>
            ))}
          </div>
          <div className="bp-scroll-progress"><span ref={meter}/></div>
          <div className="bp-scene-foot"><span>SCROLL TO TRANSFORM</span><span>BUYPAL / 2026</span></div>
        </div>
      </section>

      <section className="bp-finale" id="get-started" ref={finale}>
        <div className="bp-finale-visual" aria-label="BuyPal 3D logo assembling into its complete form">
          <FinaleScene progress={finaleProgress} />
          <span className="bp-finale-caption">BUYPAL · ONE CONNECTED EXPERIENCE</span>
        </div>
        <div className="bp-finale-copy">
          <span className="bp-finale-eyebrow">THE NEXT MOVE IS YOURS</span>
          <h2>Everything connected.<br/><span>Everything simpler.</span></h2>
          <p>Payments, circles and smarter shopping — bring them together with BuyPal.</p>
          <a className="bp-primary" href="/register">Get started with BuyPal <span>↗</span></a>
        </div>
      </section>

      <section className="bp-about" id="about">
        <div className="bp-about-heading">
          <span className="bp-finale-eyebrow">THE IDEA BEHIND BUYPAL</span>
          <h2>Payments should<br/>bring people together.</h2>
        </div>
        <div className="bp-about-story">
          <p>BuyPal explores a more connected way to manage money with the people around you. Shared payment experiences, controlled access through Circles, and AI-assisted shopping come together in one place.</p>
          <p>Built as a prototype for the PayPal AI Hackathon, BuyPal demonstrates how intelligent assistance and connected financial experiences could work together — while keeping people in control of their payment decisions.</p>
          <span className="bp-prototype-note">Independent hackathon prototype · Not an official PayPal product or financial service</span>
        </div>
      </section>
    </main>
  );
}

useGLTF.preload("/models/buypal-core.glb");
