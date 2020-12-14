import React from "react";
import { FlexWrapper, Frame } from "../../layouts/StyledContainers";
import { Button } from "../../button/Button";
import { motion } from "framer-motion";
import styled from "styled-components";
import "./homepage.css";

const ContainerVariants = {
  initial: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.2,
      duration: 1,
    },
  },
  exit: {
    x: "-100vw",
    transition: {
      ease: "easeInOut",
    },
  },
};
const framevariants = {
  before: {},
  after: { transition: { staggerChildren: 0.3 } },
};

const textVariants = {
  before: {
    opacity: 0,
    y: 40,
    transition: {
      type: "spring",
      damping: 16,
      stiffness: 200,
    },
  },
  after: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 16,
      stiffness: 200,
    },
    whileHover: { scale: 2.5 },
  },
};

const WelcomeText = styled(motion.div)`
  width: 100vw;
  height: auto;
  margin: 2vh 2px 2px;
  background-color: rgba(225,225,225,0.95)
  border-radius:5px;
 
  h1,
  h2 {
    font-size: 3.3em;
    letter-spacing: -4px;
    font-weight: 700;
    margin-top: 0;
    margin-bottom: 0;
    color: white;
  }
  @media (max-width: 768px) {
    font-size: 0.8em;
    margin-top: 10vh;
    
    width:100vw;
  }
  @media only screen and (min-device-width: 320px) and (max-device-width: 568px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: landscape) {
    margin-top: 29vh;
    
    
  }
  
`;

const HomePage = () => {
  const nameString = Array.from("My Name is Obed,");
  return (
    <FlexWrapper
      className="home-wrapper"
      variants={ContainerVariants}
      initial="initial"
      animate="visible"
      exit="exit"
    >
      <motion.div style={{ marginLeft: "2vw" }}>
        <WelcomeText>
          <h1> Hello, </h1>

          <Frame variants={framevariants} initial="before" animate="after">
            {nameString.map((letter, index) => (
              <Frame
                center={"y"}
                key={index}
                width={"auto"}
                background={""}
                style={{ position: "relative" }}
                variants={textVariants}
              >
                <h1> {letter === " " ? "\u00A0" : letter}</h1>
              </Frame>
            ))}
          </Frame>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 5 }}
            style={{ color: "#e04848" }}
          >
            Web Developer
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 6 }}
            style={{ color: "#e04848" }}
          >
            Front-end Developer / wordpress expert
          </motion.p>
        </WelcomeText>

        <motion.span>
          <Button
            initial={{ opacity: 0, y: "40vh" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              delay: 7,
              type: "spring",
              stiffness: 300,
            }}
            style={{ color: "#e04848" }}
          >
            Contact Me
          </Button>
        </motion.span>
      </motion.div>
    </FlexWrapper>
  );
};
export default HomePage;
