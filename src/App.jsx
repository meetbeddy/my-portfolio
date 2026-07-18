import React, { useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import SideNav from "./components/layouts/SideNav";
import MobileNav from "./components/layouts/MobileNav";
import HomePage from "./components/pages/home/HomePage";
import { AnimatePresence } from "framer-motion";
import styled from "styled-components";

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

const pageMetadata = {
  '/': {
    title: 'Obed Okpala | Full-Stack Product Engineer',
    description: 'Obed Okpala builds dependable React, Angular, Node.js, and TypeScript systems for complex, real-world operations.'
  },
  '/about': {
    title: 'About | Obed Okpala',
    description: 'Learn about Obed Okpala, a full-stack product engineer with more than four years of professional software delivery experience.'
  },
  '/skills': {
    title: 'Skills and Experience | Obed Okpala',
    description: 'Explore Obed Okpala\'s experience across React, Angular, TypeScript, Node.js, NestJS, product architecture, and performance.'
  },
  '/projects': {
    title: 'Projects | Obed Okpala',
    description: 'Case studies spanning vehicle services, cooperative finance, secure elections, multi-agency systems, mobile products, and Three.js.'
  },
  '/contact': {
    title: 'Contact | Obed Okpala',
    description: 'Contact Obed Okpala about full-stack product engineering, enterprise web systems, and software collaboration.'
  },
  '/play': {
    title: 'Asteroid Field | Obed Okpala',
    description: 'Play Asteroid Field, a browser arcade game built with React, Three.js, procedural audio, adaptive combat, and responsive controls.'
  }
};

const upsertMeta = (attribute, key, content) => {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const SeoHandler = () => {
  const location = useLocation();

  useEffect(() => {
    const metadata = pageMetadata[location.pathname] || pageMetadata['/'];
    const canonicalUrl = `${window.location.origin}${location.pathname}`;
    const socialImage = `${window.location.origin}/image/obed-dark-bg.png`;

    document.title = metadata.title;
    upsertMeta('name', 'description', metadata.description);
    upsertMeta('property', 'og:title', metadata.title);
    upsertMeta('property', 'og:description', metadata.description);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:image', socialImage);
    upsertMeta('property', 'og:image:alt', 'Portrait of Obed Okpala');
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', metadata.title);
    upsertMeta('name', 'twitter:description', metadata.description);
    upsertMeta('name', 'twitter:image', socialImage);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
  }, [location]);

  return null;
};

function App() {
  return (
    <Router>
      <SeoHandler />

      <div className="App">
        <SideNav />
        <MobileNav />
        <AnimationRoutes />
      </div>
    </Router>
  );
}

export default App;
