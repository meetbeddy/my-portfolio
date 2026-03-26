import React, { useEffect } from "react";
import { FlexWrapper } from "../../layouts/StyledContainers";
import { Link } from "react-router-dom";
import { Button } from "../../button/Button";
import { motion, useAnimation } from "framer-motion";
import styled from "styled-components";
import "./homepage.css";
import AnimatedBackground from "../../shared/AnimatedBackground";

// Container animation variants
const ContainerVariants = {
  initial: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1],
    },
  },
};

// Text container animations
const TextContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.3,
    },
  },
};

// Individual character animations
const CharacterVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 200,
    },
  },
};

// Subtitle animation
const SubtitleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 1.5,
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

// Glass card style
const GlassCard = styled(motion.div)`
  width: 100%;
  max-width: 700px;
  height: auto;
  margin: 0 auto;
  padding: 2.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: 85%;
    padding: 1.5rem;
    margin: 8vh auto 4vh;
  }

  @media only screen and (max-width: 568px) and (orientation: landscape) {
    margin-top: 20vh;
    padding: 1rem;
  }
`;

// Heading styles
const Heading = styled(motion.h1)`
  font-size: 4rem;
  font-weight: 700;
  margin: 0;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  letter-spacing: -2px;

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const Name = styled(motion.h2)`
  font-size: 3.5rem;
  font-weight: 700;
  margin: 0.5rem 0 1rem;
  color: white;
  letter-spacing: -2px;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.h3)`
  font-size: 2rem;
  font-weight: 600;
  margin: 1rem 0;
  color: #e04848;
  letter-spacing: -1px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const JobTitle = styled(motion.p)`
  font-size: 1.2rem;
  font-weight: 400;
  margin: 1rem 0 2rem;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 1px;
`;

const ButtonContainer = styled(motion.div)`
  margin-top: 2rem;
`;

const StyledButton = styled(Button)`
  background: linear-gradient(135deg, #e04848 0%, #c04040 100%);
  color: white;
  font-weight: 600;
  letter-spacing: 1px;
  padding: 12px 28px;
  border-radius: 30px;
  box-shadow: 0 4px 15px rgba(224, 72, 72, 0.4);
  border: none;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(224, 72, 72, 0.6);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 10px rgba(224, 72, 72, 0.4);
  }
`;

const HomePage = () => {
  const controls = useAnimation();
  const nameString = "I'm Obed.";

  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  return (
    <>
      <AnimatedBackground />
      <FlexWrapper
        className="home-wrapper"
        variants={ContainerVariants}
        initial="initial"
        animate="visible"
        exit="exit"
      >
        <div className="animated-circle circle-1"></div>
        <div className="animated-circle circle-2"></div>
        <div className="animated-circle circle-3"></div>

        <GlassCard
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Heading
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Hello,
          </Heading>

          <motion.div
            variants={TextContainerVariants}
            initial="hidden"
            animate={controls}
          >
            <Name>
              {nameString.split("").map((char, index) => (
                <motion.span
                  key={index}
                  variants={CharacterVariants}
                  style={{ display: "inline-block" }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </Name>
          </motion.div>

          <Subtitle
            variants={SubtitleVariants}
            initial="hidden"
            animate="visible"
          >
            Full-Stack Web Developer
          </Subtitle>

          <JobTitle
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
          >
            Building elegant, scalable web experiences with React, Node.js & Three.js
          </JobTitle>

          <ButtonContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.8 }}
            style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}
          >
            <Link to="/about" style={{ textDecoration: 'none' }}>
              <StyledButton>Learn More</StyledButton>
            </Link>
            <Link to="/play" style={{ textDecoration: 'none' }}>
              <StyledButton style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                border: '1px solid rgba(224, 72, 72, 0.4)',
                backdropFilter: 'blur(10px)'
              }}>
                <i className="fa fa-gamepad" style={{ marginRight: '8px' }} />
                Play Game
              </StyledButton>
            </Link>
          </ButtonContainer>
        </GlassCard>
      </FlexWrapper></>

  );
};

export default HomePage;
