import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

// ─── Styled components ────────────────────────────────────────────────────────
const StyledNavItem = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconContainer = styled(motion.div)`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  background: ${p => p.$active
    ? 'linear-gradient(135deg, #e04848 0%, #b52020 100%)'
    : 'rgba(255, 255, 255, 0.06)'};
  box-shadow: ${p => p.$active
    ? '0 4px 16px rgba(224, 72, 72, 0.45)'
    : 'none'};
  border: 1px solid ${p => p.$active
    ? 'transparent'
    : 'rgba(255,255,255,0.08)'};
  transition: background 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;

  i {
    font-size: ${p => p.$active ? '1.25rem' : '1.1rem'};
    color: ${p => p.$active ? '#ffffff' : 'rgba(224,72,72,0.8)'};
    transition: font-size 0.15s ease, color 0.2s ease;
    pointer-events: none;
  }

  &:hover i {
    color: #fff;
  }
`;

const ActiveDot = styled(motion.span)`
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #e04848;
  box-shadow: 0 0 6px rgba(224, 72, 72, 0.8);
`;

const NavLabel = styled(motion.div)`
  position: absolute;
  left: calc(100% + 12px);
  top: 50%;
  transform: translateY(-50%);
  background: rgba(14, 14, 22, 0.92);
  padding: 6px 12px;
  border-radius: 8px;
  color: #ffffff;
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  white-space: nowrap;
  pointer-events: none;
  border-left: 2px solid #e04848;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
  z-index: 300;
`;

const labelVariantsDesktop = {
  hidden:  { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.15, ease: "easeOut" } },
  exit:    { opacity: 0, x: -6, transition: { duration: 0.1 } },
};

const dotVariants = {
  hidden:  { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.2, ease: "backOut" } },
};


const NavItem = ({ active, icon, path, name, variants }) => {
  const [showLabel, setShowLabel] = useState(false);

  return (
    <StyledNavItem variants={variants}>
      <Link
        to={path}
        aria-label={name}
        style={{ display: "block", textDecoration: "none" }}
        onMouseEnter={() => setShowLabel(true)}
        onMouseLeave={() => setShowLabel(false)}
      >
        <IconContainer
          $active={active}
          whileTap={{ scale: 0.9 }}
        >
          <i className={icon} />
        </IconContainer>
      </Link>

      <AnimatePresence>
        {active && (
          <ActiveDot
            key="dot"
            variants={dotVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLabel && (
          <NavLabel
            variants={labelVariantsDesktop}
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