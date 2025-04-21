import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, ExternalLink, Github, Calendar, Tag, Layers, Wrench, Star, Box } from "lucide-react";
import PageLayout from "../../layouts/PageLayout";
import { SubTitle, StyledButton, RevealContainer } from "../../shared/StyledComponents";
import styled from "styled-components";

// Styled Components
const FilterButton = styled(motion.button)`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borders.radius.full};
  transition: all 0.3s ease;
  margin: ${props => props.theme.spacing.xs};
  background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.surface};
  color: ${props => props.active ? props.theme.colors.text : props.theme.colors.text};
  border: none;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primaryDark : props.theme.colors.surfaceHover};
  }
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.sm};
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const ProjectCard = styled(motion.div)`
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borders.radius.lg};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.sm};
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.md};
    transform: translateY(-5px);
  }
`;

const ProjectImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  height: 180px;
  background-color: ${props => props.bgColor || props.theme.colors.surfaceDark};
`;

const ProjectImage = styled.div`
  width: 100%;
  height: 100%;
  background-position: center;
  background-size: cover;
  transition: transform 0.5s ease;
  
  ${ProjectCard}:hover & {
    transform: scale(1.05);
  }
`;

const ProjectImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7));
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: ${props => props.theme.spacing.md};
`;

const ProjectContent = styled.div`
  padding: ${props => props.theme.spacing.md};
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const ProjectTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  margin-bottom: ${props => props.theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
`;

const ProjectDescription = styled.p`
  margin-bottom: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.typography.fontSizes.md};
  flex-grow: 1;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.xs};
  margin-top: ${props => props.theme.spacing.sm};
`;

const TechTag = styled.span`
  display: inline-flex;
  align-items: center;
  background-color: ${props => props.theme.colors.surfaceDark};
  color: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borders.radius.md};
  font-size: ${props => props.theme.typography.fontSizes.sm};
`;

const ProjectFooter = styled.div`
  padding: ${props => props.theme.spacing.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid ${props => props.theme.colors.surfaceLight};
`;

const IconButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: ${props => props.theme.borders.radius.full};
  background-color: ${props => props.theme.colors.surfaceLight};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`;

const StatusBadge = styled.span`
  position: absolute;
  top: ${props => props.theme.spacing.sm};
  right: ${props => props.theme.spacing.sm};
  background-color: ${props =>
    props.status === 'completed' ? 'rgba(46, 204, 113, 0.9)' :
      props.status === 'in-progress' ? 'rgba(241, 196, 15, 0.9)' :
        'rgba(52, 152, 219, 0.9)'
  };
  color: white;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borders.radius.full};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  z-index: 2;
`;

const FeaturedFlag = styled.div`
  position: absolute;
  top: ${props => props.theme.spacing.sm};
  left: ${props => props.theme.spacing.sm};
  background-color: rgba(255, 87, 51, 0.9);
  color: white;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borders.radius.full};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  z-index: 2;
`;

const DetailSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const DetailTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  margin-bottom: ${props => props.theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.md};
`;

const DetailCard = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borders.radius.md};
  padding: ${props => props.theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const BackButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  margin-bottom: ${props => props.theme.spacing.md};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  padding: ${props => props.theme.spacing.sm} 0;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xl};
  text-align: center;
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  padding: ${props => props.theme.spacing.lg};
  overflow-y: auto;
`;

const ModalContent = styled(motion.div)`
  background-color: ${props => props.theme.colors.surfaceDark};
  border-radius: ${props => props.theme.borders.radius.lg};
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: ${props => props.theme.shadows.lg};
`;

const ModalHeader = styled.div`
  position: sticky;
  top: 0;
  background-color: ${props => props.theme.colors.surfaceDark};
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.surfaceLight};
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 5;
`;

const ModalBody = styled.div`
  padding: ${props => props.theme.spacing.lg};
`;

const ModalCloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  font-size: ${props => props.theme.typography.fontSizes.xl};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const ProjectCarousel = styled.div`
  margin: ${props => props.theme.spacing.lg} 0;
  position: relative;
  height: 400px;
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borders.radius.lg};
  overflow: hidden;
`;

const CarouselSlide = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.colors.surfaceDark};
`;

const CarouselNav = styled.div`
  position: absolute;
  bottom: ${props => props.theme.spacing.md};
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  z-index: 2;
`;

const CarouselDot = styled.button`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.active ? props.theme.colors.primary : 'rgba(255, 255, 255, 0.3)'};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primary : 'rgba(255, 255, 255, 0.5)'};
  }
