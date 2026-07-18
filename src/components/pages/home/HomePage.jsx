import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Gamepad2, Github, Linkedin, MessageSquare } from "lucide-react";
import styled from "styled-components";
import portrait from "./obed-dark-bg.png";

const HomeShell = styled(motion.main)`
  width: calc(100% - 76px);
  min-height: 100vh;
  margin-left: 76px;
  background: #080808;
  color: ${props => props.theme.colors.text};
  overflow: hidden;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
    margin-left: 0;
    padding-bottom: 88px;
  }
`;

const Hero = styled.section`
  position: relative;
  min-height: 78vh;
  display: flex;
  align-items: center;
  padding: ${props => props.theme.spacing['3xl']};
  isolation: isolate;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    min-height: 76vh;
    align-items: flex-start;
    padding: ${props => props.theme.spacing['2xl']} ${props => props.theme.spacing.lg};
  }

  @media (max-width: ${props => props.theme.breakpoints.mobileL}) {
    padding-top: ${props => props.theme.spacing.xl};
  }
`;

const Portrait = styled.img`
  position: absolute;
  right: 6%;
  bottom: 0;
  width: 430px;
  height: 92%;
  object-fit: contain;
  object-position: center bottom;
  z-index: -1;

  @media (max-width: ${props => props.theme.breakpoints.laptop}) {
    right: -3%;
    opacity: 0.72;
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    right: -24%;
    width: 78%;
    height: 76%;
    opacity: 0.28;
  }
`;

const HeroContent = styled(motion.div)`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 760px;
`;

const Role = styled.p`
  margin: 0 0 ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.accent};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  letter-spacing: 0;
  text-transform: uppercase;
`;

const Name = styled.h1`
  margin: 0 0 ${props => props.theme.spacing.md};
  font-size: 4.5rem;
  line-height: 1;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  letter-spacing: 0;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 3rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobileL}) {
    font-size: 2.5rem;
  }
`;

const PositioningStatement = styled.h2`
  max-width: 690px;
  margin: 0 0 ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.typography.fontSizes['2xl']};
  line-height: 1.25;
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  letter-spacing: 0;

  @media (max-width: ${props => props.theme.breakpoints.mobileL}) {
    font-size: ${props => props.theme.typography.fontSizes.xl};
  }
`;

const Summary = styled.p`
  max-width: 650px;
  margin: 0 0 ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSizes.md};
  line-height: 1.7;

  @media (max-width: ${props => props.theme.breakpoints.mobileL}) {
    font-size: ${props => props.theme.typography.fontSizes.base};
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.md};
`;

const ActionLink = styled(Link)`
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  border: 1px solid ${props => props.$secondary ? props.theme.colors.border : props.theme.colors.primary};
  border-radius: ${props => props.theme.borders.radius.md};
  background: ${props => props.$secondary ? 'transparent' : props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  transition: background 180ms ease, border-color 180ms ease, transform 180ms ease;

  &:hover {
    background: ${props => props.$secondary ? props.theme.colors.surfaceHover : props.theme.colors.primaryDark};
    border-color: ${props => props.$secondary ? props.theme.colors.textMuted : props.theme.colors.primaryDark};
    transform: translateY(-2px);
  }
`;

const DemoLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  min-height: 44px;
  color: ${props => props.theme.colors.textSecondary};
  text-decoration: none;
  font-weight: ${props => props.theme.typography.fontWeight.medium};

  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const FocusBand = styled.section`
  min-height: 22vh;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: #f1f1eb;
  color: #171717;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const FocusItem = styled.div`
  min-width: 0;
  padding: ${props => props.theme.spacing.xl};
  border-left: 1px solid rgba(23, 23, 23, 0.14);
  border-top: 4px solid ${props => props.$accent};

  &:first-child {
    border-left: 0;
  }

  h3 {
    margin: 0 0 ${props => props.theme.spacing.sm};
    font-size: ${props => props.theme.typography.fontSizes.lg};
    letter-spacing: 0;
  }

  p {
    margin: 0;
    color: #4b4b47;
    line-height: 1.6;
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    border-left: 0;
    padding: ${props => props.theme.spacing.lg};
  }
`;

const TrustSection = styled.section`
  display: grid;
  grid-template-columns: 1.1fr 1fr 0.8fr 1.1fr;
  padding: ${props => props.theme.spacing['2xl']} ${props => props.theme.spacing['3xl']};
  background: #131313;
  border-top: 1px solid ${props => props.theme.colors.border};

  @media (max-width: ${props => props.theme.breakpoints.laptop}) {
    grid-template-columns: repeat(2, 1fr);
    padding: ${props => props.theme.spacing['2xl']};
  }

  @media (max-width: ${props => props.theme.breakpoints.mobileL}) {
    grid-template-columns: 1fr;
    padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing.lg};
  }
