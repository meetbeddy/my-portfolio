import React, { useState, useEffect } from "react";
import NavItem from "./NavItem";
import styled from "styled-components";
import { motion } from "framer-motion";

// Enhanced animation variants for the overall sidebar
const sidebarVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
};

// Enhanced animation variants for icons
const iconVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    x: -50,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      type: "spring",
      damping: 10,
      stiffness: 80,
      duration: 0.4,
    },
  },
  hover: {
    scale: 1.2,
    transition: {
      type: "spring",
      damping: 10,
      stiffness: 300,
    },
  },
  exit: {
    x: -100,
    opacity: 0,
    transition: {
      ease: "easeInOut",
      duration: 0.3,
    },
  },
};

const StyledSideNav = styled(motion.nav)`
  position: fixed;
  height: 100vh;
  width: 80px;
  z-index: 100;
  top: 0;
  left: 0;
  background: rgba(25, 25, 25, 0.8);
  backdrop-filter: blur(10px);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem 0;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(to bottom, transparent, #e04848, transparent);
  }
  
  @media (max-width: 768px) {
    bottom: 0;
    top: auto;
    left: 0;
    right: 0;
    height: 60px;
    width: 100%;
    flex-direction: row;
    justify-content: space-around;
    padding: 0;
    
    &::before {
      width: 100%;
      height: 3px;
      background: linear-gradient(to right, transparent, #e04848, transparent);
    }
  }
`;

const NavContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: row;
    width: 100%;
    justify-content: space-around;
    gap: 1rem;
  }
`;

const SideNav = () => {
  const [activePath, setActivePath] = useState("/");
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const navigationItems = [
    {
      path: "/",
      name: "Home",
      icon: "fa fa-home",
      key: 1,
    },
    {
      path: "/about",
      name: "About",
      icon: "fa fa-user",
      key: 2,
    },
    {
      path: "/skills",
      name: "Skills",
      icon: "fa fa-cogs",
      key: 3,
    },
    {
      path: "/works",
      name: "Works",
      icon: "fa fa-briefcase",
      key: 4,
    },
    {
      path: "/contact",
      name: "Contact",
      icon: "fas fa-address-book",
      key: 5,
    },
  ];

  const handleItemClick = (path) => {
    setActivePath(path);
  };

  return (
    <StyledSideNav
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <NavContainer>
        {navigationItems.map((item) => (
          <NavItem
            path={item.path}
            name={item.name}
            icon={item.icon}
            onItemClick={handleItemClick}
            active={item.path === activePath}
            key={item.key}
            variants={iconVariants}
            isMobile={isMobile}
          />
        ))}
      </NavContainer>
    </StyledSideNav>
  );
};

export default SideNav;