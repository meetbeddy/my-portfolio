import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

const StyledNavItem = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconContainer = styled(motion.div)`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.active ?
    'linear-gradient(135deg, #e04848 0%, #c04040 100%)' :
    'rgba(255, 255, 255, 0.1)'};
  box-shadow: ${props => props.active ?
    '0 5px 15px rgba(224, 72, 72, 0.4)' :
    'none'};
  transition: all 0.3s ease;
  
  i {
    color: ${props => props.active ? '#ffffff' : '#e04848'};
    font-size: 1.3rem;
    transition: color 0.3s ease;
  }
  
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    
    i {
      font-size: 1.1rem;
    }
  }
`;

const NavLabel = styled(motion.div)`
  position: absolute;
  left: 100%;
  margin-left: 10px;
  background: rgba(25, 25, 25, 0.9);
  padding: 8px 12px;
  border-radius: 8px;
  color: #ffffff;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
  pointer-events: none;
  border-left: 3px solid #e04848;
  z-index: 10;
  
  @media (max-width: 768px) {
    left: 50%;
    transform: translateX(-50%);
    bottom: 100%;
    margin-left: 0;
    margin-bottom: 10px;
    border-left: none;
    border-bottom: 3px solid #e04848;
  }
`;

const labelVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.1 }
  }
};

const NavLink = styled(Link)`
  display: block;
  text-decoration: none;
`;

// Animation to indicate active state
const activeIndicator = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

const NavItem = ({ active, icon, path, name, variants, isMobile }) => {
  const [showLabel, setShowLabel] = useState(false);

  // Mobile-friendly label variants
  const mobileLabelVariants = isMobile ? {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.1 }
    }
  } : labelVariants;

  return (
    <StyledNavItem
      variants={variants}
      whileHover="hover"
    >
      <NavLink
        to={path}
        onMouseEnter={() => setShowLabel(true)}
        onMouseLeave={() => setShowLabel(false)}
        aria-label={name}
      >
        <IconContainer
          active={active}
          whileHover={{
            boxShadow: "0 8px 20px rgba(224, 72, 72, 0.5)"
          }}
          animate={active ? activeIndicator : {}}
        >
          <motion.i className={icon}></motion.i>
        </IconContainer>
      </NavLink>

      <AnimatePresence>
        {showLabel && (
          <NavLabel
            variants={mobileLabelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {name}
          </NavLabel>
        )}
      </AnimatePresence>
    </StyledNavItem>
  );
};

export default NavItem;