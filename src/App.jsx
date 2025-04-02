import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/layouts/NavBar";
import SideNav from "./components/layouts/SideNav";
import HomePage from "./components/pages/home/HomePage";
import Contact from "./components/pages/contact/Contact";
import About from "./components/pages/about/About";
import Skills from "./components/pages/skills/Skills";
import * as THREE from "three";

function App() {
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const threeRef = ref.current;
    if (!threeRef) return;

    // Detect mobile devices
    const detectMobile = () => {
      setIsMobile(!!navigator.maxTouchPoints && window.PointerEvent);
    };
    detectMobile();
    window.addEventListener("resize", detectMobile);

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
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

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

    // Cleanup Function
    return () => {
      window.removeEventListener("resize", detectMobile);
      document.removeEventListener("mousemove", onMouseMove);
      threeRef.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <Router>
      <div ref={ref} className="App">
        {isMobile ? <NavBar /> : <SideNav />}

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/skills" element={<Skills />} />
          {/* <Route path="/works" element={<Work />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
