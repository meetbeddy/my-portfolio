import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Code, ExternalLink, Github, Layers, Wrench, Star, ArrowUpRight, UserRoundCheck, CircleCheckBig } from "lucide-react";
import PageLayout from "../../layouts/PageLayout";
import { StyledButton } from "../../shared/StyledComponents";
import styled from "styled-components";

const ProjectsIntro = styled.div`
  max-width: 720px;
  margin-bottom: ${props => props.theme.spacing.xl};

  p {
    color: ${props => props.theme.colors.textSecondary};
    line-height: 1.7;
  }
`;

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
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
  border: 1px solid ${props => props.theme.colors.surfaceLight};
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const ProjectImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  aspect-ratio: 3 / 2;
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
`;

const ProjectMeta = styled.p`
  color: ${props => props.theme.colors.primaryLight};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  margin-bottom: ${props => props.theme.spacing.sm};
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

const DetailsButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  border: 0;
  background: none;
  color: ${props => props.theme.colors.text};
  font: inherit;
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  cursor: pointer;
  padding: ${props => props.theme.spacing.xs} 0;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
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

const DetailSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const CaseStudyMeta = styled.dl`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin: ${props => props.theme.spacing.lg} 0;
  padding: ${props => props.theme.spacing.md} 0;
  border-top: 1px solid ${props => props.theme.colors.surfaceLight};
  border-bottom: 1px solid ${props => props.theme.colors.surfaceLight};

  div {
    min-width: 0;
  }

  dt {
    margin-bottom: ${props => props.theme.spacing.xs};
    color: ${props => props.theme.colors.textMuted};
    font-size: ${props => props.theme.typography.fontSizes.sm};
  }

  dd {
    margin: 0;
    color: ${props => props.theme.colors.text};
    font-weight: ${props => props.theme.typography.fontWeight.medium};
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const EvidenceNote = styled.p`
  margin: ${props => props.theme.spacing.md} 0 0;
  padding: ${props => props.theme.spacing.md};
  border-left: 3px solid ${props => props.theme.colors.accent};
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
`;

const FigureCaption = styled.p`
  margin: -${props => props.theme.spacing.sm} 0 ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.textMuted};
  font-size: ${props => props.theme.typography.fontSizes.sm};
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
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-left: 2px solid ${props => props.theme.colors.surfaceLight};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
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

