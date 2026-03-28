import styled from "styled-components";
import { motion } from "framer-motion";
import { circleMove } from "../animations";

export const ContentContainer = styled(motion.div)`
  max-width: ${props => props.maxWidth || "1000px"};
  width: 90%;
  margin: ${props => props.theme.spacing.md} auto 0;
  padding: ${props => props.theme.spacing.xl};
  background: ${props => props.theme.mixins.glassEffect.background};
  backdrop-filter: ${props => props.theme.mixins.glassEffect.backdropFilter};
  -webkit-backdrop-filter: ${props => props.theme.mixins.glassEffect.backdropFilter};
  border-radius: ${props => props.theme.borders.radius.xl};
  border: ${props => props.theme.mixins.glassEffect.border};
  box-shadow: ${props => props.theme.shadows.lg};
  position: relative;
  z-index: ${props => props.theme.zIndex.base + 2};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: ${props => props.theme.spacing.md};
    padding-bottom: 100px; /* clear the floating mobile nav bar */
    margin-top: ${props => props.theme.spacing.xs};
  }
`;

export const PageHeader = styled.div`
  position: relative;
  height: 80px;
  margin-bottom: ${props => props.theme.spacing.lg};
  
  .bottom, .top {
    position: absolute;
    width: 100%;
    height: 100px;
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
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    h1 {
      font-size: ${props => props.theme.typography.fontSizes['2xl']};
    }
    /* Push the decorative white circle off-screen edge on mobile so it
       doesn't overlay the page title text */
    .top {
      clip-path: circle(8% at 98% 50%);
    }
  }
`;

export const PageParagraph = styled(motion.p)`
  font-size: ${props => props.theme.typography.fontSizes.base};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
  margin-bottom: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.textSecondary};
  letter-spacing: ${props => props.theme.typography.letterSpacing.wide};
`;

export const SubTitle = styled(motion.h5)`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  margin-bottom: ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.primaryLight};
  line-height: ${props => props.theme.typography.lineHeight.normal};
`;

export const TwoColumnLayout = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${props => props.theme.spacing.lg};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

export const LeftColumn = styled(motion.div)`
  flex: ${props => props.flex || 1};
`;

export const RightColumn = styled(motion.div)`
  flex: ${props => props.flex || 1};
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.backgroundElevated};
  border-radius: ${props => props.theme.borders.radius.lg};
  border: ${props => props.theme.borders.width.thin} solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.sm};
`;

export const StyledButton = styled(motion.button)`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.primaryDark} 100%);
  color: ${props => props.theme.colors.text};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-size: ${props => props.theme.typography.fontSizes.base}; 
  letter-spacing: ${props => props.theme.typography.letterSpacing.wide};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borders.radius.full};
  box-shadow: ${props => props.theme.shadows.glow};
  border: none;
  cursor: pointer;
  min-height: 2.5rem;
  ${props => props.theme.mixins.smoothTransition('all')}
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px ${props => `rgba(${parseInt(props.theme.colors.primary.slice(1, 3), 16)}, ${parseInt(props.theme.colors.primary.slice(3, 5), 16)}, ${parseInt(props.theme.colors.primary.slice(5, 7), 16)}, 0.6)`};
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 10px ${props => `rgba(${parseInt(props.theme.colors.primary.slice(1, 3), 16)}, ${parseInt(props.theme.colors.primary.slice(3, 5), 16)}, ${parseInt(props.theme.colors.primary.slice(5, 7), 16)}, 0.4)`};
  }
`;


export const NavLink = styled(motion.a)`
  position: relative;
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  font-size: ${props => props.theme.typography.fontSizes.md};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  ${props => props.theme.mixins.smoothTransition('all')}
  font-family: ${props => props.theme.typography.fontFamily.primary};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
  
  &.active {
    color: ${props => props.theme.colors.primary};
    
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: ${props => props.theme.spacing.md};
      width: 20px;
      height: 2px;
      background-color: ${props => props.theme.colors.primary};
    }
  }
`;

