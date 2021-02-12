import React, { Component } from "react";
import Styled from "styled-components";
import { motion } from "framer-motion";

const Styles = Styled(motion.div)`
display:inline-flex;
flex:wrap;
width:100%;
margin-top:10vh;
justify-content: space-evenly
border-bottom: 3px solid red;
@media (max-width:768px){
  align-content:center;
  margin-top:0;
}
ul{
  padding:0;
  justify-content: space-evenly;
}
ul li{
  display:inline-block;
  width:auto;
	margin: 3px;
  padding: 0; 
  justify-content: space-evenly;
}

li button{
	display: block;
	list-style-type: none;
  text-decoration: none;
  background-color:transparent;
  color: #e04848;
  border: 0.1em solid #e04848;
    padding:8px 16px;
    text-transform:uppercase;
    transition: all 0.15s;
  :hover{
     text-shadow: 0 0 2em rgba(255,255,255,1);
     color: white;
     border-color:#FFFFFF;
    }
:active{
 box-shadow:inset 0 0.6em 2em -0.3em rgba(0,0,0,0.15),inset 0 0 0em 0.05em rgba(255,255,255,0.12);
color:#FFFFFF;
}

    
`;

class SkillsCard extends Component {
  state = {
    isShown: "false",
    displayText: [{}],
    descriptions: [
      {
        id: "html",
        text: "some text about my hml skills",
      },
      {
        id: "css",
        text: "some text about my css skills",
      },
      {
        id: "javascript",
        text: "some text about my javascript skills",
      },
      { id: "react", text: "some text about my react skills", key: 3 },
      {
        id: "git",
        text: "some text about my  skills",
      },
      {
        id: "nodejs",
        text: "some text about my node skills",
      },
      {
        id: "wordpress",
        text: "some text about my wordpress skills",
      },
      {
        id: "git",
        text: "some text about my git skills",
      },
      {
        id: "redux",
        text: "some text about my git skills",
      },
      {
        id: "bootstrap",
        text: "some text about my bootstrap skills",
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
              <button id="html" href="#html" onClick={this.handleClick}>
                html{" "}
                <motion.i
                  className="fab fa-html5 fa-lg"
                  whileHover={{ scale: 1.5 }}
                ></motion.i>
              </button>
            </li>
            <li>
              <button id="css" onClick={this.handleClick}>
                css
                <motion.i
                  className="fab fa-css3-alt fa-lg"
                  whileHover={{ scale: 1.5 }}
                ></motion.i>
              </button>
            </li>
            <li>
              <button id="javascript" onClick={this.handleClick}>
                javascript
                <motion.i
                  className="fab fa-js-square fa-lg"
                  whileHover={{ scale: 1.5 }}
                ></motion.i>
              </button>
            </li>
            <li>
              <button id="react" onClick={this.handleClick}>
                React
                <motion.i
                  className="fab fa-react fa-lg"
                  whileHover={{ scale: 1.5 }}
                ></motion.i>
              </button>
            </li>
            <li>
              <button id="nodejs" onClick={this.handleClick}>
                Node Js
                <motion.i
                  className="fab fa-node-js fa-lg"
                  whileHover={{ scale: 1.5 }}
                ></motion.i>
              </button>
            </li>
            <li>
              <button id="bootstrap" onClick={this.handleClick}>
                Bootstrap
              </button>
            </li>
            <li>
              <button id="redux" onClick={this.handleClick}>
                Redux
              </button>
            </li>
            <li>
              <button id="git" onClick={this.handleClick}>
                git
                <motion.i
                  className="fab fa-github fa-lg"
                  whileHover={{ scale: 1.5 }}
                ></motion.i>
              </button>
            </li>
          </ul>
        </Styles>

        <span
          style={{
            fontSize: "1.3em",
            textAlign: "justify",
            overflow: "hidden",
            width: "100%",
            margin: "0 12px 0",
          }}
        >
          {isShown && displayText ? <p>{displayText[0].text}</p> : null}
        </span>
      </motion.div>
    );
  }
}

export default SkillsCard;
