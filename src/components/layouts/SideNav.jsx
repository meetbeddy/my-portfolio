import React from "react";
import NavItem from "./NavItem";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import useIsMobile from "../../hook/useIsMobile";

// ─── Animation variants (fast fade/slide — no sluggish springs) ──────────────
const desktopVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.25, ease: "easeOut", staggerChildren: 0.06, delayChildren: 0.1 }
  },
};

const mobileVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.22, ease: "easeOut", staggerChildren: 0.05, delayChildren: 0.05 }
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: "easeOut" } },
  hover: { scale: 1.15, transition: { duration: 0.15 } },
};

const mobileItemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.18, ease: "easeOut" } },
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
  background: rgba(14, 14, 22, 0.82);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 2px 0 20px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2.5rem 0;

  /* Red gradient left accent line (former style) */
  &::before {
    content: '';
    position: absolute;
    top: 15%;
    left: 0;
    width: 2px;
    height: 70%;
    border-radius: 1px;
    background: linear-gradient(to bottom, transparent, #e04848, transparent);
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
  border-radius: 10px;
  background: linear-gradient(135deg, #e04848 0%, #8a1818 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(224, 72, 72, 0.35);

  span {
    font-size: 1rem;
    color: #fff;
    font-weight: 800;
    letter-spacing: -1px;
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
  background: linear-gradient(to right, transparent, rgba(224, 72, 72, 0.3), transparent);
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
    { icon: "fab fa-github", url: "https://github.com/meetbeddy", key: 1 },
    { icon: "fab fa-linkedin", url: "https://linkedin.com/in/obed-okpala", key: 2 },
  ];

  return (
    <StyledSideNav
      variants={desktopVariants}
      initial="hidden"
      animate="visible"
    >
      <Logo
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
            key={link.key}
          >
            <i className={link.icon} />
          </a>
        ))}
      </SocialContainer>
    </StyledSideNav>
  );
};


export default SideNav;