// Button styling
export const Button = styled(motion.button)`
  background-color: ${props => props.secondary ? 'transparent' : props.theme.components.button.primary.background};
  color: ${props => props.secondary ? props.theme.colors.primary : props.theme.components.button.primary.text};
  border: ${props => props.secondary ? `${props.theme.borders.width.thin} solid ${props.theme.colors.primary}` : 'none'};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.typography.fontSizes.base};
  border-radius: ${props => props.theme.borders.radius.md};
  cursor: pointer;
  ${props => props.theme.mixins.smoothTransition('all')}
  font-family: ${props => props.theme.typography.fontFamily.primary};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  
  &:hover {
    background-color: ${props => props.secondary ? 'rgba(224, 72, 72, 0.1)' : props.theme.components.button.primary.hover};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.sm};
  }
  
  &:active {
    transform: translateY(1px);
    background-color: ${props => props.secondary ? 'rgba(224, 72, 72, 0.2)' : props.theme.components.button.primary.active};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.backgroundElevated};
    color: ${props => props.theme.colors.textMuted};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

// Card component for projects or skills
export const Card = styled(motion.div)`
  background-color: ${props => props.theme.components.card.background};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borders.radius.lg};
  margin: ${props => props.theme.spacing.md};
  ${props => props.theme.mixins.smoothTransition('all')}
  box-shadow: ${props => props.theme.components.card.shadow};
  
  &:hover {
    background-color: ${props => props.theme.components.card.hover};
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
  
  h3 {
    color: ${props => props.theme.colors.primary};
    margin-bottom: ${props => props.theme.spacing.sm};
    font-weight: ${props => props.theme.typography.fontWeight.semibold};
  }
  
  p {
    color: ${props => props.theme.colors.textSecondary};
    font-size: ${props => props.theme.typography.fontSizes.base};
    line-height: ${props => props.theme.typography.lineHeight.normal};
  }
`;

// Section container for page layout
export const SectionContainer = styled(motion.section)`
  padding: ${props => props.theme.spacing.xl};
  margin: 0 auto;
  max-width: 1200px;
  
  h2 {
    font-size: ${props => props.theme.typography.fontSizes['2xl']};
    margin-bottom: ${props => props.theme.spacing.xl};
    position: relative;
    font-weight: ${props => props.theme.typography.fontWeight.semibold};
    
    &:after {
      content: '';
      position: absolute;
      bottom: -${props => props.theme.spacing.sm};
      left: 0;
      width: 60px;
      height: 3px;
      background-color: ${props => props.theme.colors.primary};
    }
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.md};
  }
`;

// Progress bar for skills section
export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borders.radius.sm};
  margin: ${props => props.theme.spacing.sm} 0 ${props => props.theme.spacing.md};
  overflow: hidden;
  
  .fill {
    height: 100%;
    width: ${props => props.progress || '0%'};
    background-color: ${props => props.theme.colors.primary};
    border-radius: ${props => props.theme.borders.radius.sm};
    transition: width 0.8s ${props => props.theme.animation.easings.easeInOut};
  }
`;

// Contact form elements
export const FormInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.components.input.background};
  border: ${props => props.theme.borders.width.thin} solid ${props => props.theme.components.input.border};
  color: ${props => props.theme.components.input.text};
  border-radius: ${props => props.theme.borders.radius.md};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  font-size: ${props => props.theme.typography.fontSizes.base};
  ${props => props.theme.mixins.smoothTransition('border-color')}
  
  &:focus {
    border-color: ${props => props.theme.components.input.focusBorder};
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.theme.colors.borderFocus};
  }
  
  &::placeholder {
    color: ${props => props.theme.components.input.placeholder};
  }
`;

export const FormTextarea = styled.textarea`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.components.input.background};
  border: ${props => props.theme.borders.width.thin} solid ${props => props.theme.components.input.border};
  color: ${props => props.theme.components.input.text};
  border-radius: ${props => props.theme.borders.radius.md};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  font-size: ${props => props.theme.typography.fontSizes.base};
  min-height: 150px;
  resize: vertical;
  ${props => props.theme.mixins.smoothTransition('border-color')}
  
  &:focus {
    border-color: ${props => props.theme.components.input.focusBorder};
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.theme.colors.borderFocus};
  }
  
  &::placeholder {
    color: ${props => props.theme.components.input.placeholder};
  }