`;

const WorkTimeline = styled.div`
  position: relative;
  padding-left: ${props => props.theme.spacing.xl};
  margin-top: ${props => props.theme.spacing.xl};
  
  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: ${props => props.theme.colors.surfaceLight};
  }
`;

const TimelineItem = styled.div`
  position: relative;
  padding-bottom: ${props => props.theme.spacing.xl};
  
  &:last-child {
    padding-bottom: 0;
  }
  
  &:before {
    content: "";
    position: absolute;
    left: -${props => props.theme.spacing.xl};
    top: 0;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background-color: ${props => props.theme.colors.primary};
    transform: translateX(-0.25rem);
  }
`;

const TimelineContent = styled(motion.div)`
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borders.radius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.sm};
`;

const TimelineHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const TimelineDate = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.primaryLight};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
`;

// Project data
const projects = [
  {
    id: 'ecommerce',
    title: 'E-commerce Platform',
    description: 'A full-featured e-commerce platform with product management, cart functionality, and secure checkout process.',
    shortDescription: 'Full-stack e-commerce solution with seamless user experience',
    thumbnail: '/api/placeholder/500/300',
    featured: true,
    status: 'completed',
    category: 'web',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API', 'Redux'],
    role: 'Lead Developer',
    duration: '4 months',
    year: '2023',
    demoLink: 'https://example.com/ecommerce',
    githubLink: 'https://github.com/example/ecommerce',
    carouselImages: [
      '/api/placeholder/900/500',
      '/api/placeholder/900/500',
      '/api/placeholder/900/500'
    ],
    challenges: [
      'Implementing real-time inventory updates across multiple users',
      'Optimizing complex product filtering and search',
      'Building a secure and compliant payment processing flow'
    ],
    solutions: [
      'Used WebSocket for real-time data synchronization',
      'Implemented server-side filtering with efficient indexing',
      'Integrated Stripe with robust error handling and security measures'
    ],
    testimonial: {
      quote: "This platform transformed our online business with its intuitive design and robust features.",
      author: "Client Name, CEO"
    },
    keyFeatures: [
      'Advanced product filtering and search',
      'Real-time inventory management',
      'Secure payment processing',
      'User account management with order history',
      'Admin dashboard with analytics'
    ]
  },
  {
    id: 'cms',
    title: 'Content Management System',
    description: 'A custom CMS tailored for media companies to manage articles, multimedia content, and user subscriptions.',
    shortDescription: 'Specialized CMS for digital media companies',
    thumbnail: '/api/placeholder/500/300',
    featured: false,
    status: 'completed',
    category: 'web',
    technologies: ['React', 'GraphQL', 'PostgreSQL', 'AWS', 'TypeScript'],
    role: 'Frontend Lead',
    duration: '6 months',
    year: '2022',
    demoLink: 'https://example.com/cms',
    githubLink: 'https://github.com/example/cms',
    carouselImages: [
      '/api/placeholder/900/500',
      '/api/placeholder/900/500'
    ],
    challenges: [
      'Creating an intuitive editor for non-technical content creators',
      'Handling complex content relationships and permissions',
      'Ensuring fast loading times for media-heavy content'
    ],
    solutions: [
      'Built a customizable WYSIWYG editor with markdown support',
      'Implemented a flexible role-based access control system',
      'Utilized AWS CloudFront CDN with optimized asset processing'
    ],
    keyFeatures: [
      'Rich text editor with multimedia support',
      'Content scheduling and workflow management',
      'Custom field types and templates',
      'Analytics dashboard',
      'Multi-user collaboration tools'
    ]
  },
  {
    id: 'user-api',
    title: 'User Management API',
    description: 'A comprehensive API for user authentication, authorization, and profile management with extensive documentation.',
    shortDescription: 'Robust user authentication and management system',
    thumbnail: '/api/placeholder/500/300',
    featured: false,
    status: 'completed',
    category: 'backend',
    technologies: ['Node.js', 'Express', 'JWT', 'MongoDB', 'Swagger'],
    role: 'Backend Developer',
    duration: '3 months',
    year: '2022',
    demoLink: null,
    githubLink: 'https://github.com/example/user-api',
    carouselImages: [
      '/api/placeholder/900/500'
    ],
    challenges: [
      'Implementing secure authentication with multiple providers',
      'Designing a scalable and flexible permission system',
      'Creating comprehensive yet maintainable documentation'
    ],
    solutions: [
      'Used OAuth 2.0 with JWT for secure authentication flow',
      'Designed hierarchical role-based access control',
      'Generated interactive API documentation with Swagger'
    ],
    keyFeatures: [
      'Multi-factor authentication',
      'Role-based access control',
      'Social login integration',
      'Password recovery flows',
      'Rate limiting and security features'
    ]
  },
  {
    id: 'payment',
    title: 'Payment Processing Service',
    description: 'A microservice handling payment processing, subscriptions, and financial reporting for SaaS applications.',
    shortDescription: 'Secure payment processing microservice',
    thumbnail: '/api/placeholder/500/300',
    featured: false,
    status: 'completed',
    category: 'backend',
    technologies: ['Node.js', 'NestJS', 'PostgreSQL', 'RabbitMQ', 'Stripe API'],
    role: 'Full Stack Developer',
    duration: '4 months',
    year: '2023',
    demoLink: null,
    githubLink: 'https://github.com/example/payment-service',
    carouselImages: [
      '/api/placeholder/900/500'
    ],
    challenges: [
      'Ensuring payment security and PCI compliance',
      'Handling payment failures and retry mechanisms',
      'Building comprehensive financial reporting'
    ],
    solutions: [
      'Implemented tokenization and encryption for sensitive data',
      'Created a robust state machine for payment lifecycle',
      'Designed flexible reporting system with data export options'
    ],
    keyFeatures: [
      'Multiple payment method support',
      'Subscription management',
      'Automatic invoicing',
      'Financial reporting',
      'Webhook integrations'
    ]
  },
  {
    id: 'content-api',
    title: 'Content Delivery API',
    description: 'A high-performance API for delivering content across multiple platforms with caching and CDN integration.',
    shortDescription: 'Scalable content delivery for multi-platform applications',
    thumbnail: '/api/placeholder/500/300',
    featured: false,
    status: 'in-progress',
    category: 'backend',
    technologies: ['NestJS', 'TypeScript', 'Redis', 'AWS', 'Docker'],
    role: 'Backend Developer',
    duration: 'Ongoing',
    year: '2024',
    demoLink: null,
    githubLink: 'https://github.com/example/content-api',
    carouselImages: [
      '/api/placeholder/900/500'
    ],
    challenges: [
      'Optimizing content delivery for different devices and connections',
      'Implementing efficient caching strategies',
      'Ensuring high availability under varying loads'
    ],
    solutions: [
      'Created dynamic content transformation pipelines',
      'Implemented multi-level caching with invalidation strategies',
      'Designed auto-scaling infrastructure with containerization'
    ],
    keyFeatures: [
      'Content transformation and optimization',
      'Multi-region deployment',
      'Intelligent caching',
      'Real-time analytics',
      'Bandwidth optimization'
    ]
  },
  {
    id: 'design-system',
    title: 'Design System',
    description: 'A comprehensive design system with reusable components, documentation, and integration with popular frameworks.',
    shortDescription: 'Unified design system for consistent user experiences',
    thumbnail: '/api/placeholder/500/300',
    featured: true,
    status: 'completed',
    category: 'ui',
    technologies: ['React', 'Storybook', 'Styled Components', 'TypeScript', 'Figma'],
    role: 'UI Developer',
    duration: '5 months',
    year: '2023',
    demoLink: 'https://example.com/design-system',
    githubLink: 'https://github.com/example/design-system',
    carouselImages: [
      '/api/placeholder/900/500',
      '/api/placeholder/900/500',
      '/api/placeholder/900/500'
    ],
    challenges: [
      'Creating components flexible enough for diverse applications',
      'Maintaining consistency across different platforms',
      'Balancing customization options with design coherence'
    ],
    solutions: [
      'Built a theme-based architecture with robust component APIs',
      'Created unified design tokens and styling principles',
      'Implemented comprehensive documentation and usage examples'
    ],
    keyFeatures: [
      'Comprehensive component library',
      'Theme customization',
      'Accessibility compliance',
      'Interactive documentation',
      'Design token management'
    ]
  },
  {
    id: 'search-opt',
    title: 'E-commerce Search Optimization',
    description: 'Enhanced search functionality for e-commerce platforms with advanced filtering, product recommendations, and analytics.',
    shortDescription: 'Intelligent search system for improved product discovery',
    thumbnail: '/api/placeholder/500/300',
    featured: false,
    status: 'completed',
    category: 'other',
    technologies: ['Elasticsearch', 'Node.js', 'React', 'Analytics API', 'Machine Learning'],
    role: 'Search Specialist',
    duration: '3 months',
    year: '2022',
    demoLink: null,
    githubLink: 'https://github.com/example/search-optimization',
    carouselImages: [
      '/api/placeholder/900/500'
    ],
    challenges: [
      'Improving search relevance for diverse product catalogs',
      'Handling typos and language variations effectively',
      'Balancing performance with feature richness'
    ],
    solutions: [
      'Implemented learning-to-rank algorithms with user feedback',
      'Created fuzzy matching with language-specific configurations',
      'Optimized index structures and query patterns'
    ],
    keyFeatures: [
      'Intelligent typo correction',
      'Personalized search results',
      'Advanced filtering capabilities',
      'Search analytics dashboard',
      'Automated relevance tuning'
    ]
  },
  {
    id: 'realtime',
    title: 'Real-time Data Processing',
    description: 'A system for processing and visualizing real-time data from IoT devices with analytics and alerting capabilities.',
    shortDescription: 'IoT data processing and visualization platform',
    thumbnail: '/api/placeholder/500/300',
    featured: false,
    status: 'concept',
    category: 'other',
    technologies: ['Kafka', 'Node.js', 'WebSockets', 'Time-Series DB', 'D3.js'],
    role: 'System Architect',
    duration: 'Concept',
    year: '2024',
    demoLink: null,
    githubLink: null,
    carouselImages: [
      '/api/placeholder/900/500'
    ],
    challenges: [
      'Processing high-volume data streams in real-time',
      'Creating meaningful visualizations for complex data',
      'Designing an efficient time-series storage solution'
    ],
    solutions: [
      'Implemented stream processing with windowing techniques',
      'Created configurable visualization components',
      'Optimized data storage with downsampling strategies'
    ],
    keyFeatures: [
      'Real-time data ingestion',
      'Interactive dashboards',
      'Anomaly detection',
      'Historical data analysis',
      'Configurable alerts'
    ]
  }
];

