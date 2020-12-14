import React, { Component } from "react";
import NavItem from "./NavItem";
import styled from "styled-components";

class SideNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePath: "/",
      items: [
        {
          path: "/",
          name: "home",
          icon: "fa fa-home fa-lg",
          key: 1,
        },
        {
          path: "/about",
          name: "about",
          icon: "fa fa-user fa-lg",
          key: 2,
        },
        {
          path: "/skills",
          name: "skills",
          icon: "fa fa-cogs fa-lg",
          key: 3,
        },
        {
          path: "/works",
          name: "works",
          icon: "fa fa-briefcase fa-lg",
          key: 4,
        },
        {
          path: "/contact",
          name: "contact",
          icon: "fas fa-address-book fa-lg",
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
    const StyledSideNav = styled.div`
      position: fixed;
      height: 100%;
      width: 75px;
      z-index: 1;
      top: 3.4em;
      background-color: #222;
      overflow-x: hidden;
      padding-top: 10px;
      @media (max-width: 768px) {
        display: none;
      }
    `;
    const { items, activePath } = this.state;
    return (
      <div>
        <StyledSideNav>
          {items.map((item) => {
            return (
              <NavItem
                path={item.path}
                name={item.name}
                icon={item.icon}
                onItemClick={this.onItemClick}
                active={item.path === activePath}
                key={item.key}
              />
            );
          })}
        </StyledSideNav>
      </div>
    );
  }
}
export default SideNav;
