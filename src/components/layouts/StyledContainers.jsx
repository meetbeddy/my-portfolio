import styled from "styled-components";
import { motion } from "framer-motion";

// Define breakpoints as constants for reuse
const BREAKPOINTS = {
  mobileS: '320px',
  mobileM: '375px',
  mobileL: '414px',
  tablet: '768px',
  laptop: '1024px',
  laptopL: '1366px'
};

// Create media query helpers
const mediaQueries = {
  mobileS: `@media (max-width: ${BREAKPOINTS.mobileS})`,
  mobileM: `@media (max-width: ${BREAKPOINTS.mobileM})`,
  mobileL: `@media (max-width: ${BREAKPOINTS.mobileL})`,
  tablet: `@media (max-width: ${BREAKPOINTS.tablet})`,
  laptop: `@media (max-width: ${BREAKPOINTS.laptop})`,
  laptopL: `@media (max-width: ${BREAKPOINTS.laptopL})`,
  mobileLandscape: '@media (orientation: landscape) and (max-height: 500px)'
};

export const FlexWrapper = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  position: absolute;
  top: 0.2vh;
  left: 76px;
  width: auto;
  margin-top: 8vh;
  margin-left: 4px;
  margin-right: 4px;
  cursor: auto;
  
  ${mediaQueries.tablet} {
    display: block;
    left: 0;
    right: 0;
    
    h1, h2 {
      font-size: 2.2em;
      letter-spacing: -2px;
    }
    
    .top, .bottom {
      top: 2.5vh;
      left: 2vw;
      width: 100vw;
      height: 10vh;
    }
  }
  
  // iPhone landscape modes
  @media only screen and (min-device-width: 320px) and (max-device-width: 568px) and (orientation: landscape) {
    top: 9vh;
    
    .top, .bottom {
      top: 10vh;
      left: 2vw;
      width: 60vw;
      height: 70px;
    }
  }
  
  @media only screen and (min-device-width: 375px) and (max-device-width: 667px) and (orientation: landscape) {
    .top, .bottom {
      top: 15vh;
      left: 2vw;
      width: 60vw;
      height: 70px;
    }
  }
  
  @media only screen and (min-device-width: 414px) and (max-device-width: 736px) and (orientation: landscape) {
    .top, .bottom {
      top: 10vh;
    }
  }
  
  // iPhone X/newer iPhones
  @media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (orientation: portrait) {
    .bottom, .top {
      width: 100vw;
      height: 60px;
    }
  }
  
  @media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (orientation: landscape) {
    .bottom, .top {
      width: 50vw;
    }
  }
  
  // iPad
  @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
    width: 80vw;
    
    .top, .bottom {
      width: 60vw;
      height: 70px;
    }
  }
  
  // iPad Pro
  @media only screen and (min-device-width: 1024px) and (max-device-width: 1366px) {
    display: block;
    
    .top, .bottom {
      width: 40vw;
      height: 70px;
      top: 0;
      left: 2vw;
    }
  }
`;

export const Boxes = styled(motion.div)`
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  width: 100vw;
  height: auto;
  margin: 2px;
  padding: 2px 0;
  transition: all 0.3s ease;
  
  p {
    font-size: 1em;
    letter-spacing: 2px;
    color: black;
  }
`;

export const RightBox = styled(motion.div)`
  width: 50%;
  margin: 10px;
  padding: 10px;
  box-sizing: border-box;
  box-shadow: 0 1px 5px 1px rgba(250, 250, 250, 0.25);
  text-align: center;
  
  ${mediaQueries.tablet} {
    width: auto;
  }
`;

export const TextSpan = styled(motion.div)`
  width: 100%;
  position: relative;
  text-align: left;
  overflow: hidden;
  padding: 2px 10px;
  margin: 70px auto 0;

  ${mediaQueries.tablet} {
    width: auto;
  }
  
  @media only screen and (min-device-width: 320px) and (max-device-width: 568px) and (orientation: landscape) {
    margin-top: 100px;
    width: auto;
  }
  
  @media only screen and (min-device-width: 375px) and (max-device-width: 667px) and (orientation: landscape) {
    margin-top: 110px;
  }
  
  @media only screen and (min-device-width: 414px) and (max-device-width: 736px) and (orientation: landscape) {
    margin-top: 90px;
    width: auto;
  }

  @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
    margin-top: 100px;
  }
`;