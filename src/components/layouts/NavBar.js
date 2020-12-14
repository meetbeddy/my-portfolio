import React, { Component } from "react";
import NavItem from "./NavItem";
import { Navbar } from "react-bootstrap";
import styled from "styled-components";

const Styles = styled.div`
  .navbar {
    background-color: #222;
    height: auto;
    width: 75px;
    position: fixed;

    @media (max-width: 768px) {
      width: 100%;
      height: 70px;
      padding: 30px;
      align-items: center;
      position: fixed;
      z-index: 10;
    }
  }
  .navbar-brand {
    font-size: 1.5em;
    color: #e04848;
    text-decoration: none;
    text-align: center;

    &:hover {
      color: white;
      text-decoration: none;
    }
    @media (max-width: 769px) {
      display: none;
    }
  }
  .nav-item-container {
    @media (max-width: 768px) {
      height: auto;
      width: 95vw;
      display: flex;
      flex: wrap;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 1;
    }
    @media (min-width: 769px) {
      display: none;
    }
  }
`;

export default class NavBar extends Component {
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
    const { items, activePath } = this.state;
    return (
      <Styles>
        <Navbar expand="lg">
          <Navbar.Brand href="/">MB</Navbar.Brand>
          <div className="nav-item-container">
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
          </div>
        </Navbar>
      </Styles>
    );
  }
}
