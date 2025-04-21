
import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const StyledSection = styled(motion.div)`
  margin-top: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 }
    }
};

const Section = ({ id, ariaLabelledby, children }) => {
    return (
        <StyledSection
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            role="tabpanel"
            id={id}
            aria-labelledby={ariaLabelledby}
        >
            {children}
        </StyledSection>
    );
};

export default Section;