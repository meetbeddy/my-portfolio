import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { ContentContainer, PageHeader } from "../shared/StyledComponents";
import { ContainerVariants } from "../animations";

const PageFrame = styled(motion.main)`
  width: calc(100% - 76px);
  min-height: 100vh;
  margin-left: 76px;
  background: ${props => props.theme.colors.background};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
    margin-left: 0;
  }
`;

const PageLayout = ({ title, subtitle, children, maxWidth }) => (
  <PageFrame
    variants={ContainerVariants}
    initial="initial"
    animate="visible"
    exit="exit"
  >
    <ContentContainer $maxWidth={maxWidth}>
      <PageHeader>
        <p className="eyebrow">Obed Okpala / Portfolio</p>
        <h1>{title}</h1>
        {subtitle && <p className="subtitle">{subtitle}</p>}
      </PageHeader>
      {children}
    </ContentContainer>
  </PageFrame>
);

export default PageLayout;
