import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";

const circleMove = keyframes`
{
  0%, 100% {
    clip-path: circle(10% at 85% 50%);
  }
  25% {
    clip-path: circle(10% at 15% 50%);
  }
`;

export const FlexContainer = styled(motion.div)`
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 95vw;
  height: auto;
  margin-top: 80px;
  padding: 2px 0 2px;
  @media (max-width: 768px) {
    margin-top: 90px;
  }
  @media only screen and (min-device-width: 320px) and (max-device-width: 568px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: landscape) {
    display: block;
    margin-top: 100px;
    width: auto;
  }
  @media only screen and (min-device-width: 375px) and (max-device-width: 667px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: landscape) {
    display: block;
    margin-top: 110px;
    width: auto;
  }
`;
export const Frame = styled(motion.div)`
  width: auto;
  display: flex;
  margin: auto;
`;
export const FlexWrapper = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  position: absolute;
  top: 2vh;
  left: 76px;
  width: auto;
  // height: 100vh;
  margin-top: 8vh;
  margin-left: 4px;
  margin-right: 4px;
  cursor: auto;
  h1,
  h2 {
    font-size: 3.3em;
    letter-spacing: -4px;
    font-weight: 700;
    margin-top: 0;
    margin-bottom: 0;
  }
  P {
    font-size: 0.9em;
    letter-spacing:1px;
    font-spacing:2px;
    color: #fff;
  }
  .bottom,
  .top {
    width: 30vw;
    height: 73px;
    position: absolute;
    top: 0vh;
    left: 2px;
  }
  .bottom {
    color: #e04848;
  }

  .top {
    background-color: white;
    color: black;
    clip-path: circle(13% at 85% 50%);
    animation: ${circleMove} 10s ease-in-out infinite;
    z-index: 1;
  }

  @media (max-width: 768px) {
    display: block;
    left: 0;
    right: 0;
    h1,
    h2 {
      font-size: 2.2em;
      letter-spacing: -2px;
    }
    .top,
    .bottom {
      top: 2.5vh;
      left: 2vw;
      width: 100vw;
      height: 10vh;
    }
  }
  @media only screen and (min-device-width: 320px) and (max-device-width: 480px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: landscape) {
  }
  @media only screen and (min-device-width: 414px) and (max-device-width: 736px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape) {
    .top,
    .bottom {
      top: 10vh;
    }
  }
  @media only screen and (min-device-width: 375px) and (max-device-width: 667px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: landscape) {
    .top,
    .bottom {
      top: 15vh;
      left: 2vw;
      width: 60vw;
      height: 70px;
    }
  }
  @media only screen and (min-device-width: 320px) and (max-device-width: 568px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: landscape) {
    top: 9vh;

    .top,
    .bottom {
      top: 10vh;
      left: 2vw;
      width: 60vw;
      height: 70px;
    }
  }
  @media only screen 
  and (min-device-width: 375px) 
  and (max-device-width: 812px) 
  and (-webkit-min-device-pixel-ratio: 3)
  and (orientation: portrait) { 
    .bottom,
    .top {
      width: 100vw;
      height: 60px;
     
    }
}
  @media only screen and (min-device-width: 375px) 
  and (max-device-width: 812px) 
  and (-webkit-min-device-pixel-ratio: 3) 
  and (orientation: landscape) {
    .bottom,
    .top {
      width: 50vw;
      
    }
  }
  @media only screen 
  and (min-device-width: 768px) 
  and (max-device-width: 1024px) 
  and (-webkit-min-device-pixel-ratio: 1) {
    width:80vw;
    .top,
    .bottom {
      width: 60vw;
      height: 70px;
    }
  }
  @media only screen 
  and (min-device-width: 1024px) 
  and (max-device-width: 1366px) 
  and (-webkit-min-device-pixel-ratio: 1.5) {
  display:block;
    .top,
    .bottom {
      width: 40vw;
      height: 70px;
      top: 0;
      left: 2vw;
    }
  }
}
`;
export const Boxes = styled(motion.div)`
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  width: 100vw;
  height: auto;
  margin: 2px 2px 2px;
  padding: 2px 0 2px;
  transition: all 0.3s ease;
  P {
    font-size: 1em;
    letter-spacing: 2px;
    color: black;
  }
`;

export const RightBox = styled(motion.div)`
  
  width:50% ;
  margin: 10px;
  padding:10px;
  box-sizing:border-box;
  box-shadow: 0 1px 5px 1px rgba(250, 250, 250, 0.25);
  text-align:center;
  }
  @media (max-width:768px){
    width:auto;
  
    // .map-area{
    //   width:auto;
    //   margin-left: 0;
    //   margin-top:0
    //   --offset-height: -200px;
    //   position:inherit;
    // }
  }
`;

export const TextSpan = styled(motion.div)`
  width: 100%;
  position: relative;
  text-align: left;

  overflow: hidden;
  padding: 2px 10px 2px;
  margin: 70px auto 0;

  @media (max-width: 768px) {
    width: auto;
    // margin: 1rem auto 2rem;
  }
  @media only screen and (min-device-width: 375px) and (max-device-width: 667px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: landscape) {
    margin-top: 110px;
  }
  @media only screen and (min-device-width: 414px) and (max-device-width: 736px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape) {
    margin-top: 90px;
    width: auto;
  }
  @media only screen and (min-device-width: 320px) and (max-device-width: 568px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: landscape) {
    margin-top: 100px;
    width: auto;
  }

  @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 1) {
    margin-top: 100px;
  }
`;
