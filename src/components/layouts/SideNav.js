import React, { Component } from "react";
import NavItem from "./NavItem";
import styled from "styled-components";
import { motion } from "framer-motion";

const framevariants = {
  before: {},
  after: { transition: { staggerChildren: 0.3 } },
};
const iconVariants = {
  before: {
    opacity: 0,
    y: 40,
    x: -70,
    transition: {
      type: "spring",
      damping: 16,
      stiffness: 200,
    },
  },
  after: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      type: "spring",
      damping: 16,
      stiffness: 200,
    },
  },
  exit: {
    x: "-10vw",
    transition: {
      ease: "easeInOut",
    },
  },
};
class SideNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePath: "/",
      items: [
        {
          path: "/",
          name: "home",
          icon: "fa fa-home fa-2x",
          key: 1,
        },
        {
          path: "/about",
          name: "about",
          icon: "fa fa-user fa-2x",
          key: 2,
        },
        {
          path: "/skills",
          name: "skills",
          icon: "fa fa-cogs fa-2x",
          key: 3,
        },
        {
          path: "/works",
          name: "works",
          icon: "fa fa-briefcase fa-2x",
          key: 4,
        },
        {
          path: "/contact",
          name: "contact",
          icon: "fas fa-address-book fa-2x",
          key: 5,
        },
      ],
    };
  }
  onItemClick = (path) => {
    this.setState({
      activePath: path,
    });
  };
  render() {
    const StyledSideNav = styled(motion.div)`
      position: fixed;
      height: 100%;
      width: 75px;
      z-index: 1;
      top: 5em;
      background-color: transparent;
      overflow-x: hidden;
      padding-top: 10px;
      @media (max-width: 768px) {
        display: none;
      }
    `;
    const { items, activePath } = this.state;
    return (
      <div>
        <StyledSideNav
          variants={framevariants}
          initial="before"
          animate="after"
        >
          {items.map((item) => {
            return (
              <NavItem
                path={item.path}
                name={item.name}
                icon={item.icon}
                onItemClick={this.onItemClick}
                active={item.path === activePath}
                key={item.key}
                variants={iconVariants}
              />
            );
          })}
        </StyledSideNav>
      </div>
    );
  }
}
export default SideNav;
