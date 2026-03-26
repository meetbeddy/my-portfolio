import React from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const NavWrapper = styled(motion.nav)`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  width: 90%;
  max-width: 400px;
  height: 64px;
  background: rgba(14, 14, 22, 0.85); /* Matches SideNav navy */
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(224, 72, 72, 0.2); /* Red border */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 10px;

  @media (min-width: 769px) {
    display: none;
  }
`;

const NavItem = styled(Link)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: ${p => p.active ? "#e04848" : "rgba(255, 255, 255, 0.45)"};
  width: 50px;
  height: 100%;
  transition: all 0.3s ease;

  i {
    font-size: 1.2rem;
    margin-bottom: 2px;
  }

  span {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const ActiveIndicator = styled(motion.div)`
  position: absolute;
  top: -12px;
  width: 36px;
  height: 4px;
  background: #e04848;
  border-radius: 0 0 6px 6px;
  box-shadow: 0 0 15px rgba(224, 72, 72, 0.6);
`;


const MobileNav = () => {
  const location = useLocation();
  
  // Hide nav on the fullscreen game page
  if (location.pathname === '/play') return null;

  const items = [
    { path: "/",        name: "Home",    icon: "fa fa-home" },
    { path: "/about",   name: "About",   icon: "fa fa-user" },
    { path: "/skills",  name: "Skills",  icon: "fa fa-cogs" },
    { path: "/projects",name: "Works",   icon: "fa fa-briefcase" },
    { path: "/contact", name: "Mail",    icon: "fa fa-envelope" },
  ];

  return (
    <NavWrapper
      initial={{ y: 100, x: "-50%", opacity: 0 }}
      animate={{ y: 0, x: "-50%", opacity: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
    >
      {items.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <NavItem 
            key={item.path} 
            to={item.path} 
            active={isActive ? 1 : 0}
          >
            <AnimatePresence>
              {isActive && (
                <ActiveIndicator
                  layoutId="activeTab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>
            <i className={item.icon} />
            <span>{item.name}</span>
          </NavItem>
        );
      })}
    </NavWrapper>
  );
};

export default MobileNav;
