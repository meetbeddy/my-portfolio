import React, { Component } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

class NavItem extends Component {
  state = {
    isShown: "false",
    isMobile: "false",
  };
  componentDidMount() {
    this.detectListener = window.addEventListener("resize", this.detect);
  }
  detect = () => {
    this.setState({
      isMobile:
        !!navigator.maxTouchPoints && window.PointerEvent ? "true" : "false",
    });
  };
  handleShown = () => {
    this.setState({
      isShown: "true",
    });
  };
  handleNotShown = () => {
    this.setState({
      isShown: "false",
    });
  };
  handleClick = () => {
    const { path, onItemClick } = this.props;
    onItemClick(path);
  };
  render() {
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
        }
      }
      @media (max-width: 768px) {
        height: auto;
        width: auto;
      }
    `;

    const { active, icon, path, name } = this.props;
    const { isShown, isMobile } = this.state;

    return (
      <div>
        <StyledNavItem active={active}>
          <Link
            to={path}
            onClick={this.handleClick}
            onMouseEnter={this.handleShown}
            onMouseLeave={this.handleNotShown}
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
  }
}
export default NavItem;
