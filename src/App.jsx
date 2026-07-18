import React, { useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import SideNav from "./components/layouts/SideNav";
import MobileNav from "./components/layouts/MobileNav";
import HomePage from "./components/pages/home/HomePage";
import { AnimatePresence } from "framer-motion";
import styled from "styled-components";
import CursorGlow from "./components/shared/CursorGlow";

const About = lazy(() => import("./components/pages/about/Index"));
const Contact = lazy(() => import("./components/pages/contact/Contact"));
const Skills = lazy(() => import("./components/pages/skills/Skills"));
const Projects = lazy(() => import("./components/pages/work/Work"));
const AsteroidGame = lazy(() => import("./components/pages/game/AsteroidGame"));

const RouteFallback = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 76px;
  background: ${props => props.theme.colors.background};
  display: grid;
  place-items: center;
  color: ${props => props.theme.colors.textMuted};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    left: 0;
  }
`;

const AnimationRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<RouteFallback role="status">Loading page...</RouteFallback>}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/play" element={<AsteroidGame />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

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
  return (
    <Router>
      <PageTitleHandler />
      <CursorGlow />

      <div className="App">
        <SideNav />
        <MobileNav />
        <AnimationRoutes />
      </div>
    </Router>
  );
}

export default App;