// Data for work experience (for timeline view)
const workExperience = [
  {
    id: 'job1',
    company: 'TechCorp Inc.',
    position: 'Senior Frontend Developer',
    period: 'Jan 2022 - Present',
    description: 'Leading frontend development for enterprise SaaS products, implementing modern React architectures and improving performance.',
    achievements: [
      'Redesigned core product UI resulting in 30% improvement in user engagement',
      'Led migration from legacy codebase to modern React architecture',
      'Established frontend testing practices increasing code coverage by 45%'
    ],
    technologies: ['React', 'TypeScript', 'Redux', 'Jest', 'Webpack']
  },
  {
    id: 'job2',
    company: 'WebSolutions Ltd.',
    position: 'Full Stack Developer',
    period: 'Mar 2020 - Dec 2021',
    description: 'Developed comprehensive web applications for clients across e-commerce, fintech, and media industries.',
    achievements: [
      'Built custom e-commerce platform supporting $2M in annual transactions',
      'Implemented CI/CD pipeline reducing deployment time by 70%',
      'Optimized database queries resulting in 50% faster page loads'
    ],
    technologies: ['React', 'Node.js', 'MongoDB', 'Docker', 'AWS']
  },
  {
    id: 'job3',
    company: 'StartupVision',
    position: 'Frontend Developer',
    period: 'Jun 2018 - Feb 2020',
    description: 'Created interactive UIs for early-stage startups, focusing on MVPs and rapid iteration based on user feedback.',
    achievements: [
      'Developed 5+ MVPs for funded startups',
      'Created reusable component library used across multiple projects',
      'Implemented analytics system leading to data-driven UX improvements'
    ],
    technologies: ['JavaScript', 'React', 'CSS/SASS', 'Firebase', 'Analytics APIs']
  }
];