`;

const TrustColumn = styled.div`
  min-width: 0;
  padding: 0 ${props => props.theme.spacing.xl};
  border-left: 1px solid ${props => props.theme.colors.border};

  &:first-child {
    padding-left: 0;
    border-left: 0;
  }

  h2,
  h3 {
    margin-bottom: ${props => props.theme.spacing.sm};
    letter-spacing: 0;
  }

  h2 {
    font-size: ${props => props.theme.typography.fontSizes.xl};
  }

  h3 {
    font-size: ${props => props.theme.typography.fontSizes.lg};
  }

  p {
    margin: 0;
    color: ${props => props.theme.colors.textMuted};
    line-height: 1.6;
  }

  @media (max-width: ${props => props.theme.breakpoints.laptop}) {
    padding: ${props => props.theme.spacing.lg};
    border-left: 0;
    border-top: 1px solid ${props => props.theme.colors.border};

    &:first-child,
    &:nth-child(2) {
      border-top: 0;
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.mobileL}) {
    padding: ${props => props.theme.spacing.lg} 0;

    &:nth-child(2) {
      border-top: 1px solid ${props => props.theme.colors.border};
    }
  }
`;

const Metric = styled.strong`
  display: block;
  margin-bottom: ${props => props.theme.spacing.xs};
  color: ${props => props.theme.colors.primaryLight};
  font-size: ${props => props.theme.typography.fontSizes['3xl']};
  line-height: 1;
`;

const TrustLinks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${props => props.theme.spacing.sm};

  a {
    display: inline-flex;
    align-items: center;
    gap: ${props => props.theme.spacing.sm};
    color: ${props => props.theme.colors.textSecondary};

    &:hover {
      color: ${props => props.theme.colors.text};
    }
  }
`;

const HomePage = () => (
  <HomeShell
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Hero>
      <Portrait src={portrait} alt="Portrait of Obed Okpala" />
      <HeroContent
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <Role>Full-stack product engineer</Role>
        <Name>Obed Okpala</Name>
        <PositioningStatement>
          I build dependable software for complex, real-world operations.
        </PositioningStatement>
        <Summary>
          React, Angular, Node.js, and TypeScript systems for government services,
          cooperative finance, secure elections, and high-interaction web products.
        </Summary>
        <Actions>
          <ActionLink to="/projects">
            View projects
            <ArrowRight size={18} />
          </ActionLink>
          <ActionLink to="/contact" $secondary>
            <MessageSquare size={18} />
            Start a conversation
          </ActionLink>
          <DemoLink to="/play">
            <Gamepad2 size={18} />
            Play engineering demo
          </DemoLink>
        </Actions>
      </HeroContent>
    </Hero>

    <FocusBand aria-label="Engineering focus">
      <FocusItem $accent="#e04848">
        <h3>Operational products</h3>
        <p>Vehicle services, elections, cooperative finance, and public-sector workflows.</p>
      </FocusItem>
      <FocusItem $accent="#4880e0">
        <h3>Across the stack</h3>
        <p>From interaction design and frontend architecture to APIs, data, and deployment.</p>
      </FocusItem>
      <FocusItem $accent="#2ea867">
        <h3>Built for longevity</h3>
        <p>Performance, maintainability, security, and reliable day-to-day operations.</p>
      </FocusItem>
    </FocusBand>

    <TrustSection aria-label="Professional proof">
      <TrustColumn>
        <h2>Verified experience</h2>
        <p>More than four years delivering frontend and full-stack product work.</p>
      </TrustColumn>
      <TrustColumn>
        <h3>Current role</h3>
        <p>Full-Stack Developer at Compumetrics Solutions Ltd, since December 2022.</p>
      </TrustColumn>
      <TrustColumn>
        <Metric>20%</Metric>
        <p>Page-load reduction achieved through asset optimization and lazy loading.</p>
      </TrustColumn>
      <TrustColumn>
        <h3>Verify the work</h3>
        <TrustLinks>
          <a
            href="https://drive.google.com/file/d/1GG_Q7PrssF2dtY8D5zc4ThWdwDBXun5H/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FileText size={17} /> Resume
          </a>
          <a href="https://github.com/meetbeddy" target="_blank" rel="noopener noreferrer">
            <Github size={17} /> GitHub
          </a>
          <a href="https://linkedin.com/in/obed-okpala" target="_blank" rel="noopener noreferrer">
            <Linkedin size={17} /> LinkedIn
          </a>
        </TrustLinks>
      </TrustColumn>
    </TrustSection>
  </HomeShell>
);

export default HomePage;
