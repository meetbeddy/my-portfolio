import styled from "styled-components";
import { motion } from "framer-motion";

// Using theme breakpoints directly instead of defining constants
export const FlexWrapper = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  position: absolute;
  top: 0.2vh;
  left: 76px;
  width: auto;
  margin-top: 8vh;
  margin-left: ${props => props.theme.spacing.xs};
  margin-right: ${props => props.theme.spacing.xs};
  cursor: auto;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: block;
    left: 0;
    right: 0;
    
    h1, h2 {
      font-size: ${props => props.theme.typography.fontSizes['2xl']};
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
  ${props => props.theme.mixins.smoothTransition('all')}
  
  ${props => `@media only screen and (min-device-width: 320px) and (max-device-width: 568px) and (orientation: landscape)`} {
    top: 9vh;
    
    .top, .bottom {
      top: 10vh;
      left: 2vw;
      width: 60vw;
      height: 70px;
    }
  }
  
  ${props => `@media only screen and (min-device-width: 375px) and (max-device-width: 667px) and (orientation: landscape)`} {
    .top, .bottom {
      top: 15vh;
      left: 2vw;
      width: 60vw;
      height: 70px;
    }
  }
  
  ${props => `@media only screen and (min-device-width: 414px) and (max-device-width: 736px) and (orientation: landscape)`} {
    .top, .bottom {
      top: 10vh;
    }
  }
  
  // iPhone X/newer iPhones
  ${props => `@media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (orientation: portrait)`} {
    .bottom, .top {
      width: 100vw;
      height: 60px;
    }
  }
  
  ${props => `@media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (orientation: landscape)`} {
    .bottom, .top {
      width: 50vw;
    }
  }
  
  // iPad
  ${props => `@media only screen and (min-device-width: 768px) and (max-device-width: 1024px)`} {
    width: 80vw;
    
    .top, .bottom {
      width: 60vw;
      height: 70px;
    }
  }
  
  // iPad Pro
  ${props => `@media only screen and (min-device-width: 1024px) and (max-device-width: 1366px)`} {
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
  margin: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.xs} 0;
  ${props => props.theme.mixins.smoothTransition('all')}
  
  p {
    font-size: ${props => props.theme.typography.fontSizes.base};
    letter-spacing: 2px;
    color: black;
  }
`;

export const RightBox = styled(motion.div)`
  width: 50%;
  margin: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  box-sizing: border-box;
  box-shadow: ${props => props.theme.shadows.sm};
  text-align: center;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: auto;
  }
`;

export const TextSpan = styled(motion.div)`
  width: 100%;
  position: relative;
  text-align: left;
  overflow: hidden;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
  margin: 70px auto 0;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: auto;
  }
  
  ${props => `@media only screen and (min-device-width: 320px) and (max-device-width: 568px) and (orientation: landscape)`} {
    margin-top: 100px;
    width: auto;
  }
  
  ${props => `@media only screen and (min-device-width: 375px) and (max-device-width: 667px) and (orientation: landscape)`} {
    margin-top: 110px;
  }
  
  ${props => `@media only screen and (min-device-width: 414px) and (max-device-width: 736px) and (orientation: landscape)`} {
    margin-top: 90px;
    width: auto;
  }

  ${props => `@media only screen and (min-device-width: 768px) and (max-device-width: 1024px)`} {
    margin-top: 100px;
  }
`;

