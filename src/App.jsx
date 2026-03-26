import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import SideNav from "./components/layouts/SideNav";
import MobileNav from "./components/layouts/MobileNav";
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
const Background   = lazy(() => import("./components/shared/Background"));

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
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.8s;
  opacity: ${props => props.$isLoading ? 1 : 0};
  visibility: ${props => props.$isLoading ? 'visible' : 'hidden'};
  pointer-events: none;
`;

const LoadingContent = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.text};
  
  h2 {
    margin-bottom: ${props => props.theme.spacing.xl};
    font-size: ${props => props.theme.typography.fontSizes.xl};
    font-family: 'Outfit', sans-serif;
    letter-spacing: 4px;
    text-transform: uppercase;
    font-weight: 800;
  }
  
  .spinner {
    width: 50px;
    height: 50px;
    margin: 0 auto;
    border: 2px solid rgba(224, 72, 72, 0.1);
    border-radius: 50%;
    border-top: 2px solid ${props => props.theme.colors.primary};
    animation: spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    
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

// --- DYNAMIC TITLES ---
// --- DYNAMIC TITLES ---
const PageTitleHandler = () => {
  const location = useLocation();
  useEffect(() => {
    const path = location.pathname.split("/").filter(Boolean).pop();
    const pageName = path ? path.charAt(0).toUpperCase() + path.slice(1) : "Home";
    document.title = `${pageName} | Meet Beddy`;
  }, [location]);
  return null;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ensure loading screen shows for at least a moment to prevent flicker
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <PageTitleHandler />
      <CursorGlow />
      
      <LoadingScreen $isLoading={isLoading}>
        <LoadingContent>
          <h2>Meet Beddy</h2>
          <div className="spinner"></div>
        </LoadingContent>
      </LoadingScreen>

      <div className="App">
        <Suspense fallback={null}>
          <Background />
        </Suspense>
        <SideNav />
        <MobileNav />
        <AnimationRoutes />
      </div>
    </Router>
  );
}

export default App;