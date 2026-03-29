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
  transition: box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  perspective: 1000px;
  will-change: transform;
  
  &:hover {
    box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(224, 72, 72, 0.2);
    z-index: 10;
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

// Project data â€” real projects from CV
const projects = [
  {
    id: 'coop-platform',
    title: 'Cooperative Society Platform',
    description: 'A comprehensive platform for cooperative society management, enabling members to create accounts, perform cooperative tasks, request loans, view balances and transaction histories, and utilise a mini marketplace for item selection and checkout.',
    shortDescription: 'Full-stack cooperative management system with marketplace and loan features',
    thumbnail: '/C:/Users/meetb/.gemini/antigravity/brain/83cc10bd-6b12-4a4f-980d-6c79550b5786/coop_platform_screenshot_1774551457023.png',
    featured: true,
    status: 'completed',
    category: 'web',
    technologies: ['ReactJS', 'Redux Toolkit', 'ExpressJS', 'MongoDB'],
    role: 'Full-Stack Developer',
    duration: '4 months',
    year: '2023',
    demoLink: null,
    githubLink: 'https://github.com/meetbeddy',
    carouselImages: ['/C:/Users/meetb/.gemini/antigravity/brain/83cc10bd-6b12-4a4f-980d-6c79550b5786/coop_platform_screenshot_1774551457023.png'],
    challenges: [
      'Designing a secure multi-role auth system for members and administrators',
      'Building real-time balance and transaction tracking across accounts',
      'Integrating a functional marketplace within the cooperative context'
    ],
    solutions: [
      'JWT-based authentication with role-based access control',
      'Efficient MongoDB schemas with proper indexing for transactional data',
      'Shopping cart and checkout flow integrated with cooperative account system'
    ],
    keyFeatures: [
      'Secure user authentication and authorisation',
      'Loan request and approval workflow',
      'Balance inquiry and transaction history',
      'Mini marketplace with cart and checkout',
      'Redux Toolkit for efficient state management',
      'Responsive design across all devices'
    ]
  },
  {
    id: 'ican-election',
    title: 'ICAN Election System',
    description: 'A secure election platform for an ICAN body, enabling authenticated members to cast votes with real-time results, audit logs, election management, and user management. Demo available on request.',
    shortDescription: 'Secure real-time election system with admin panel and audit trails',
    thumbnail: '/C:/Users/meetb/.gemini/antigravity/brain/83cc10bd-6b12-4a4f-980d-6c79550b5786/ican_election_screenshot_1774551476879.png',
    featured: true,
    status: 'completed',
    category: 'web',
    technologies: ['React', 'TypeScript', 'Redux Toolkit', 'ExpressJS', 'MongoDB'],
    role: 'Full-Stack Developer',
    duration: '3 months',
    year: '2023',
    demoLink: null,
    githubLink: 'https://github.com/meetbeddy',
    carouselImages: ['/C:/Users/meetb/.gemini/antigravity/brain/83cc10bd-6b12-4a4f-980d-6c79550b5786/ican_election_screenshot_1774551476879.png'],
    challenges: [
      'Guaranteeing election integrity and preventing duplicate votes',
      'Displaying real-time results without compromising vote privacy',
      'Building a comprehensive audit trail for regulatory compliance'
    ],
    solutions: [
      'Robust authentication with one-vote-per-member enforcement',
      'WebSocket-based real-time updates with aggregated result display',
      'Full audit logging system tracking every election-related action'
    ],
    keyFeatures: [
      'Authenticated member voting system',
      'Real-time election results display',
      'Comprehensive audit log system',
      'Admin panel for election management',
      'User management and account controls',
      'TypeScript throughout for type safety'
    ]
  },
  {
    id: 'fenix-vms',
    title: 'FENIX VMS',
    description: 'A multi-tenant vehicle license registration and renewal system, streamlining vehicle licensing for authorities and owners in Nigeria. Supports registration, renewal, change of ownership, revalidation, and direct levy. Demo available on request.',
    shortDescription: 'Multi-tenant vehicle licensing management system for Nigerian authorities',
    thumbnail: '/C:/Users/meetb/.gemini/antigravity/brain/83cc10bd-6b12-4a4f-980d-6c79550b5786/fenix_vms_screenshot_1774551496424.png',
    featured: true,
    status: 'completed',
    category: 'web',
    technologies: ['Angular', 'NestJS'],
    role: 'Full-Stack Developer',
    duration: '6 months',
    year: '2024',
    demoLink: null,
    githubLink: 'https://github.com/meetbeddy',
    carouselImages: ['/C:/Users/meetb/.gemini/antigravity/brain/83cc10bd-6b12-4a4f-980d-6c79550b5786/fenix_vms_screenshot_1774551496424.png'],
    challenges: [
      'Designing a scalable multi-tenant architecture for multiple licensing authorities',
      'Handling complex ownership transfer and revalidation workflows',
      'Ensuring data security and compliance for a government-grade system'
    ],
    solutions: [
      'Tenant isolation with shared schema and row-level access control',
      'State-machine-based workflow engine for ownership and registration processes',
      'NestJS guards, interceptors, and validation pipes for robust security'
    ],
    keyFeatures: [
      'Multi-tenant architecture for licensing authorities',
      'Vehicle registration and renewal workflows',
      'Change of ownership processing',
      'Revalidation and direct levy functionality',
      'Angular frontend with reactive forms and RxJS',
      'NestJS scalable and maintainable backend'
    ]
  },
  {
    id: 'texflow',
    title: 'TexFlow',
    description: 'A WebGL-powered, React-based playground for generating procedural textures and animated gradients in real time. Built for designers, developers, and the perpetually curious.',
    shortDescription: 'WebGL procedural texture & animated gradient generator',
    thumbnail: null,
    featured: true,
    status: 'completed',
    category: 'web',
    technologies: ['React', 'WebGL', 'Vite', 'GLSL'],
    role: 'Frontend Developer',
    duration: '2 months',
    year: '2024',
    demoLink: null,
    githubLink: 'https://github.com/meetbeddy',
    carouselImages: [],
    challenges: [
      'Implementing real-time WebGL rendering efficiently in the browser',
      'Creating seamless texture noise algorithms (Perlin, Simplex)',
      'Designing an intuitive UI for complex procedural controls'
    ],
    solutions: [
      'Leveraged custom WebGL shaders for GPU-accelerated generation',
      'Implemented advanced math functions for seamless tiling capabilities',
      'Built a reactive interface where sliders update shaders instantly without lag'
    ],
    keyFeatures: [
      'Real-time WebGL rendering engine',
      'Dynamic color blending and gradient mapping',
      'Seamless tiling support for repeating backgrounds',
      'Direct texture export capabilities'
    ]
  },
  {
    id: 'sovereign-engine',
    title: 'Multi-MDA Platform',
    description: 'A high-fidelity, unified staff portal designed to automate public service delivery and revenue governance across multiple government agencies (MDAs) in Imo State.',
    shortDescription: 'Massive enterprise government portal powered by the NestJS Sovereign Engine',
    thumbnail: null,
    featured: true,
    status: 'completed',
    category: 'web',
    technologies: ['React', 'TypeScript', 'NestJS', 'MongoDB', 'Tailwind'],
    role: 'Full-Stack Architect',
    duration: '8 months',
    year: '2024',
    demoLink: null,
    githubLink: 'https://github.com/meetbeddy',
    carouselImages: [],
    challenges: [
      'Ensuring strict data isolation between multiple government agencies',
      'Handling massive scale for taxpayer management and revenue collection',
      'Building a unified frontend that orchestrates multiple disparate agency modules'
    ],
    solutions: [
      'Implemented a strictly modular domain architecture in NestJS (Sovereign Engine)',
      'Designed a multi-tenant schema with robust Role-Based Access Control',
      'Employed independent, isolated routing for agency views on the client'
    ],
    keyFeatures: [
      'Multi-agency data and workflow isolation',
      'Unified taxpayer tracking and management',
      'Advanced orchestration and reporting algorithms',
      'High-security compliance workflows'
    ]
  },
  {
    id: 'farmconnect',
    title: 'FarmConnect',
    description: 'A mobile application connecting farmers directly to consumers and markets. Built to provide a seamless cross-platform experience with geographic awareness.',
    shortDescription: 'Cross-platform React Native mobile app for agricultural networking',
    thumbnail: null,
    featured: true,
    status: 'completed',
    category: 'mobile',
    technologies: ['React Native', 'Expo', 'Redux', 'Socket.io'],
    role: 'Mobile Developer',
    duration: '3 months',
    year: '2024',
    demoLink: null,
    githubLink: 'https://github.com/meetbeddy',
    carouselImages: [],
    challenges: [
      'Ensuring smooth offline capabilities for rural farmers with poor connectivity',
      'Implementing real-time messaging for market negotiations',
      'Handling location-based services efficiently on mobile devices'
    ],
    solutions: [
      'Integrated heavy data caching strategies for offline-first data access',
      'Used Socket.io via custom React hooks for instantaneous communication',
      'Optimised native Maps integration to render efficiently on lower-end devices'
    ],
    keyFeatures: [
      'Cross-platform iOS and Android support via Expo',
      'Real-time chat functionality via WebSockets',
      'Geo-location based market and farm search',
      'Robust offline data usage patterns'
    ]
  }

];

// Work experience â€” real roles from CV
const workExperience = [
  {
    id: 'job1',
    company: 'Compumetrics Solutions Ltd',
    position: 'Full-Stack Developer',
    period: 'Dec 2022 â€“ Present',
    description: 'Collaborating with a team of software developers to conceptualise and execute applications using React, Angular, and TypeScript for enterprise clients.',
    achievements: [
      'Achieved a 20% reduction in page load times through asset optimisation and lazy loading',
      'Redesigned user role system from role-based to granular permission-based, improving security at scale',
      'Contributed to code reviews and best practice adherence, enhancing overall code quality'
    ],
    technologies: ['React', 'Angular', 'TypeScript', 'Node.js', 'Redux']
  },
  {
    id: 'job2',
    company: 'Hero Technology Ltd (EagleApp)',
    position: 'Full-Stack Developer',
    period: 'Aug 2022 â€“ Dec 2022',
    description: 'Led an Agile team in designing and implementing applications in React, Node.js, and Express with a Microservices architecture under the Scrum framework.',
    achievements: [
      'Led microservices-based application design and implementation',
      'Mentored junior developers in software best practices',
      'Participated in code reviews, maintaining high team code quality'
    ],
    technologies: ['React', 'Node.js', 'Express.js', 'Microservices', 'Scrum']
  },
  {
    id: 'job3',
    company: '3reen Ltd',
    position: 'Frontend Developer',
    period: 'Nov 2020 â€“ Mar 2021',
    description: 'Collaborated with designers and developers to build an e-commerce startup store with complex layouts and state management.',
    achievements: [
      'Built complex React layouts with styled-components for an e-commerce startup',
      'Engineered state management with Redux and React hooks',
      'Converted Figma prototypes directly into production-ready code'
    ],
    technologies: ['React', 'styled-components', 'Redux', 'Figma', 'CSS3']
  },
  {
    id: 'job4',
    company: 'Freelance',
    position: 'Web Developer',
    period: 'Aug 2019',
    description: 'Worked independently and in teams to build and optimise websites for clients, improving performance and collaborating with designers and stakeholders.',
    achievements: [
      'Optimised web performance, decreasing page load times for client sites',
      'Developed and maintained multiple client websites',
      'Collaborated with designers, programmers, and clients directly'
    ],
    technologies: ['JavaScript', 'HTML5', 'CSS3', 'React', 'Node.js']
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
          <ModalCloseButton onClick={onClose}>Ã—</ModalCloseButton>
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
              <p style={{ textAlign: 'right', fontWeight: '500' }}>â€” {project.testimonial.author}</p>
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
                  whileHover={{ 
                    scale: 1.02, 
                    rotateY: 8, 
                    rotateX: -5,
                    transition: { duration: 0.3 }
                  }}
                  className="interactive"
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