// Component for project details modal
const ProjectDetails = ({ project, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Animation variants
  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <Modal
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClose}
    >
      <ModalContent
        variants={contentVariants}
        onClick={e => e.stopPropagation()}
      >
        <ModalHeader>
          <h2>{project.title}</h2>
          <ModalCloseButton onClick={onClose}>×</ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          {/* Project carousel */}
          <ProjectCarousel>
            <AnimatePresence mode="wait">
              <CarouselSlide
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={project.carouselImages[currentSlide]}
                  alt={`${project.title} screenshot ${currentSlide + 1}`}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </CarouselSlide>
            </AnimatePresence>
            <CarouselNav>
              {project.carouselImages.map((_, index) => (
                <CarouselDot
                  key={index}
                  active={currentSlide === index}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </CarouselNav>
          </ProjectCarousel>

          {/* Project overview */}
          <DetailSection>
            <DetailTitle>
              <Layers size={20} /> Overview
            </DetailTitle>
            <p>{project.description}</p>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              margin: '20px 0'
            }}>
              <TechTag><Tag size={14} style={{ marginRight: '4px' }} />Role: {project.role}</TechTag>
              <TechTag><Calendar size={14} style={{ marginRight: '4px' }} />Duration: {project.duration}</TechTag>
              <TechTag><Calendar size={14} style={{ marginRight: '4px' }} />Year: {project.year}</TechTag>
            </div>

            <div style={{ margin: '16px 0' }}>
              <h4 style={{ marginBottom: '8px', fontSize: '1rem' }}>Technologies used:</h4>
              <TagContainer>
                {project.technologies.map((tech, index) => (
                  <TechTag key={index}><Code size={14} style={{ marginRight: '4px' }} />{tech}</TechTag>
                ))}
              </TagContainer>
            </div>
          </DetailSection>

          {/* Key Features */}
          <DetailSection>
            <DetailTitle>
              <Star size={20} /> Key Features
            </DetailTitle>
            <ul>
              {project.keyFeatures.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </DetailSection>

          {/* Challenges & Solutions */}
          <DetailSection>
            <DetailTitle>
              <Wrench size={20} /> Challenges & Solutions
            </DetailTitle>
            <DetailGrid>
              <DetailCard>
                <h4>Challenges</h4>
                <ul>
                  {project.challenges.map((challenge, index) => (
                    <li key={index}>{challenge}</li>
                  ))}
                </ul>
              </DetailCard>
              <DetailCard>
                <h4>Solutions</h4>
                <ul>
                  {project.solutions.map((solution, index) => (
                    <li key={index}>{solution}</li>
                  ))}
                </ul>
              </DetailCard>
            </DetailGrid>
          </DetailSection>

          {/* Links */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '32px' }}>
            {project.demoLink && (
              <StyledButton as="a" href={project.demoLink} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={18} style={{ marginRight: '8px' }} />
                View Live Demo
              </StyledButton>
            )}
            {project.githubLink && (
              <StyledButton as="a" href={project.githubLink} target="_blank" rel="noopener noreferrer" secondary>
                <Github size={18} style={{ marginRight: '8px' }} />
                View Source Code
              </StyledButton>
            )}
          </div>

          {/* Testimonial */}
          {project.testimonial && (
            <div style={{
              margin: '32px 0',
              padding: '24px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '12px',
              fontStyle: 'italic'
            }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '12px' }}>"{project.testimonial.quote}"</p>
              <p style={{ textAlign: 'right', fontWeight: '500' }}>— {project.testimonial.author}</p>
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

// Main Projects page component
const Projects = () => {
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [view, setView] = useState('grid'); // 'grid' or 'timeline'

  // Filter projects based on selected category
  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    if (filter === 'featured') return project.featured;
    return project.category === filter;
  });

  // Handle project click
  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  // Close project details modal
  const closeModal = () => {
    setSelectedProject(null);
  };

  // Project card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <PageLayout title="Projects" subtitle="Explore my work and projects">
      {/* Filter buttons */}
      <FilterContainer>
        <FilterButton
          active={filter === 'all'}
          onClick={() => setFilter('all')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          All Projects
        </FilterButton>
        <FilterButton
          active={filter === 'featured'}
          onClick={() => setFilter('featured')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Featured
        </FilterButton>
        <FilterButton
          active={filter === 'web'}
          onClick={() => setFilter('web')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Web Apps
        </FilterButton>
        <FilterButton
          active={filter === 'backend'}
          onClick={() => setFilter('backend')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Backend
        </FilterButton>
        <FilterButton
          active={filter === 'ui'}
          onClick={() => setFilter('ui')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          UI/Design
        </FilterButton>
        <FilterButton
          active={filter === 'other'}
          onClick={() => setFilter('other')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Other
        </FilterButton>
      </FilterContainer>

      {/* View toggle */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px',
        gap: '12px'
      }}>
        <FilterButton
          active={view === 'grid'}
          onClick={() => setView('grid')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Project Grid
        </FilterButton>
        <FilterButton
          active={view === 'timeline'}
          onClick={() => setView('timeline')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Work Timeline
        </FilterButton>
      </div>

      {/* Grid View */}
      {view === 'grid' && (
        <>
          {filteredProjects.length > 0 ? (
            <ProjectsGrid
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredProjects.map(project => (
                <ProjectCard
                  key={project.id}
                  onClick={() => handleProjectClick(project)}
                  variants={cardVariants}
                >
                  <ProjectImageContainer>
                    <ProjectImage style={{ backgroundImage: `url(${project.thumbnail})` }} />
                    <ProjectImageOverlay>
                      <ButtonGroup>
                        {project.demoLink && (
                          <IconButton href={project.demoLink} target="_blank" onClick={(e) => e.stopPropagation()}>
                            <ExternalLink size={18} />
                          </IconButton>
                        )}
                        {project.githubLink && (
                          <IconButton href={project.githubLink} target="_blank" onClick={(e) => e.stopPropagation()}>
                            <Github size={18} />
                          </IconButton>
                        )}
                      </ButtonGroup>
                    </ProjectImageOverlay>
                    {project.featured && (
                      <FeaturedFlag>
                        <Star size={14} /> Featured
                      </FeaturedFlag>
                    )}
                    <StatusBadge status={project.status}>
                      {project.status === 'completed' ? 'Completed' :
                        project.status === 'in-progress' ? 'In Progress' : 'Concept'}
                    </StatusBadge>
                  </ProjectImageContainer>
                  <ProjectContent>
                    <ProjectTitle>
                      <Box size={18} style={{ color: '#4d8cfc' }} />
                      {project.title}
                    </ProjectTitle>
                    <ProjectDescription>{project.shortDescription}</ProjectDescription>
                    <TagContainer>
                      {project.technologies.slice(0, 3).map((tech, index) => (
                        <TechTag key={index}>
                          <Code size={14} style={{ marginRight: '4px' }} />
                          {tech}
                        </TechTag>
                      ))}
                      {project.technologies.length > 3 && (
                        <TechTag>+{project.technologies.length - 3}</TechTag>
                      )}
                    </TagContainer>
                  </ProjectContent>
                </ProjectCard>
              ))}
            </ProjectsGrid>
          ) : (
            <EmptyStateContainer>
              <h3>No projects found for this filter</h3>
              <p>Try selecting a different category</p>
            </EmptyStateContainer>
          )}
        </>
      )}

      {/* Timeline View */}
      {view === 'timeline' && (
        <WorkTimeline>
          {workExperience.map((work, index) => (
            <TimelineItem key={work.id}>
              <TimelineContent
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <TimelineHeader>
                  <div>
                    <h3>{work.position}</h3>
                    <h4>{work.company}</h4>
                  </div>
                  <TimelineDate>
                    <Calendar size={16} />
                    {work.period}
                  </TimelineDate>
                </TimelineHeader>
                <p>{work.description}</p>
                <div style={{ marginTop: '16px' }}>
                  <h5 style={{ marginBottom: '8px' }}>Key Achievements:</h5>
                  <ul>
                    {work.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                </div>
                <TagContainer>
                  {work.technologies.map((tech, i) => (
                    <TechTag key={i}>
                      <Code size={14} style={{ marginRight: '4px' }} />
                      {tech}
                    </TechTag>
                  ))}
                </TagContainer>
              </TimelineContent>
            </TimelineItem>
          ))}
        </WorkTimeline>
      )}

      {/* Project details modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetails project={selectedProject} onClose={closeModal} />
        )}
      </AnimatePresence>
    </PageLayout>
  );
};

export default Projects;