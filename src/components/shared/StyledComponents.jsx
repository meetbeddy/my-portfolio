import styled from "styled-components";
import { motion } from "framer-motion";
import { circleMove } from "../animations";

export const ContentContainer = styled(motion.div)`
  max-width: ${props => props.maxWidth || "1000px"};
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

export const PageHeader = styled.div`
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

export const PageParagraph = styled(motion.p)`
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.5px;
`;

export const SubTitle = styled(motion.h5)`
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  color: #f5b7b3;
  line-height: 1.4;
`;

export const TwoColumnLayout = styled.div`
  display: flex;
  flex-direction: row;
  gap: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const LeftColumn = styled(motion.div)`
  flex: ${props => props.flex || 1};
`;

export const RightColumn = styled(motion.div)`
  flex: ${props => props.flex || 1};
  padding: 20px;
  background: rgba(40, 40, 40, 0.5);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

export const StyledButton = styled(motion.button)`
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
