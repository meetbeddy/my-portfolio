import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import SideNav from "./components/layouts/SideNav";
import HomePage from "./components/pages/home/HomePage";
import Contact from "./components/pages/contact/Contact";
import About from "./components/pages/about/Index";
import Skills from "./components/pages/skills/Skills";
import * as THREE from "three";
import { AnimatePresence } from "framer-motion";
import styled from "styled-components";
import Projects from "./components/pages/work/Work";
import CursorGlow from "./components/shared/CursorGlow";
// Lazy-load game so Three.js (~600 KB) stays out of the main bundle
const AsteroidGame = lazy(() => import("./components/pages/game/AsteroidGame"));

const LoadingScreen = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${props => props.theme.colors.background};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  transition: opacity 0.5s ease;
  opacity: ${props => props.isLoading ? 1 : 0};
  pointer-events: ${props => props.isLoading ? 'all' : 'none'};
`;

const LoadingContent = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.text};
  
  h2 {
    margin-bottom: ${props => props.theme.spacing.xl};
    font-size: ${props => props.theme.typography.fontSizes.xl};
    letter-spacing: 2px;
  }
  
  .spinner {
    width: 60px;
    height: 60px;
    margin: 0 auto;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: ${props => props.theme.colors.primary};
    animation: spin 1s ease-in-out infinite;
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  }
`;

const AnimationRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/projects" element={<Projects />} />
        <Route
          path="/play"
          element={
            <Suspense fallback={null}>
              <AsteroidGame />
            </Suspense>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    // Show loading screen
    setIsLoading(true);

    const threeRef = ref.current;
    if (!threeRef) return;

    // THREE.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 2); // Better initial position

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    ref.current.appendChild(renderer.domElement);

    // Create Sphere
    const geometry = new THREE.SphereGeometry(0.5, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      metalness: 0.7,
      roughness: 0.2,
      color: new THREE.Color(0x292929),
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Lighting
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    const redLight = new THREE.PointLight(0xff0000, 1);
    redLight.position.set(-1.86, 1, -1.65);
    scene.add(redLight);

    const softLight = new THREE.PointLight(0xe1fff, 1);
    softLight.position.set(2.13, 1, 0.65);
    scene.add(softLight);

    // Handle Window Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Mouse Interaction Variables
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const onMouseMove = (event) => {
      mouseX = (event.clientX - windowHalfX) / 50; // Reduce sensitivity
      mouseY = (event.clientY - windowHalfY) / 50;
    };
    document.addEventListener("mousemove", onMouseMove);

    // Animation Loop
    const clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smoothly interpolate rotation
      targetX += (mouseX - targetX) * 0.1;
      targetY += (mouseY - targetY) * 0.1;

      sphere.rotation.y = targetX; // Left/Right movement
      sphere.rotation.x = targetY; // Up/Down movement
      sphere.rotation.z = 0.5 * elapsedTime; // Continuous spin effect

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Hide loading quickly — no need for a long artificial delay
    setTimeout(() => {
      setIsLoading(false);
    }, 200);

    // Cleanup Function
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousemove", onMouseMove);
      threeRef.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <Router>
      <CursorGlow />
      <LoadingScreen isLoading={isLoading}>
        <LoadingContent>
          <h2>Loading Experience</h2>
          <div className="spinner"></div>
        </LoadingContent>
      </LoadingScreen>

      <div ref={ref} className="App">
        <SideNav />
        <AnimationRoutes />
      </div>
    </Router>
  );
}

export default App;