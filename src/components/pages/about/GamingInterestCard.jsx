import React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { Link } from "react-router-dom";

const GamingCard = styled(motion.div)`
  background-color: ${props => props.bgColor};
  border-radius: ${props => props.theme.borders.radius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at center, rgba(224, 72, 72, 0.1) 0%, transparent 70%);
    pointer-events: none;
  }
`;

const PlayButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #e04848 0%, #8a1818 100%);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.9rem;
  margin-top: 1rem;
  box-shadow: 0 4px 15px rgba(224, 72, 72, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(224, 72, 72, 0.4);
  }
`;

const GamingInterestCard = ({ bgColor = "rgba(255,255,255,0.05)" }) => {
  return (
    <GamingCard bgColor={bgColor} whileHover={{ y: -5 }}>
      <div>
        <div style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.5rem", color: "white" }}>
          🎮 Interactive Experience
        </div>
        <p style={{ color: "#aaa", fontSize: "0.88rem", lineHeight: "1.6" }}>
          I enjoy push boundaries of the web with immersive, 3D experiences. 
          Check out this hardware-accelerated Asteroid Field I built using Three.js and custom physics.
        </p>
      </div>
      <PlayButton to="/play">
        <i className="fa fa-gamepad" /> Launch Experience
      </PlayButton>
    </GamingCard>
  );
};

export default GamingInterestCard;
