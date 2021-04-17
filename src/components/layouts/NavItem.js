import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledNavItem = styled.div`
  height: 70px;
  width: 75px;
  text-align: center;
  margin-bottom: 0;
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

  const { active, icon, path, name } = props;

  return (
    <div>
      <StyledNavItem active={active}>
        <Link
          to={path}
          onClick={handleClick}
          onMouseEnter={handleShown}
          onMouseLeave={handleNotShown}
        >
          {isShown === "true" && isMobile === "false" ? (
            <button>{name}</button>
          ) : (
            <i className={icon}></i>
          )}
        </Link>
      </StyledNavItem>
    </div>
  );
};

export default NavItem;