// Project data â€” real projects from CV
const projects = [
  {
    id: 'asteroid-field',
    title: 'Asteroid Field',
    description: 'A browser arcade game built as an interactive engineering piece for this portfolio. It combines a real-time Three.js scene with adaptive spawning, distinct enemy AI, sector upgrades, boss phases, procedural audio, persistent difficulty records, and responsive pointer, keyboard, and touch input.',
    shortDescription: 'Three.js arcade game with adaptive combat, enemy AI, and procedural audio',
    thumbnail: '/image/projects/asteroid-field-cover.webp',
    featured: true,
    status: 'completed',
    category: 'other',
    technologies: ['React', 'Three.js', 'Web Audio API', 'Styled Components'],
    role: 'Game Developer',
    duration: 'Iterative build',
    year: '2026',
    engagement: 'Portfolio build',
    access: 'Live demo and source available',
    evidenceNote: 'This build is playable in the portfolio, and its implementation is included in the linked repository.',
    demoLink: '/play',
    githubLink: 'https://github.com/meetbeddy/my-portfolio',
    carouselImages: ['/image/projects/asteroid-field-cover.webp'],
    contribution: [
      'Designed and implemented the game loop, combat systems, progression, and interface',
      'Separated frame-critical Three.js state from React-rendered application state',
      'Built keyboard, pointer, and touch controls plus persistent audio and difficulty settings'
    ],
    outcomes: [
      'A complete browser game that can be evaluated directly from this portfolio',
      'One shared combat model across desktop and mobile input methods',
      'Data-driven enemies, upgrades, bosses, and difficulty settings that can be tuned independently'
    ],
    challenges: [
      'Keeping a real-time Three.js simulation responsive inside a React application',
      'Making keyboard, pointer, and touch input feel consistent without resetting run state',
      'Balancing escalating enemy behavior, boss patterns, heat, upgrades, and difficulty modes'
    ],
    solutions: [
      'Separated frame-critical mutable state from React-rendered interface state',
      'Built dedicated input paths that feed one shared movement and firing model',
      'Used data-driven enemy, upgrade, and difficulty definitions for predictable tuning'
    ],
    keyFeatures: [
      'Three.js rendering with custom collision and particle systems',
      'Weaving, tracking, splitting, predictive, and orbiting enemy behaviors',
      'Sector upgrade drafts and multi-phase telegraphed bosses',
      'Procedural Web Audio soundtrack and sound effects',
      'Independent difficulty records and persistent player settings',
      'Responsive keyboard, pointer, and dedicated mobile controls'
    ]
  },
  {
    id: 'coop-platform',
    title: 'Cooperative Society Platform',
    description: 'A comprehensive platform for cooperative society management, enabling members to create accounts, perform cooperative tasks, request loans, view balances and transaction histories, and utilise a mini marketplace for item selection and checkout.',
    shortDescription: 'Full-stack cooperative management system with marketplace and loan features',
    thumbnail: '/image/projects/cooperative-platform-cover.webp',
    featured: true,
    status: 'completed',
    category: 'web',
    technologies: ['ReactJS', 'Redux Toolkit', 'ExpressJS', 'MongoDB'],
    role: 'Full-Stack Developer',
    duration: '4 months',
    year: '2023',
    engagement: 'Product delivery',
    access: 'Private implementation',
    evidenceNote: 'The client implementation and repository are private. This case study documents my role and the delivered workflow at a high level.',
    demoLink: null,
    githubLink: null,
    carouselImages: ['/image/projects/cooperative-platform-cover.webp'],
    contribution: [
      'Implemented member and administrator experiences across the React and Express stack',
      'Modelled account, loan, transaction, and marketplace state in MongoDB',
      'Connected authentication, account activity, and checkout into one product workflow'
    ],
    outcomes: [
      'Consolidated common cooperative tasks into a single member-facing platform',
      'Delivered loan requests, balance history, and marketplace checkout as connected flows',
      'Created reusable state and API patterns for both member and administrative features'
    ],
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
    thumbnail: '/image/projects/ican-election-cover.webp',
    featured: true,
    status: 'completed',
    category: 'web',
    technologies: ['React', 'TypeScript', 'Redux Toolkit', 'ExpressJS', 'MongoDB'],
    role: 'Full-Stack Developer',
    duration: '3 months',
    year: '2023',
    engagement: 'Product delivery',
    access: 'Private implementation',
    evidenceNote: 'Election data, member access, and source code are private. A walkthrough can be discussed without exposing voter or client information.',
    demoLink: null,
    githubLink: null,
    carouselImages: ['/image/projects/ican-election-cover.webp'],
    contribution: [
      'Built authenticated voting and election administration flows across the frontend and API',
      'Implemented duplicate-vote prevention, aggregate result updates, and action logging',
      'Applied TypeScript contracts across client state and server responses'
    ],
    outcomes: [
      'Enabled authenticated members to complete a ballot through one controlled workflow',
      'Provided administrators with election setup, account controls, results, and audit history',
      'Kept individual vote handling separate from aggregate result presentation'
    ],
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
    thumbnail: '/image/projects/fenix-vms-cover.webp',
    featured: true,
    status: 'completed',
    category: 'web',
    technologies: ['Angular', 'NestJS'],
    role: 'Full-Stack Developer',
    duration: '6 months',
    year: '2024',
    engagement: 'Professional product work',
    access: 'Private implementation',
    evidenceNote: 'The production system and repository are private. The case study names only the workflows and engineering responsibilities that can be shared publicly.',
    demoLink: null,
    githubLink: null,
    carouselImages: ['/image/projects/fenix-vms-cover.webp'],
    contribution: [
      'Implemented Angular workflows and NestJS services for core vehicle operations',
      'Worked across registration, renewal, ownership change, revalidation, and direct levy modules',
      'Applied tenant-aware authorization and validation to shared application flows'
    ],
    outcomes: [
      'Brought multiple vehicle licensing operations into one consistent staff workflow',
      'Created shared frontend and API patterns for tenant-specific vehicle services',
      'Reduced duplication between registration-related forms and backend validation paths'
    ],
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
    thumbnail: '/image/projects/texflow-cover.webp',
    featured: true,
    status: 'completed',
    category: 'web',
    technologies: ['React', 'WebGL', 'Vite', 'GLSL'],
    role: 'Frontend Developer',
    duration: '2 months',
    year: '2024',
    engagement: 'Independent product build',
    access: 'Walkthrough available on request',
    evidenceNote: 'The public portfolio presents an editorial cover rather than a fabricated UI screenshot. A product walkthrough can be discussed on request.',
    demoLink: null,
    githubLink: null,
    carouselImages: ['/image/projects/texflow-cover.webp'],
    contribution: [
      'Designed the shader-driven texture pipeline and its React control surface',
      'Connected live parameter updates to GPU rendering without rebuilding the scene',
      'Implemented repeatable texture generation and browser-side export flows'
    ],
    outcomes: [
      'Made procedural texture changes visible immediately as controls are adjusted',
      'Kept rendering work on the GPU while React managed product state and controls',
      'Supported seamless output suitable for repeating web and design surfaces'
    ],
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
    thumbnail: '/image/projects/multi-mda-cover.webp',
    featured: true,
    status: 'completed',
    category: 'web',
    technologies: ['React', 'TypeScript', 'NestJS', 'MongoDB', 'Tailwind'],
    role: 'Full-Stack Architect',
    duration: '8 months',
    year: '2024',
    engagement: 'Professional product work',
    access: 'Private implementation',
    evidenceNote: 'Agency data, production access, and source code are private. Architecture details are intentionally limited to publicly shareable responsibilities.',
    demoLink: null,
    githubLink: null,
    carouselImages: ['/image/projects/multi-mda-cover.webp'],
    contribution: [
      'Defined modular NestJS boundaries for agency-specific domains and shared services',
      'Designed tenant-aware access patterns for staff, taxpayer, and revenue workflows',
      'Structured the React application so agency modules could remain operationally distinct'
    ],
    outcomes: [
      'Established one platform structure for multiple agency workflows without merging their data contexts',
      'Created reusable authorization and reporting foundations across agency modules',
      'Reduced coupling by keeping domain logic inside independently owned backend modules'
    ],
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
    thumbnail: '/image/projects/farmconnect-cover.webp',
    featured: true,
    status: 'completed',
    category: 'mobile',
    technologies: ['React Native', 'Expo', 'Redux', 'Socket.io'],
    role: 'Mobile Developer',
    duration: '3 months',
    year: '2024',
    engagement: 'Mobile product build',
    access: 'Walkthrough available on request',
    evidenceNote: 'The app build and repository are not public. The case study describes the cross-platform and connectivity work without presenting a fabricated product screenshot.',
    demoLink: null,
    githubLink: null,
    carouselImages: ['/image/projects/farmconnect-cover.webp'],
    contribution: [
      'Implemented the Expo application structure and shared state for farmer and buyer journeys',
      'Integrated location-aware discovery, cached data access, and real-time messaging',
      'Tuned mobile rendering and network behavior for less capable devices and unreliable connections'
    ],
    outcomes: [
      'Delivered one React Native codebase for both iOS and Android product flows',
      'Allowed core marketplace data to remain useful during intermittent connectivity',
      'Connected discovery, messaging, and location into one mobile journey'
    ],
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
                  alt={`${project.title} editorial project cover ${currentSlide + 1}`}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </CarouselSlide>
            </AnimatePresence>
            {project.carouselImages.length > 1 && (
              <CarouselNav>
                {project.carouselImages.map((_, index) => (
                  <CarouselDot
                    key={index}
                    active={currentSlide === index}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </CarouselNav>
            )}
          </ProjectCarousel>
          <FigureCaption>Editorial project cover, not a product screenshot.</FigureCaption>

          {/* Project overview */}
          <DetailSection>
            <DetailTitle>
              <Layers size={20} /> Overview
            </DetailTitle>
            <p>{project.description}</p>

            <CaseStudyMeta>
              <div><dt>Role</dt><dd>{project.role}</dd></div>
              <div><dt>Timeline</dt><dd>{project.duration}</dd></div>
              <div><dt>Year</dt><dd>{project.year}</dd></div>
              <div><dt>Engagement</dt><dd>{project.engagement}</dd></div>
            </CaseStudyMeta>

            <EvidenceNote><strong>Access:</strong> {project.access}. {project.evidenceNote}</EvidenceNote>

            <div style={{ margin: '16px 0' }}>
              <h4 style={{ marginBottom: '8px', fontSize: '1rem' }}>Technologies used:</h4>
              <TagContainer>
                {project.technologies.map((tech, index) => (
                  <TechTag key={index}><Code size={14} style={{ marginRight: '4px' }} />{tech}</TechTag>
                ))}
              </TagContainer>
            </div>
          </DetailSection>

          <DetailSection>
            <DetailGrid>
              <DetailCard>
                <DetailTitle>
                  <UserRoundCheck size={20} /> My contribution
                </DetailTitle>
                <ul>
                  {project.contribution.map(item => <li key={item}>{item}</li>)}
                </ul>
              </DetailCard>
              <DetailCard>
                <DetailTitle>
                  <CircleCheckBig size={20} /> Outcome
                </DetailTitle>
                <ul>
                  {project.outcomes.map(item => <li key={item}>{item}</li>)}
                </ul>
              </DetailCard>
            </DetailGrid>
          </DetailSection>

          {/* Key Features */}
          <DetailSection>
            <DetailTitle>
              <Star size={20} /> Delivered scope
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
              <Wrench size={20} /> Constraints & Engineering decisions
            </DetailTitle>
            <DetailGrid>
              <DetailCard>
                <h4>Constraints</h4>
                <ul>
                  {project.challenges.map((challenge, index) => (
                    <li key={index}>{challenge}</li>
                  ))}
                </ul>
              </DetailCard>
              <DetailCard>
                <h4>Decisions</h4>
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
            <StyledButton as={Link} to="/contact" secondary>
              Discuss this project
            </StyledButton>
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
  const [selectedProject, setSelectedProject] = useState(null);

  const closeModal = () => {
    setSelectedProject(null);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06
      }
    }
  };

  return (
    <PageLayout title="Projects" subtitle="Product systems, platforms, and interactive work">
      <ProjectsIntro>
        <p>
          A focused selection of production systems and interactive experiments. Open any project
          for its context, constraints, and implementation decisions.
        </p>
      </ProjectsIntro>

      <ProjectsGrid variants={containerVariants} initial="hidden" animate="visible">
        {projects.map(project => (
          <ProjectCard
            key={project.id}
            variants={cardVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <ProjectImageContainer>
              <ProjectImage style={{ backgroundImage: `url(${project.thumbnail})` }} />
            </ProjectImageContainer>

            <ProjectContent>
              <ProjectMeta>{project.role} / {project.year}</ProjectMeta>
              <ProjectTitle>{project.title}</ProjectTitle>
              <ProjectDescription>{project.shortDescription}</ProjectDescription>
              <TagContainer>
                {project.technologies.slice(0, 3).map(tech => (
                  <TechTag key={tech}>{tech}</TechTag>
                ))}
                {project.technologies.length > 3 && (
                  <TechTag>+{project.technologies.length - 3}</TechTag>
                )}
              </TagContainer>
            </ProjectContent>

            <ProjectFooter>
              <DetailsButton type="button" onClick={() => setSelectedProject(project)}>
                View details
                <ArrowUpRight size={16} />
              </DetailsButton>
              <ButtonGroup>
                {project.demoLink && (
                  <IconButton
                    href={project.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${project.title}`}
                    title="Open live project"
                  >
                    <ExternalLink size={18} />
                  </IconButton>
                )}
                {project.githubLink && (
                  <IconButton
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${project.title} source code`}
                    title="View source code"
                  >
                    <Github size={18} />
                  </IconButton>
                )}
              </ButtonGroup>
            </ProjectFooter>
          </ProjectCard>
        ))}
      </ProjectsGrid>

      <AnimatePresence>
        {selectedProject && (
          <ProjectDetails project={selectedProject} onClose={closeModal} />
        )}
      </AnimatePresence>
    </PageLayout>
  );
};

export default Projects;