`;

// Grid for responsive layouts
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  width: 100%;
  
  @media (max-width: ${props => props.theme.breakpoints.mobileL}) {
    grid-template-columns: 1fr;
  }
`;

// New components utilizing the updated theme

// Hero section component
export const HeroSection = styled.div`
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: ${props => props.theme.spacing['2xl']};
  position: relative;
  overflow: hidden;
  
  h1 {
    font-size: ${props => props.theme.typography.fontSizes['4xl']};
    font-weight: ${props => props.theme.typography.fontWeight.bold};
    margin-bottom: ${props => props.theme.spacing.md};
    letter-spacing: ${props => props.theme.typography.letterSpacing.tight};
  }
  
  p {
    font-size: ${props => props.theme.typography.fontSizes.xl};
    font-weight: ${props => props.theme.typography.fontWeight.light};
    color: ${props => props.theme.colors.textSecondary};
    margin-bottom: ${props => props.theme.spacing.xl};
    max-width: 600px;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing.md};
    
    h1 {
      font-size: ${props => props.theme.typography.fontSizes['3xl']};
    }
    
    p {
      font-size: ${props => props.theme.typography.fontSizes.lg};
    }
  }
`;

// Project card component
export const ProjectCard = styled(motion.div)`
  background-color: ${props => props.theme.components.card.background};
  border-radius: ${props => props.theme.borders.radius.lg};
  overflow: hidden;
  box-shadow: ${props => props.theme.components.card.shadow};
  display: flex;
  flex-direction: column;
  height: 100%;
  ${props => props.theme.mixins.smoothTransition('all')}
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: ${props => props.theme.shadows.lg};
    
    .project-image {
      transform: scale(1.05);
    }
  }
  
  .project-image-container {
    height: 200px;
    overflow: hidden;
    width: 100%;
  }
  
  .project-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    ${props => props.theme.mixins.smoothTransition('transform')}
  }
  
  .project-content {
    padding: ${props => props.theme.spacing.lg};
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .project-title {
    font-size: ${props => props.theme.typography.fontSizes.lg};
    font-weight: ${props => props.theme.typography.fontWeight.semibold};
    margin-bottom: ${props => props.theme.spacing.sm};
    color: ${props => props.theme.colors.text};
  }
  
  .project-description {
    color: ${props => props.theme.colors.textSecondary};
    margin-bottom: ${props => props.theme.spacing.md};
    flex: 1;
  }
  
  .project-tags {
    display: flex;
    flex-wrap: wrap;
    gap: ${props => props.theme.spacing.xs};
    margin-top: ${props => props.theme.spacing.sm};
  }
  
  .project-tag {
    background-color: ${props => props.theme.colors.surface};
    color: ${props => props.theme.colors.text};
    padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
    border-radius: ${props => props.theme.borders.radius.full};
    font-size: ${props => props.theme.typography.fontSizes.sm};
  }
`;

// Header with glassmorphism effect for sticky navigation
export const GlassHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  z-index: ${props => props.theme.zIndex.sticky};
  ${props => props.theme.mixins.glassEffect};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${props => props.theme.spacing.xl};
  ${props => props.theme.mixins.smoothTransition('all')}
  
  &.scrolled {
    height: 60px;
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 0 ${props => props.theme.spacing.md};
  }
`;

// Badge component for labels, tags or status indicators
export const Badge = styled.span`
  display: inline-block;
  background-color: ${props => props.variant === 'primary'
    ? props.theme.colors.primary
    : props.variant === 'secondary'
      ? props.theme.colors.secondary
      : props.variant === 'accent'
        ? props.theme.colors.accent
        : props.theme.colors.surface};
  color: ${props =>
    props.variant === 'primary' || props.variant === 'secondary' || props.variant === 'accent'
      ? '#fff'
      : props.theme.colors.text};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borders.radius.full};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

// Animated container that reveals content when scrolled into view
export const RevealContainer = styled(motion.div)`
  overflow: hidden;
`;
