import React, { Component } from "react";
import ContactForm from "./ContactForm";
import Card from "../../layouts/Card";
import Map from "../map/Map";
import { motion } from "framer-motion";
import styled, { keyframes } from "styled-components";
import { FlexWrapper } from "../../layouts/StyledContainers";

// Add the circular reveal animation from other pages
const circleMove = keyframes`
  0%, 100% {
    clip-path: circle(10% at 85% 50%);
  }
  25% {
    clip-path: circle(10% at 15% 50%);
  }
`;

// Ball animations
const floatingBall = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
};

const rotatingBall = {
  animate: {
    rotate: 360,
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

const pulsatingBall = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.7, 0.9, 0.7],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
};

// Styled components for improved design
const ContentContainer = styled(motion.div)`
  max-width: 1000px;
  width: 90%;
  margin: 80px auto 0;
  padding: 2rem;
  background: rgba(30, 30, 30, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    width: 85%;
    padding: 1.5rem;
    margin-top: 100px;
  }
`;

const ContactHeader = styled.div`
  position: relative;
  height: 80px;
  margin-bottom: 20px;
  
  .bottom, .top {
    position: absolute;
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
  }
  
  .bottom {
    color: #e04848;
  }

  .top {
    background-color: white;
    color: black;
    clip-path: circle(10% at 85% 50%);
    animation: ${circleMove} 10s ease-in-out infinite;
    z-index: 1;
  }
  
  h1 {
    font-size: 3.3rem;
    letter-spacing: -2px;
    font-weight: 700;
    margin: 0;
  }
  
  @media (max-width: 768px) {
    h1 {
      font-size: 2.2rem;
    }
  }
`;

const ContactContent = styled.div`
  display: flex;
  flex-direction: row;
  gap: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ContactFormContainer = styled(motion.div)`
  flex: 1.5;
`;

const ContactDetailsContainer = styled(motion.div)`
  flex: 1;
  padding: 20px;
  background: rgba(40, 40, 40, 0.5);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const ContactDescription = styled(motion.p)`
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.5px;
`;

const AnimatedBackground = styled.div`
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

class Contact extends Component {
  state = {
    location: {
      address: "Lugbe, FCT, Abuja.",
      phone: "+234 7064492675",
      lat: 8.9868,
      lng: 7.3626,
    },
  };

  render() {
    const { location } = this.state;

    const ContainerVariants = {
      initial: { opacity: 0, x: "100vw" },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          type: "spring",
          stiffness: 50,
          damping: 20,
          delay: 0.3,
          duration: 1,
        },
      },
      exit: {
        x: "-100vw",
        transition: {
          ease: "easeInOut",
          duration: 0.5,
        },
      },
    };

    const TextAreaVariants = {
      initial: { x: "-100vw", opacity: 0 },
      visible: {
        x: 0,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 50,
          damping: 20,
          delay: 0.8
        }
      },
    };

    const RightBoxVariants = {
      initial: { y: "50vh", opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 50,
          damping: 20,
          delay: 1.2
        }
      },
    };

    return (
      <>
        {/* Animated background balls */}
        <AnimatedBackground>
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
        </AnimatedBackground>

        <FlexWrapper
          variants={ContainerVariants}
          initial="initial"
          animate="visible"
          exit="exit"
        >
          <ContentContainer>
            <ContactHeader>
              <div className="bottom">
                <h1>Let's get in touch</h1>
              </div>
              <div className="top">
                <h1>Let's get in touch</h1>
              </div>
            </ContactHeader>

            <ContactContent>
              <ContactFormContainer variants={TextAreaVariants}>
                <ContactDescription
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1, duration: 0.8 }}
                >
                  I am available for work and opportunities to collaborate with
                  individuals, agencies, and companies. Feel free to send me an email
                  or connect with me on social media.
                </ContactDescription>
                <ContactForm />
              </ContactFormContainer>

              <ContactDetailsContainer variants={RightBoxVariants}>
                <Card location={location} />
                {/* Uncomment if you decide to reactivate the map
                <div style={{ marginTop: "20px", borderRadius: "8px", overflow: "hidden" }}>
                  <Map location={location} zoomLevel={17} />
                </div>
                */}
              </ContactDetailsContainer>
            </ContactContent>
          </ContentContainer>
        </FlexWrapper>
      </>
    );
  }
}

export default Contact;