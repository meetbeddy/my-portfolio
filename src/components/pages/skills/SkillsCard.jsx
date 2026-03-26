import React, { Component } from "react";
import Styled from "styled-components";
import { motion } from "framer-motion";

const Styles = Styled(motion.div)`
  display: inline-flex;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 6vh;
  justify-content: space-evenly;
  border-bottom: 3px solid #e04848;

  @media (max-width: 768px) {
    align-content: center;
    margin-top: 0;
  }

  ul {
    padding: 0;
    justify-content: space-evenly;
  }

  ul li {
    display: inline-block;
    width: auto;
    margin: 3px;
    padding: 0;
    justify-content: space-evenly;
  }

  li button {
    display: block;
    list-style-type: none;
    text-decoration: none;
    background-color: transparent;
    color: #e04848;
    border: 0.1em solid #e04848;
    padding: 8px 16px;
    text-transform: uppercase;
    transition: all 0.15s;
    cursor: pointer;

    &:hover {
      text-shadow: 0 0 2em rgba(255, 255, 255, 1);
      color: white;
      border-color: #ffffff;
    }

    &:active {
      box-shadow: inset 0 0.6em 2em -0.3em rgba(0, 0, 0, 0.15),
        inset 0 0 0em 0.05em rgba(255, 255, 255, 0.12);
      color: #ffffff;
    }
  }
`;

class SkillsCard extends Component {
  state = {
    isShown: "false",
    displayText: [{}],
    descriptions: [
      {
        id: "html",
        text: "Strong command of semantic HTML5 — building accessible, well-structured markup that's both machine and human readable.",
      },
      {
        id: "css",
        text: "Proficient in CSS3, Flexbox, Grid, animations, and responsive design. Experienced with styled-components and CSS Modules.",
      },
      {
        id: "javascript",
        text: "4+ years building production applications in JavaScript — from vanilla DOM manipulation to complex async workflows.",
      },
      {
        id: "react",
        text: "Expert-level React developer. Hooks, Context API, Redux Toolkit, performance optimisation, and component design patterns.",
      },
      {
        id: "angular",
        text: "3 years building enterprise Angular applications — RxJS, reactive forms, Angular Material, lazy modules, and NgRx.",
      },
      {
        id: "typescript",
        text: "4 years of TypeScript across full-stack projects. Strict mode, generics, decorators, and interface-driven design.",
      },
      {
        id: "nodejs",
        text: "3 years building RESTful APIs and microservices with Node.js, Express.js — auth, middleware, and scalable architecture.",
      },
      {
        id: "nestjs",
        text: "2 years building enterprise-grade NestJS APIs — dependency injection, guards, interceptors, TypeORM, and modular architecture.",
      },
      {
        id: "mongodb",
        text: "4 years designing MongoDB schemas, aggregation pipelines, and optimised queries using Mongoose for production apps.",
      },
      {
        id: "git",
        text: "Proficient with Git — branching strategies, pull requests, code reviews, and collaborative workflows on GitHub.",
      },
    ],
  };

  handleClick = (e) => {
    e.preventDefault();
    const id = e.currentTarget.id;
    this.handleShowDescription(id);
    this.setState({ isShown: "true" });
  };

  handleShowDescription = (id) => {
    const { descriptions } = this.state;
    let filteredDescription = descriptions.filter(
      (description) => description.id === id
    );
    this.setState({ displayText: filteredDescription });
  };

  render() {
    const { isShown, displayText } = this.state;

    return (
      <motion.div>
        <Styles>
          <ul>
            <li>
              <button id="html" onClick={this.handleClick}>
                HTML5{" "}
                <motion.i
                  className="fab fa-html5 fa-lg"
                  whileHover={{ scale: 1.5 }}
                />
              </button>
            </li>
            <li>
              <button id="css" onClick={this.handleClick}>
                CSS3{" "}
                <motion.i
                  className="fab fa-css3-alt fa-lg"
                  whileHover={{ scale: 1.5 }}
                />
              </button>
            </li>
            <li>
              <button id="javascript" onClick={this.handleClick}>
                JavaScript{" "}
                <motion.i
                  className="fab fa-js-square fa-lg"
                  whileHover={{ scale: 1.5 }}
                />
              </button>
            </li>
            <li>
              <button id="react" onClick={this.handleClick}>
                React{" "}
                <motion.i
                  className="fab fa-react fa-lg"
                  whileHover={{ scale: 1.5 }}
                />
              </button>
            </li>
            <li>
              <button id="angular" onClick={this.handleClick}>
                Angular{" "}
                <motion.i
                  className="fab fa-angular fa-lg"
                  whileHover={{ scale: 1.5 }}
                />
              </button>
            </li>
            <li>
              <button id="typescript" onClick={this.handleClick}>
                TypeScript
              </button>
            </li>
            <li>
              <button id="nodejs" onClick={this.handleClick}>
                Node.js{" "}
                <motion.i
                  className="fab fa-node-js fa-lg"
                  whileHover={{ scale: 1.5 }}
                />
              </button>
            </li>
            <li>
              <button id="nestjs" onClick={this.handleClick}>
                NestJS
              </button>
            </li>
            <li>
              <button id="mongodb" onClick={this.handleClick}>
                MongoDB
              </button>
            </li>
            <li>
              <button id="git" onClick={this.handleClick}>
                Git{" "}
                <motion.i
                  className="fab fa-github fa-lg"
                  whileHover={{ scale: 1.5 }}
                />
              </button>
            </li>
          </ul>
        </Styles>

        <span
          style={{
            fontSize: "1.1em",
            textAlign: "justify",
            overflow: "hidden",
            width: "100%",
            margin: "12px 12px 0",
            lineHeight: "1.6",
            color: "rgba(255,255,255,0.75)",
            display: "block",
          }}
        >
          {isShown === "true" && displayText.length > 0
            ? <p>{displayText[0].text}</p>
            : null}
        </span>
      </motion.div>
    );
  }
}

export default SkillsCard;
