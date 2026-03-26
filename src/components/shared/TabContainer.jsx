
import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const TabButton = styled(motion.button)`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borders.radius.full};
  ${props => props.theme.mixins.smoothTransition('all')}
  margin: ${props => props.theme.spacing.xs};
  background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.surface};
  color: ${props => props.active ? props.theme.colors.text : props.theme.colors.text};
  border: none;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primaryDark : props.theme.colors.surfaceHover};
  }
`;

const StyledTabContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.sm};
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing.xl};
  role: "tablist";
`;

const TabContainer = ({ activeSection, onTabChange, tabs }) => {
    return (
        <StyledTabContainer role="tablist">
            {tabs.map((section) => (
                <TabButton
                    key={section}
                    role="tab"
                    id={`tab-${section}`}
                    aria-selected={activeSection === section}
                    aria-controls={`panel-${section}`}
                    active={activeSection === section}
                    onClick={() => onTabChange(section)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                </TabButton>
            ))}
        </StyledTabContainer>
    );
};

export default TabContainer;