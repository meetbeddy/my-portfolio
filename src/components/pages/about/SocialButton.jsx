import React from "react";
import styled from "styled-components";

const SocialButtonContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: center;
  margin-top: ${props => props.theme.spacing.lg};
`;

const SocialButton = styled.button`
  background-color: ${props => props.bgColor || props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borders.radius.md};
  border: none;
  transition: ${props => props.theme.animation.durations.medium} ${props => props.theme.animation.easings.easeInOut};
  cursor: pointer;
  
  &:hover {
    filter: brightness(90%);
  }
`;

const SocialButtons = () => {
    return (
        <SocialButtonContainer>
            <SocialButton bgColor="#0077b5">LinkedIn</SocialButton>
            <SocialButton bgColor="#111111">GitHub</SocialButton>
            <SocialButton>Twitter</SocialButton>
        </SocialButtonContainer>
    );
};

export default SocialButtons;