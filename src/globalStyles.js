import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
    font-size: 16px;
    line-height: ${props => props.theme.typography.lineHeight.normal};
    overflow-y: scroll;
  }

  body {
    margin: 0;
    font-family: ${props => props.theme.typography.fontFamily.primary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    text-rendering: optimizeLegibility;
    overscroll-behavior: none;
    font-display: swap;
    font-weight: ${props => props.theme.typography.fontWeight.regular};
    font-size: ${props => props.theme.typography.fontSizes.base};

    @media (hover: hover) and (pointer: fine) {
      cursor: none;
    }
  }

  @media (hover: hover) and (pointer: fine) {
    a, button, input, textarea, select, label, [role="button"] {
      cursor: none;
    }
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.backgroundAlt};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary}80; /* 50% opacity */
    border-radius: ${props => props.theme.borders.radius.md};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.primary};
  }

  /* Selection styling */
  ::selection {
    background-color: ${props => props.theme.colors.primary};
    color: white;
  }

  /* Focus styling */
  :focus {
    outline: ${props => props.theme.borders.width.thin} solid ${props => props.theme.colors.borderFocus};
    outline-offset: 2px;
  }

  :focus:not(:focus-visible) {
    outline: none;
  }

  :focus-visible {
    outline: ${props => props.theme.borders.width.thin} solid ${props => props.theme.colors.borderFocus};
    outline-offset: 2px;
  }

  /* Code blocks */
  code {
    font-family: ${props => props.theme.typography.fontFamily.monospace};
    background-color: ${props => props.theme.colors.surface};
    padding: 0.2em 0.4em;
    border-radius: ${props => props.theme.borders.radius.sm};
    font-size: ${props => props.theme.typography.fontSizes.sm};
  }

  pre {
    background-color: ${props => props.theme.colors.backgroundElevated};
    padding: ${props => props.theme.spacing.md};
    border-radius: ${props => props.theme.borders.radius.md};
    overflow-x: auto;
    border: ${props => props.theme.borders.width.thin} solid ${props => props.theme.colors.border};
    margin: ${props => props.theme.spacing.md} 0;
  }

  pre code {
    background-color: transparent;
    padding: 0;
    border-radius: 0;
  }

  /* Link styling */
  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    transition: color ${props => props.theme.animation.durations.fast} ${props => props.theme.animation.easings.easeInOut};
    position: relative;
  }

  a:hover {
    color: ${props => props.theme.colors.primaryLight};
  }

  /* Fancy link underline animation on hover */
  a.animated-link {
    position: relative;
  }
  
  a.animated-link::after {
    content: '';
    position: absolute;
    width: 0;
    height: 1px;
    bottom: -2px;
    left: 0;
    background-color: ${props => props.theme.colors.primaryLight};
    transition: width ${props => props.theme.animation.durations.medium} ${props => props.theme.animation.easings.easeInOut};
  }
  
  a.animated-link:hover::after {
    width: 100%;
  }

  /* Heading styles with consistent vertical rhythm */
  h1, h2, h3, h4, h5, h6 {
    margin-top: 0;
    margin-bottom: ${props => props.theme.spacing.md};
    line-height: ${props => props.theme.typography.lineHeight.tight};
    font-weight: ${props => props.theme.typography.fontWeight.semibold};
    // color: ${props => props.theme.colors.text};
  }

  h1 {
    font-size: ${props => props.theme.typography.fontSizes['3xl']};
    letter-spacing: ${props => props.theme.typography.letterSpacing.tight};
  }

  h2 {
    font-size: ${props => props.theme.typography.fontSizes['2xl']};
  }

  h3 {
    font-size: ${props => props.theme.typography.fontSizes.xl};
  }

  h4 {
    font-size: ${props => props.theme.typography.fontSizes.lg};
  }
  
  h5 {
    font-size: ${props => props.theme.typography.fontSizes.md};
    font-weight: ${props => props.theme.typography.fontWeight.bold};
  }
  
  h6 {
    font-size: ${props => props.theme.typography.fontSizes.base};
    font-weight: ${props => props.theme.typography.fontWeight.bold};
    text-transform: uppercase;
    letter-spacing: ${props => props.theme.typography.letterSpacing.wide};
  }

  /* Paragraph spacing */
  p {
    margin-bottom: ${props => props.theme.spacing.md};
  }

  /* Image resets */
  img {
    max-width: 100%;
    height: auto;
    display: block;
    border-radius: ${props => props.theme.borders.radius.md};
  }
  
  /* Button reset */
  button {
    border: none;
    background: none;
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    cursor: pointer;
    padding: 0;
  }
  
  /* List styling */
  ul, ol {
    padding-left: ${props => props.theme.spacing.xl};
    margin-bottom: ${props => props.theme.spacing.md};
  }
  
  li {
    margin-bottom: ${props => props.theme.spacing.xs};
  }
  
  /* Utility classes */
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${props => props.theme.spacing.md};
  }
  
  /* Layout utilities */
  .flex {
    display: flex;
  }
  
  .flex-col {
    flex-direction: column;
  }
  
  .items-center {
    align-items: center;
  }
  
  .justify-center {
    justify-content: center;
  }
  
  .justify-between {
    justify-content: space-between;
  }
  
  .gap-sm {
    gap: ${props => props.theme.spacing.sm};
  }
  
  .gap-md {
    gap: ${props => props.theme.spacing.md};
  }
  
  .gap-lg {
    gap: ${props => props.theme.spacing.lg};
  }

  /* Spacing utilities */
  .mt-sm { margin-top: ${props => props.theme.spacing.sm}; }
  .mt-md { margin-top: ${props => props.theme.spacing.md}; }
  .mt-lg { margin-top: ${props => props.theme.spacing.lg}; }
  .mt-xl { margin-top: ${props => props.theme.spacing.xl}; }
  
  .mb-sm { margin-bottom: ${props => props.theme.spacing.sm}; }
  .mb-md { margin-bottom: ${props => props.theme.spacing.md}; }
  .mb-lg { margin-bottom: ${props => props.theme.spacing.lg}; }
  .mb-xl { margin-bottom: ${props => props.theme.spacing.xl}; }
  
  .py-sm { padding-top: ${props => props.theme.spacing.sm}; padding-bottom: ${props => props.theme.spacing.sm}; }
  .py-md { padding-top: ${props => props.theme.spacing.md}; padding-bottom: ${props => props.theme.spacing.md}; }
  .py-lg { padding-top: ${props => props.theme.spacing.lg}; padding-bottom: ${props => props.theme.spacing.lg}; }
  .py-xl { padding-top: ${props => props.theme.spacing.xl}; padding-bottom: ${props => props.theme.spacing.xl}; }
  
  .px-sm { padding-left: ${props => props.theme.spacing.sm}; padding-right: ${props => props.theme.spacing.sm}; }
  .px-md { padding-left: ${props => props.theme.spacing.md}; padding-right: ${props => props.theme.spacing.md}; }
  .px-lg { padding-left: ${props => props.theme.spacing.lg}; padding-right: ${props => props.theme.spacing.lg}; }
  .px-xl { padding-left: ${props => props.theme.spacing.xl}; padding-right: ${props => props.theme.spacing.xl}; }

  /* Animation classes */
  .fade-in {
    animation: fadeIn ${props => props.theme.animation.durations.medium} ${props => props.theme.animation.easings.easeOut} forwards;
  }

  .slide-up {
    animation: slideUp ${props => props.theme.animation.durations.medium} ${props => props.theme.animation.easings.easeOut} forwards;
  }

  .slide-in-right {
    animation: slideInRight ${props => props.theme.animation.durations.medium} ${props => props.theme.animation.easings.easeOut} forwards;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  /* Text classes */
  .text-gradient {
    background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.primaryLight} 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }
  
  .text-accent {
    color: ${props => props.theme.colors.accent};
  }
  
  .text-secondary {
    color: ${props => props.theme.colors.textSecondary};
  }
  
  .text-muted {
    color: ${props => props.theme.colors.textMuted};
  }
  
  .font-light {
    font-weight: ${props => props.theme.typography.fontWeight.light};
  }
  
  .font-medium {
    font-weight: ${props => props.theme.typography.fontWeight.medium};
  }
  
  .font-semibold {
    font-weight: ${props => props.theme.typography.fontWeight.semibold};
  }
  
  .font-bold {
    font-weight: ${props => props.theme.typography.fontWeight.bold};
  }
  
  .text-sm {
    font-size: ${props => props.theme.typography.fontSizes.sm};
  }
  
  .text-base {
    font-size: ${props => props.theme.typography.fontSizes.base};
  }
  
  .text-lg {
    font-size: ${props => props.theme.typography.fontSizes.lg};
  }
  
  .text-xl {
    font-size: ${props => props.theme.typography.fontSizes.xl};
  }
  
  .text-2xl {
    font-size: ${props => props.theme.typography.fontSizes['2xl']};
  }

  /* Card styling */
  .card {
    background-color: ${props => props.theme.components.card.background};
    border-radius: ${props => props.theme.borders.radius.lg};
    padding: ${props => props.theme.spacing.lg};
    box-shadow: ${props => props.theme.components.card.shadow};
    transition: transform ${props => props.theme.animation.durations.medium} ${props => props.theme.animation.easings.easeInOut},
                box-shadow ${props => props.theme.animation.durations.medium} ${props => props.theme.animation.easings.easeInOut};
  }
  
  .card:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
  
  /* Glass effect */
  .glass {
    background: ${props => props.theme.mixins.glassEffect.background};
    backdrop-filter: ${props => props.theme.mixins.glassEffect.backdropFilter};
    border: ${props => props.theme.mixins.glassEffect.border};
    border-radius: ${props => props.theme.borders.radius.lg};
  }

  /* App container */
  .App {
    position: relative;
    min-height: 100vh;
    width: 100%;
    overflow-x: hidden;
  }

  /* Homepage styles */
  .home-wrapper {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${props => props.theme.spacing.lg};
  }
  
  /* Responsive typography */
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    html {
      font-size: 15px;
    }
    
    h1 {
      font-size: ${props => props.theme.typography.fontSizes['2xl']};
    }
    
    h2 {
      font-size: ${props => props.theme.typography.fontSizes.xl};
    }
    
    h3 {
      font-size: ${props => props.theme.typography.fontSizes.lg};
    }
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobileL}) {
    html {
      font-size: 14px;
    }
    
    .container {
      padding: 0 ${props => props.theme.spacing.sm};
    }
    
    .card {
      padding: ${props => props.theme.spacing.md};
    }
  }
`;