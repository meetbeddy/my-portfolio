import React from "react";
import NavItem from "./NavItem";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

// ─── Animation variants (fast fade/slide — no sluggish springs) ──────────────
const desktopVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.25, ease: "easeOut", staggerChildren: 0.06, delayChildren: 0.1 }
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: "easeOut" } },
  hover: { scale: 1.15, transition: { duration: 0.15 } },
};

// ─── Styled components ────────────────────────────────────────────────────────
const StyledSideNav = styled(motion.nav)`
  position: fixed;
  height: 100vh;
  width: 76px;
  z-index: 200;
  top: 0;
  left: 0;
  background: #0d0d0d;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2.5rem 0;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 2px;
    height: 100%;
    background: #e04848;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 2rem 0;
`;

const Logo = styled(motion.div)`
  position: absolute;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  width: 36px;
  height: 36px;
  border-radius: 4px;
  background: #e04848;
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    font-size: 1rem;
    color: #fff;
    font-weight: 800;
    letter-spacing: 0;
    font-family: 'Outfit', sans-serif;
  }
`;

const SocialContainer = styled(motion.div)`
  position: absolute;
  bottom: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.85rem;

  a {
    color: rgba(255, 255, 255, 0.45);
    font-size: 1rem;
    transition: color 0.2s ease, transform 0.2s ease;
    line-height: 1;

    &:hover {
      color: #e04848;
      transform: scale(1.25);
    }
  }
`;

const Divider = styled.div`
  width: 30px;
  height: 1px;
  background: rgba(255, 255, 255, 0.14);
  margin: 0.5rem 0;
`;


// ─── Component ────────────────────────────────────────────────────────────────
const SideNav = () => {
  const location = useLocation();

  // Hide nav on the fullscreen game page
  if (location.pathname === '/play') return null;

  const navigationItems = [
    { path: "/", name: "Home", icon: "fa fa-home", key: 1 },
    { path: "/about", name: "About", icon: "fa fa-user", key: 2 },
    { path: "/skills", name: "Skills", icon: "fa fa-cogs", key: 3 },
    { path: "/projects", name: "Works", icon: "fa fa-briefcase", key: 4 },
    { path: "/contact", name: "Contact", icon: "fa fa-envelope", key: 5 },
    { path: "/play", name: "Play", icon: "fa fa-gamepad", key: 6 },
  ];

  const socialLinks = [
    { icon: "fab fa-github", name: "GitHub", url: "https://github.com/meetbeddy", key: 1 },
    { icon: "fab fa-linkedin", name: "LinkedIn", url: "https://linkedin.com/in/obed-okpala", key: 2 },
  ];

  return (
    <StyledSideNav
      aria-label="Primary navigation"
      variants={desktopVariants}
      initial="hidden"
      animate="visible"
    >
      <Logo
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4, type: "spring" }}
      >
        <span>OB</span>
      </Logo>

      <NavContainer>
        <Divider />
        {navigationItems.map((item) => (
          <NavItem
            key={item.key}
            path={item.path}
            name={item.name}
            icon={item.icon}
            active={item.path === location.pathname}
            variants={itemVariants}
          />
        ))}
        <Divider />
      </NavContainer>

      <SocialContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {socialLinks.map((link) => (
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.name}
            key={link.key}
          >
            <i className={link.icon} aria-hidden="true" />
          </a>
        ))}
      </SocialContainer>
    </StyledSideNav>
  );
};


export default SideNav;
