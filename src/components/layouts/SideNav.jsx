import React, { useState, useEffect } from "react";
import NavItem from "./NavItem";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import useIsMobile from "../../hook/useIsMobile";

// Enhanced animation variants for the overall sidebar
const sidebarVariants = {
  hidden: {
    opacity: 0,
    x: -80,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100,
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  },
  exit: {
    opacity: 0,
    x: -80,
    transition: {
      ease: "easeInOut",
      duration: 0.3,
    }
  }
};

// Mobile sidebar variants
const mobileSidebarVariants = {
  hidden: {
    opacity: 0,
    y: 80,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100,
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  exit: {
    opacity: 0,
    y: 80,
    transition: {
      ease: "easeInOut",
      duration: 0.3,
    }
  }
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
};

// Mobile icon variants
const mobileIconVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
  visible: {
    opacity: 1,
    y: 0,
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

// Animated logo component
const Logo = styled(motion.div)`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SocialContainer = styled(motion.div)`
  position: absolute;
  bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  a {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.2rem;
    transition: color 0.3s ease, transform 0.3s ease;
    
    &:hover {
      color: #e04848;
      transform: scale(1.2);
    }
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SideNav = () => {
  const location = useLocation();


  const isMobile = useIsMobile()

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
    // {
    //   path: "/skills",
    //   name: "Skills",
    //   icon: "fa fa-cogs",
    //   key: 3,
    // },
    {
      path: "/projects",
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

  const socialLinks = [
    { icon: "fab fa-github", url: "https://github.com/yourusername", key: 1 },
    { icon: "fab fa-linkedin", url: "https://linkedin.com/in/yourusername", key: 2 },
    { icon: "fab fa-twitter", url: "https://twitter.com/yourusername", key: 3 }
  ];

  return (
    <StyledSideNav
      variants={isMobile ? mobileSidebarVariants : sidebarVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {!isMobile && (
        <Logo
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <span style={{ fontSize: "24px", color: "#e04848", fontWeight: "bold" }}>O</span>
        </Logo>
      )}

      <NavContainer>
        {navigationItems.map((item) => (
          <NavItem
            path={item.path}
            name={item.name}
            icon={item.icon}
            active={item.path === location.pathname}
            key={item.key}
            variants={isMobile ? mobileIconVariants : iconVariants}
            isMobile={isMobile}
          />
        ))}
      </NavContainer>

      {!isMobile && (
        <SocialContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          {socialLinks.map((link) => (
            <motion.a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              key={link.key}
              whileHover={{ scale: 1.2 }}
            >
              <i className={link.icon}></i>
            </motion.a>
          ))}
        </SocialContainer>
      )}
    </StyledSideNav>
  );
};

export default SideNav;