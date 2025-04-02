import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";

const StyledNavItem = styled.div`
  height: 70px;
  width: auto;
  text-align: center;
  margin: auto;

  a {
    font-size: 1.1em;
    color: ${(props) => (props.active ? "white" : "#e04848")};
    text-decoration: none;

    :hover {
      text-decoration: none;
      transition: all 0.5s ease-out;
    }
    button {
      border: 0;
      background-color: transparent;

      font-size: 1ems;
      color: ${(props) => (props.active ? "white" : "#e04848")};
      :active {
        outline: none;
      }
    }
  }
  @media (max-width: 768px) {
    height: auto;
    width: auto;
  }
`;

const NavItem = (props) => {
  const [isMobile, setIsmobile] = useState(false);
  const [isShown, setIshown] = useState(false);

  useEffect(() => {
    let isMounted = false;

    const detect = () => {
      if (!isMounted) {
        setIsmobile(
          !!navigator.maxTouchPoints && window.PointerEvent ? true : false
        );
      }
    };

    window.addEventListener("resize", detect);

    return () => {
      isMounted = true;
    };
  });

  const handleShown = () => {
    setIshown(true);
  };
  const handleNotShown = () => {
    setIshown(false);
  };
  const handleClick = () => {
    const { path, onItemClick } = props;
    onItemClick(path);
  };

  const { active, icon, path, name, variants } = props;

  return (
    <div>
      <StyledNavItem active={active}>
        <Link
          to={path}
          onClick={handleClick}
          onMouseEnter={handleShown}
          onMouseLeave={handleNotShown}
        >
          {isShown && !isMobile ? (
            <button>{name}</button>
          ) : (
            <motion.i variants={variants} className={icon}></motion.i>
          )}
        </Link>
      </StyledNavItem>
    </div>
  );
};

export default NavItem;
