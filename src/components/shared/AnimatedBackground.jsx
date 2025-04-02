import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { floatingBall, rotatingBall, pulsatingBall } from "../animations/index";

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
`;

const Ball = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  z-index: 1;
  pointer-events: none;
`;

const AnimatedBackground = () => {
    return (
        <BackgroundContainer>
            <Ball
                variants={floatingBall}
                animate="animate"
                style={{
                    top: "15%",
                    left: "10%",
                    width: "80px",
                    height: "80px",
                    background: "radial-gradient(circle at 30% 30%, #e04848, #881414)",
                    opacity: 0.3,
                }}
            />
            <Ball
                variants={rotatingBall}
                animate="animate"
                style={{
                    top: "70%",
                    left: "15%",
                    width: "120px",
                    height: "120px",
                    background: "radial-gradient(circle at 30% 30%, #8a2be2, #4b0082)",
                    opacity: 0.2,
                }}
            />
            <Ball
                variants={pulsatingBall}
                animate="animate"
                style={{
                    top: "25%",
                    right: "15%",
                    width: "150px",
                    height: "150px",
                    background: "radial-gradient(circle at 30% 30%, #f5b7b3, #e04848)",
                    opacity: 0.15,
                }}
            />
            <Ball
                variants={floatingBall}
                animate="animate"
                style={{
                    bottom: "20%",
                    right: "10%",
                    width: "100px",
                    height: "100px",
                    background: "radial-gradient(circle at 30% 30%, #1e90ff, #0000cd)",
                    opacity: 0.25,
                }}
            />
            <Ball
                variants={rotatingBall}
                animate="animate"
                style={{
                    top: "50%",
                    left: "50%",
                    width: "200px",
                    height: "200px",
                    background: "radial-gradient(circle at 30% 30%, #9932cc, #4b0082)",
                    opacity: 0.1,
                    transform: "translate(-50%, -50%)",
                }}
            />
        </BackgroundContainer>
    );
};

export default AnimatedBackground;