import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PageLayout from "../../layouts/PageLayout";
import { PageParagraph, StyledButton, SubTitle, Card, Grid, Badge, RevealContainer } from "../../shared/StyledComponents";
import { Clock, Headphones, Code, Coffee, Volleyball, Globe, CheckCircle, Link } from "lucide-react";
import styled from "styled-components";

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

const TabContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.sm};
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing.xl};
  role: "tablist";
`;

const Section = styled(motion.div)`
  margin-top: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const GradientCard = styled.div`
  background: linear-gradient(to right, ${props => props.theme.colors.primary}, ${props => props.theme.colors.primaryLight});
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borders.radius.lg};
  box-shadow: ${props => props.theme.shadows.md};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const CardTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  margin-bottom: ${props => props.theme.spacing.md};
  display: flex;
  align-items: center;
`;

const TypewriterContainer = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
  word-break: break-word;
  overflow-wrap: break-word;
  line-height: 1.6;
  min-height: 1.6em; /* one line minimum, grows freely with content */
`;

const Cursor = styled.span`
  animation: blink 1s step-end infinite;
  
  @keyframes blink {
    from, to { opacity: 1; }
    50% { opacity: 0; }
  }
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.md};
`;

const InfoCard = styled(motion.div)`
  background-color: ${props => props.color || props.theme.colors.surface};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borders.radius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  transition: ${props => props.theme.animation.durations.medium} ${props => props.theme.animation.easings.easeInOut};
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.md};
    transform: translateY(-5px);
  }
`;

// Enhanced Skill Components
const SkillCard = styled(motion.div)`
  background-color: ${props => props.theme.colors.surface};
  border-left: 4px solid ${props => props.borderColor || props.theme.colors.primary};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borders.radius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  margin-bottom: ${props => props.theme.spacing.md};
  cursor: pointer;
  transition: ${props => props.theme.animation.durations.medium} ${props => props.theme.animation.easings.easeInOut};
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.md};
    transform: translateY(-2px);
  }
`;

const SkillHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.expanded ? props.theme.spacing.md : 0};
`;

const SkillTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const SkillLevelBadge = styled.span`
  background-color: ${props => props.color || props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borders.radius.full};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const SkillBarBackground = styled.div`
  width: 100%;
  background-color: ${props => props.theme.colors.surfaceDark};
  border-radius: ${props => props.theme.borders.radius.full};
  height: 0.5rem;
  position: relative;
  margin: ${props => props.theme.spacing.sm} 0;
`;

const SkillBarFill = styled(motion.div)`
  background: linear-gradient(to right, ${props => props.theme.colors.primary}, ${props => props.theme.colors.primaryLight});
  height: 0.5rem;
  border-radius: ${props => props.theme.borders.radius.full};
`;

const MasteryMarker = styled.div`
  position: absolute;
  top: -4px;
  width: 3px;
  height: 12px;
  background-color: ${props => props.active ? props.theme.colors.text : props.theme.colors.surfaceLight};
  transform: translateX(-50%);
`;

const SkillDetails = styled(motion.div)`
  padding-top: ${props => props.theme.spacing.md};
  border-top: 1px solid ${props => props.theme.colors.surfaceLight};
`;

const ProjectTag = styled.span`
  display: inline-flex;
  align-items: center;
  background-color: ${props => props.theme.colors.surfaceLight};
  color: ${props => props.theme.colors.text};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borders.radius.full};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  margin-right: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const TechBadge = styled.span`
  display: inline-flex;
  align-items: center;
  background-color: ${props => props.theme.colors.surfaceDark};
  color: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borders.radius.md};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  margin-right: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Quote = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-left: 4px solid ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.md};
  font-style: italic;
  margin: ${props => props.theme.spacing.lg} 0;
`;

const Timeline = styled.div`
  position: relative;
  padding-left: ${props => props.theme.spacing.xl};
  
  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: ${props => props.theme.colors.surface};
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

const TimelineTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const InterestCard = styled(motion.div)`
  background: ${props => props.bgColor || props.theme.colors.surface};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borders.radius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  transition: ${props => props.theme.animation.durations.medium} ${props => props.theme.animation.easings.easeInOut};
  
  &:hover {
    transform: translateY(-0.25rem);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const InterestTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  margin-bottom: ${props => props.theme.spacing.sm};
  display: flex;
  align-items: center;
`;

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

const CardGrid = styled(Grid)`
  gap: ${props => props.theme.spacing.lg};
`;

const SectionHeader = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const FactListItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const CoffeeNote = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  font-style: italic;
  margin-top: ${props => props.theme.spacing.sm};
`;

// Master level descriptions for the guide
const masteryLevels = {
  "Beginner": { value: 20, description: "Basic understanding, can work with guidance" },
  "Intermediate": { value: 40, description: "Solid foundation, works independently on standard tasks" },
  "Proficient": { value: 60, description: "Comfortable with most aspects, consistent quality delivery" },
  "Advanced": { value: 80, description: "Deep understanding, can solve complex problems, can mentor others" },
  "Expert": { value: 100, description: "Mastery level, innovative solutions, thought leadership" }
};

export default function About() {
  const [activeSection, setActiveSection] = useState("intro");
  const [expandedSkill, setExpandedSkill] = useState(null);
  const [coffeeCount, setCoffeeCount] = useState(0);
  const [coffeeStrength, setCoffeeStrength] = useState("medium");
  const [brewing, setBrewing] = useState(false);

  const brewCoffee = () => {
    if (brewing) return;
    setBrewing(true);
    setTimeout(() => {
      setCoffeeCount(c => c + 1);
      setBrewing(false);
    }, 1800);
  };
  const [typewriterComplete, setTypewriterComplete] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const introText = "Hey! I'm Obed Okpala — Full-Stack Developer with 4+ years building fast, scalable web apps.";

  // Skills — sourced directly from CV
  const skills = [
    {
      id: "react",
      name: "React",
      level: "Expert",
      years: 4,
      color: "#61DAFB",
      description: "Building complex UIs with React's latest features, state management patterns, and performance optimisation techniques.",
      technologies: ["Hooks", "Context API", "Redux / RTK", "Next.js", "Performance Optimisation"],
      projects: [
        { name: "Cooperative Society Platform", link: "/projects" },
        { name: "ICAN Election System", link: "/projects" }
      ]
    },
    {
      id: "typescript",
      name: "TypeScript",
      level: "Advanced",
      years: 4,
      color: "#3178C6",
      description: "Applying strict typing across full-stack codebases for reliability, refactorability, and developer confidence.",
      technologies: ["Strict mode", "Generics", "Decorators", "Interface design", "Type guards"],
      projects: [
        { name: "ICAN Election System", link: "/projects" },
        { name: "FENIX VMS", link: "/projects" }
      ]
    },
    {
      id: "angular",
      name: "Angular",
      level: "Advanced",
      years: 3,
      color: "#DD0031",
      description: "Enterprise-grade frontends using Angular's component architecture, RxJS observables, and reactive forms.",
      technologies: ["RxJS", "Angular Material", "NgModules", "Reactive Forms", "NgRx"],
      projects: [
        { name: "FENIX VMS", link: "/projects" }
      ]
    },
    {
      id: "nodejs",
      name: "Node.js",
      level: "Advanced",
      years: 3,
      color: "#68A063",
      description: "Robust, scalable backend services and RESTful APIs with a focus on auth, microservices architecture, and performance.",
      technologies: ["Express.js", "RESTful APIs", "JWT / Auth", "Microservices", "WebSockets"],
      projects: [
        { name: "Cooperative Society Platform", link: "/projects" },
        { name: "ICAN Election System", link: "/projects" }
      ]
    },
    {
      id: "nestjs",
      name: "NestJS",
      level: "Proficient",
      years: 2,
      color: "#E0234E",
      description: "Enterprise APIs with TypeScript-first architecture, dependency injection, guards, and modular organisational patterns.",
      technologies: ["TypeORM", "Dependency Injection", "Guards", "Interceptors", "Modules"],
      projects: [
        { name: "FENIX VMS", link: "/projects" }
      ]
    },
    {
      id: "mongodb",
      name: "MongoDB",
      level: "Advanced",
      years: 4,
      color: "#47A248",
      description: "NoSQL schema design, aggregation pipelines, and high-performance data retrieval for production applications.",
      technologies: ["Mongoose", "Schema design", "Aggregation", "Indexes", "CRUD ops"],
      projects: [
        { name: "Cooperative Society Platform", link: "/projects" },
        { name: "ICAN Election System", link: "/projects" }
      ]
    },
    {
      id: "sql",
      name: "SQL / PostgreSQL",
      level: "Proficient",
      years: 3,
      color: "#336791",
      description: "Relational database design and querying with PostgreSQL and MySQL, using TypeORM for ORM-based workflows.",
      technologies: ["PostgreSQL", "MySQL", "TypeORM", "Query optimisation", "Migrations"],
      projects: [
        { name: "Compumetrics Projects", link: "/projects" }
      ]
    }
  ];

  // Store all fun facts
  const allFunFacts = [
    { icon: <Headphones size={24} />, text: "Indie-pop is my coding soundtrack" },
    { icon: <Volleyball size={24} />, text: "Football enthusiast (hustle > bulk)" },
    { icon: <Coffee size={24} />, text: "Powered by coffee" },
    { icon: <Globe size={24} />, text: "Based in Abuja, work anywhere" },
    { icon: <Clock size={24} />, text: "Night owl coder" },
    { icon: <Code size={24} />, text: "I once built a web app in a day just to prove a point" },
    { icon: <Headphones size={24} />, text: "My dev playlists include everything from Bach to Burna Boy" },
    { icon: <Code size={24} />, text: "I believe good documentation is a love language" },
  ];

  // State for randomized fun facts
  const [funFacts, setFunFacts] = useState([]);

  // Initialize fun facts with random selection on mount
  useEffect(() => {
    shuffleFunFacts();
  }, []);

  // Shuffle function for fun facts
  const shuffleFunFacts = () => {
    const shuffled = [...allFunFacts]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    setFunFacts(shuffled);
  };

  // Reset typewriter when changing tabs
  useEffect(() => {
    setDisplayText("");
    setTypewriterComplete(false);
    // Reset expanded skill when changing tabs
    setExpandedSkill(null);
  }, [activeSection]);

  // Typewriter effect that only runs once unless reset
  useEffect(() => {
    if (activeSection === "intro" && !typewriterComplete) {
      if (displayText.length < introText.length) {
        const timeout = setTimeout(() => {
          setDisplayText(prev => introText.slice(0, prev.length + 1));
        }, 50);

        return () => clearTimeout(timeout);
      } else {
        setTypewriterComplete(true);
      }
    }
  }, [displayText, activeSection, typewriterComplete, introText]);

  const toggleExpandSkill = (skillId) => {
    setExpandedSkill(expandedSkill === skillId ? null : skillId);
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const detailsVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } }
  };

  // Interest cards with theme colors
  const interestCardColors = {
    music: "rgba(255, 255, 255, 0.05)",
    football: "rgba(255, 255, 255, 0.08)",
    coffee: "rgba(255, 255, 255, 0.12)"
  };

  return (
    <PageLayout title="About me" maxWidth="900px">
      {/* Interactive tabs with ARIA attributes */}
      <TabContainer role="tablist">
        {["intro", "skills", "story", "interests"].map((section) => (
          <TabButton
            key={section}
            role="tab"
            id={`tab-${section}`}
            aria-selected={activeSection === section}
            aria-controls={`panel-${section}`}
            active={activeSection === section}
            onClick={() => {
              setActiveSection(section);
              if (section === "intro") {
                shuffleFunFacts();
              }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </TabButton>
        ))}
      </TabContainer>

      {/* Intro Section with Typewriter */}
      {activeSection === "intro" && (
        <Section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          role="tabpanel"
          id={`panel-intro`}
          aria-labelledby={`tab-intro`}
        >
          <GradientCard>
            <CardTitle>
              <Code size={24} style={{ marginRight: '10px' }} /> Developer Profile
            </CardTitle>
            <TypewriterContainer>
              {displayText}<Cursor>|</Cursor>
            </TypewriterContainer>
            <p>
              Right now, I'm based in Abuja, Nigeria—but hey, I'm open to working from anywhere.
            </p>
            <TagContainer>
              {["React", "Angular", "TypeScript", "Node.js", "NestJS", "MongoDB", "SQL"].map(tag => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </TagContainer>
          </GradientCard>

          <CardGrid>
            <InfoCard
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <SectionHeader>My Approach</SectionHeader>
              <p>
                I've got a thing for clean code, fast load times, and responsive designs that make you feel
                like you're using something special. At the end of the day, it's all about solving problems.
              </p>
            </InfoCard>

            <InfoCard
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <SectionHeader>Quick Facts</SectionHeader>
              <ul style={{ display: "flex", flexDirection: "column", gap: '10px' }}>
                {funFacts.map((fact, i) => (
                  <FactListItem key={i}>
                    {fact.icon}
                    <span>{fact.text}</span>
                  </FactListItem>
                ))}
              </ul>
            </InfoCard>
          </CardGrid>

          <RevealContainer
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: '40px'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <a
              href="https://drive.google.com/file/d/1GG_Q7PrssF2dtY8D5zc4ThWdwDBXun5H/view?usp=sharing"
              rel="noreferrer"
              target="_blank"
            >
              <StyledButton
                as={motion.a}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Check Out My Resume
              </StyledButton>
            </a>
          </RevealContainer>
        </Section>
      )}

      {/* Enhanced Skills Section */}
      {activeSection === "skills" && (
        <Section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          role="tabpanel"
          id={`panel-skills`}
          aria-labelledby={`tab-skills`}
        >
          <SubTitle style={{
            textAlign: "center",
            marginBottom: '32px'
          }}>Technical Toolkit</SubTitle>

          <div style={{ marginBottom: '32px' }}>
            {skills.map((skill) => (
              <SkillCard
                key={skill.id}
                borderColor={skill.color}
                onClick={() => toggleExpandSkill(skill.id)}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <SkillHeader expanded={expandedSkill === skill.id}>
                  <SkillTitle>
                    {skill.name}
                    <SkillLevelBadge color={`${skill.color}30`} style={{ color: skill.color }}>
                      {skill.level}
                    </SkillLevelBadge>
                  </SkillTitle>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.875rem' }}>{skill.years}+ years</span>
                  </div>
                </SkillHeader>

                <SkillBarBackground>
                  <SkillBarFill
                    initial={{ width: 0 }}
                    animate={{ width: `${masteryLevels[skill.level].value}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                  {/* Mastery level markers */}
                  {Object.entries(masteryLevels).map(([level, { value }]) => (
                    <MasteryMarker
                      key={level}
                      style={{ left: `${value}%` }}
                      active={masteryLevels[skill.level].value >= value}
                    />
                  ))}
                </SkillBarBackground>

                {expandedSkill === skill.id && (
                  <SkillDetails
                    variants={detailsVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <p style={{ marginBottom: '12px' }}>{skill.description}</p>

                    {skill.projects.length > 0 && (
                      <div style={{ marginBottom: '16px' }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>Projects:</h4>
                        <div>
                          {skill.projects.map((project, idx) => (
                            <ProjectTag key={idx}>
                              <Link size={14} style={{ marginRight: '4px' }} />
                              <a href={project.link}>{project.name}</a>
                            </ProjectTag>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>Technologies:</h4>
                      <div>
                        {skill.technologies.map((tech, idx) => (
                          <TechBadge key={idx}>{tech}</TechBadge>
                        ))}
                      </div>
                    </div>
                  </SkillDetails>
                )}
              </SkillCard>
            ))}
          </div>

          {/* Mastery level guide */}
          <Card>
            <h3 style={{ marginBottom: '16px', fontWeight: 600 }}>Mastery Level Guide</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              {Object.entries(masteryLevels).map(([level, { description }]) => (
                <div key={level} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <CheckCircle size={16} style={{ marginTop: '4px', color: level === 'Advanced' || level === 'Expert' ? '#4caf50' : '#9e9e9e' }} />
                  <div>
                    <span style={{ fontWeight: 600 }}>{level}:</span>
                    <p style={{ fontSize: '0.875rem' }}>{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Section>
      )}

      {/* Story Section */}
      {activeSection === "story" && (
        <Section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          role="tabpanel"
          id={`panel-story`}
          aria-labelledby={`tab-story`}
        >
          <PageParagraph>
            Over 4 years across 4 roles — from freelance websites in 2019 to enterprise multi-tenant platforms today. I specialise in React, Angular, Node.js, and TypeScript, always optimising for performance and clean architecture.
          </PageParagraph>

          <Quote>
            "At the end of the day, it's all about solving problems — making things faster, more reliable, and more intuitive for real people."
          </Quote>

          <Timeline>
            <TimelineItem>
              <TimelineTitle>Freelance Web Developer · Aug 2019</TimelineTitle>
              <p>
                Started building websites for clients. Learned to balance clean code with real-world deadlines, client communication, and web performance optimisation.
              </p>
            </TimelineItem>

            <TimelineItem>
              <TimelineTitle>Frontend Developer · 3reen Ltd · Nov 2020 – Mar 2021</TimelineTitle>
              <p>
                Built complex layouts for an e-commerce startup using React and styled-components. Engineered state management with Redux and converted Figma prototypes directly into production code.
              </p>
            </TimelineItem>

            <TimelineItem>
              <TimelineTitle>Full-Stack Developer · Hero Technology (EagleApp) · Aug 2022 – Dec 2022</TimelineTitle>
              <p>
                Led an Agile team building microservices-based applications in React, Node.js, and Express. Mentored junior developers and drove adherence to Scrum best practices.
              </p>
            </TimelineItem>

            <TimelineItem>
              <TimelineTitle>Full-Stack Developer · Compumetrics Solutions · Dec 2022 – Present</TimelineTitle>
              <p>
                Building React, Angular, and TypeScript applications for enterprise clients. Achieved a 20% reduction in page load times through lazy loading and asset optimisation. Redesigned the user permission system from role-based to granular permission-based — improving security and scalability at scale.
              </p>
            </TimelineItem>
          </Timeline>
        </Section>
      )}

      {/* ── Interests Section ── */}
      {activeSection === "interests" && (
        <Section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          role="tabpanel"
          id={`panel-interests`}
          aria-labelledby={`tab-interests`}
        >
          <SubTitle style={{
            textAlign: "center",
            marginBottom: props => props.theme.spacing.xl
          }}>Beyond The Code</SubTitle>

          <CardGrid>
            <InterestCard bgColor={interestCardColors.music}>
              <InterestTitle>
                <Headphones style={{
                  marginRight: props => props.theme.spacing.sm,
                  color: props => props.theme.colors.primary
                }} size={20} /> Music
              </InterestTitle>
              <p>Indie-pop is my coding soundtrack. Nothing beats finding the perfect song to match the problem I'm solving.</p>

              {/* Spotify Playlist Embed */}
              <div style={{ marginTop: props => props.theme.spacing.md }}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  style={{
                    borderRadius: '8px',
                    overflow: 'hidden',
                    marginTop: '16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    position: 'relative'
                  }}
                >
                  {/* This would be replaced with actual Spotify iframe in production */}
                  <iframe
                    title="Spotify Playlist"
                    src="/api/placeholder/300/380"
                    style={{
                      width: '100%',
                      height: '300px',
                      border: 'none',
                    }}
                  />

                  {/* Overlay for design purposes */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '60px',
                    background: 'linear-gradient(to bottom, rgba(30,215,96,0.9) 0%, rgba(30,215,96,0.7) 70%, rgba(30,215,96,0) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 16px'
                  }}>
                    <div style={{
                      fontWeight: 'bold',
                      color: '#fff',
                      fontSize: '1.1rem',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                        style={{ marginRight: '8px', fontSize: '1.4rem' }}
                      >
                        💿
                      </motion.div>
                      My Coding Mix
                    </div>
                  </div>

                  {/* Interactive player controls */}
                  <div style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    right: '16px',
                    height: '60px',
                    background: 'rgba(0,0,0,0.7)',
                    borderRadius: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 20px'
                  }}>
                    {/* Fake player controls */}
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      style={{ cursor: 'pointer', color: '#fff' }}
                    >
                      ⏮️
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: '#1DB954',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.4rem'
                      }}
                    >
                      ▶️
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      style={{ cursor: 'pointer', color: '#fff' }}
                    >
                      ⏭️
                    </motion.div>
                  </div>
                </motion.div>

                <div style={{
                  fontSize: '0.8rem',
                  opacity: 0.8,
                  marginTop: '12px',
                  textAlign: 'center'
                }}>
                  Currently featuring indie gems from Japanese Breakfast, The Marias, and Men I Trust
                </div>
              </div>
            </InterestCard>

            <InterestCard bgColor={interestCardColors.football}>
              <InterestTitle>
                <Volleyball style={{
                  marginRight: props => props.theme.spacing.sm,
                  color: props => props.theme.colors.primary
                }} size={20} /> Football
              </InterestTitle>
              <p>More hustle than bulk — football keeps me sharp when I&apos;m off the keyboard. Tap the card to see my dev stats.</p>

              {/* Developer FUT-style card */}
              <motion.div
                whileHover={{ scale: 1.04, rotateY: 6 }}
                style={{ marginTop: '16px', perspective: '600px' }}
              >
                <div style={{
                  background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 45%, #0f3460 100%)',
                  borderRadius: '14px',
                  padding: '16px',
                  border: '1px solid rgba(224,72,72,0.35)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 16px rgba(224,72,72,0.12)',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 55%)',
                    borderRadius: '12px', pointerEvents: 'none',
                  }} />

                  {/* Top row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 900, color: '#e04848', lineHeight: 1 }}>87</div>
                      <div style={{ fontSize: '0.5rem', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)' }}>OVR</div>
                    </div>
                    <div style={{
                      background: 'linear-gradient(135deg, #e04848, #900)',
                      borderRadius: '6px', padding: '4px 10px',
                      fontSize: '0.5rem', fontWeight: 900,
                      letterSpacing: '2px', color: '#fff',
                    }}>FULL-STACK</div>
                    <div style={{ fontSize: '1.1rem' }}>🇳🇬</div>
                  </div>

                  {/* Floating icon */}
                  <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                      style={{ fontSize: '3rem', lineHeight: 1 }}
                    >⚽</motion.div>
                  </div>

                  {/* Name bar */}
                  <div style={{
                    textAlign: 'center', fontSize: '0.8rem', fontWeight: 900,
                    letterSpacing: '4px', color: 'rgba(255,255,255,0.9)',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    padding: '5px 0', marginBottom: '12px',
                  }}>O B E D</div>

                  {/* Stats grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', textAlign: 'center' }}>
                    {[
                      { label: 'PAC', value: 90, desc: 'Typing speed' },
                      { label: 'SHO', value: 92, desc: 'Problem solving' },
                      { label: 'PAS', value: 88, desc: 'Communication' },
                      { label: 'DRI', value: 87, desc: 'Code quality' },
                      { label: 'DEF', value: 85, desc: 'Bug fixing' },
                      { label: 'PHY', value: 89, desc: 'Deadline stamina' },
                    ].map(s => (
                      <div key={s.label} title={s.desc}>
                        <div style={{ fontSize: '1rem', fontWeight: 900, color: '#e04848' }}>{s.value}</div>
                        <div style={{ fontSize: '0.5rem', letterSpacing: '1px', color: 'rgba(255,255,255,0.35)' }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </InterestCard>

            <InterestCard bgColor={interestCardColors.coffee}>
              <InterestTitle>
                <motion.div whileHover={{ rotate: [0, -10, 20, -10, 0] }} transition={{ duration: 0.5 }}>
                  <Coffee style={{ marginRight: props => props.theme.spacing.sm, color: props => props.theme.colors.primary }} size={20} />
                </motion.div>
                <span>Coffee</span>
              </InterestTitle>
              <p>Espresso is a feature, not a bug. Essential fuel for every coding session.</p>

              <div style={{ marginTop: '16px' }}>
                {/* Strength selector */}
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '14px' }}>
                  {['espresso', 'medium', 'long'].map(s => (
                    <motion.button
                      key={s}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCoffeeStrength(s)}
                      style={{
                        padding: '4px 12px', borderRadius: '20px', border: 'none',
                        fontSize: '0.62rem', letterSpacing: '1px', textTransform: 'uppercase',
                        cursor: 'pointer', fontFamily: 'inherit',
                        background: coffeeStrength === s ? 'linear-gradient(135deg,#6b3a2a,#8b4513)' : 'rgba(255,255,255,0.07)',
                        color: coffeeStrength === s ? '#f5deb3' : 'rgba(255,255,255,0.4)',
                        boxShadow: coffeeStrength === s ? '0 0 10px rgba(139,69,19,0.5)' : 'none',
                      }}
                    >{s}</motion.button>
                  ))}
                </div>

                {/* Machine graphic */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                  <div style={{ position: 'relative', width: '120px' }}>
                    {/* Body */}
                    <div style={{
                      width: '100px', height: '80px', margin: '0 auto',
                      background: 'linear-gradient(160deg,#2a2a2a 0%,#1a1a1a 50%,#3a3a3a 100%)',
                      borderRadius: '12px 12px 4px 4px', position: 'relative',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.07)',
                    }}>
                      {/* Pressure gauge */}
                      <div style={{
                        position: 'absolute', top: '10px', left: '10px',
                        width: '20px', height: '20px', borderRadius: '50%',
                        background: 'radial-gradient(circle at 40% 40%,#444,#1a1a1a)',
                        border: '2px solid #555',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <motion.div
                          animate={{ rotate: brewing ? [0, 45, 60, 45] : [0, 8, 0] }}
                          transition={{ duration: brewing ? 1.4 : 3, repeat: Infinity }}
                          style={{ width: '8px', height: '1.5px', background: '#e04848', borderRadius: '1px', transformOrigin: 'left center' }}
                        />
                      </div>
                      {/* LED */}
                      <motion.div
                        animate={{ opacity: brewing ? [0.5, 1, 0.5] : 1 }}
                        transition={{ duration: 0.5, repeat: brewing ? Infinity : 0 }}
                        style={{
                          position: 'absolute', top: '10px', right: '10px',
                          width: '8px', height: '8px', borderRadius: '50%',
                          background: brewing ? '#ff6b35' : '#00ff88',
                          boxShadow: brewing ? '0 0 8px #ff6b35' : '0 0 8px #00ff88',
                        }}
                      />
                      {/* Display */}
                      <div style={{
                        position: 'absolute', top: '14px', left: '50%', transform: 'translateX(-50%)',
                        background: '#0a1628', borderRadius: '4px',
                        padding: '3px 6px', border: '1px solid #333',
                        fontSize: '0.55rem', color: brewing ? '#ff6b35' : '#00ff88',
                        fontFamily: 'monospace', letterSpacing: '1px', whiteSpace: 'nowrap',
                      }}>
                        {brewing ? 'BREWING' : coffeeStrength === 'espresso' ? '25ml' : coffeeStrength === 'medium' ? '60ml' : '120ml'}
                      </div>
                      {/* Portafilter */}
                      <div style={{
                        position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)',
                        width: '52px', height: '14px',
                        background: 'linear-gradient(to bottom,#444,#2a2a2a)',
                        borderRadius: '0 0 20px 20px', border: '1px solid rgba(255,255,255,0.08)',
                      }}>
                        {[0, 1, 2].map(i => (
                          <motion.div key={i}
                            animate={brewing ? { height: ['0px', '14px', '0px'], opacity: [0, 1, 0] } : { height: '0px', opacity: 0 }}
                            transition={{ duration: 0.55, delay: i * 0.15, repeat: brewing ? Infinity : 0 }}
                            style={{
                              position: 'absolute', top: '14px', left: `${9 + i * 13}px`,
                              width: '3px', background: 'linear-gradient(to bottom,#3E2723,#1a0f00)',
                              borderRadius: '2px',
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Steam wisps */}
                    {brewing && [0, 1, 2].map(i => (
                      <motion.div key={`st${i}`}
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: [0, 0.5, 0], y: -28, x: (i - 1) * 7 }}
                        transition={{ duration: 1.1, delay: i * 0.25, repeat: Infinity }}
                        style={{
                          position: 'absolute', top: '2px', left: '50%',
                          width: '5px', height: '5px', borderRadius: '50%',
                          background: 'rgba(255,255,255,0.35)', filter: 'blur(3px)',
                          pointerEvents: 'none',
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Cup - clickable */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={brewCoffee}
                    style={{
                      width: '64px', height: '56px',
                      background: 'linear-gradient(160deg,#f5f5f0,#e8e0d0)',
                      borderRadius: '3px 3px 16px 16px',
                      position: 'relative', cursor: brewing ? 'wait' : 'pointer',
                      overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                    }}
                  >
                    {/* Handle */}
                    <div style={{
                      position: 'absolute', right: '-10px', top: '12px',
                      width: '12px', height: '24px',
                      border: '3px solid #e0d8c8', borderLeft: 'none',
                      borderRadius: '0 30px 30px 0',
                    }} />
                    {/* Coffee fill */}
                    <motion.div
                      animate={{ height: coffeeCount > 0 ? `${Math.min(coffeeCount * (coffeeStrength === 'espresso' ? 6 : coffeeStrength === 'medium' ? 9 : 12), 48)}px` : '0px' }}
                      transition={{ type: 'spring', damping: 12 }}
                      style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        background: coffeeStrength === 'espresso'
                          ? 'linear-gradient(to top,#1a0800,#3E2723)'
                          : coffeeStrength === 'medium'
                            ? 'linear-gradient(to top,#2d1500,#5D4037)'
                            : 'linear-gradient(to top,#3d2000,#795548)',
                        borderRadius: '0 0 13px 13px',
                      }}
                    />
                    {/* Foam layer */}
                    {coffeeCount > 0 && (
                      <motion.div
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{
                          position: 'absolute',
                          bottom: Math.min(coffeeCount * (coffeeStrength === 'espresso' ? 6 : coffeeStrength === 'medium' ? 9 : 12), 48),
                          left: 2, right: 2, height: '4px',
                          background: 'rgba(220,185,120,0.65)', borderRadius: '4px',
                        }}
                      />
                    )}
                    {/* Tap hint */}
                    {coffeeCount === 0 && !brewing && (
                      <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.52rem', color: 'rgba(0,0,0,0.3)',
                        letterSpacing: '1px', textAlign: 'center', lineHeight: 1.4,
                      }}>TAP<br />TO<br />BREW</div>
                    )}
                  </motion.div>
                </div>

                {/* Stats bar */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  background: 'rgba(0,0,0,0.2)', borderRadius: '8px',
                  padding: '7px 12px', fontSize: '0.72rem', marginBottom: '8px',
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>
                    ☕ <strong style={{ color: 'rgba(255,255,255,0.85)' }}>{coffeeCount}</strong> cups
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>
                    ⚡ <strong style={{ color: coffeeCount > 7 ? '#e04848' : 'rgba(255,255,255,0.85)' }}>{coffeeCount * 95}mg</strong>
                  </span>
                </div>

                {/* Message */}
                {coffeeCount > 0 && (
                  <motion.div
                    key={coffeeCount}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      fontSize: '0.75rem', fontStyle: 'italic',
                      color: 'rgba(255,255,255,0.5)', textAlign: 'center',
                      padding: '6px', background: 'rgba(0,0,0,0.15)', borderRadius: '6px',
                    }}
                  >
                    {coffeeCount === 1 && "First cup. Engines warming... ☀️"}
                    {coffeeCount === 2 && "Getting into the zone 🎯"}
                    {coffeeCount === 3 && "Peak flow state achieved 🚀"}
                    {coffeeCount === 4 && "Fingers flying across the keyboard!"}
                    {coffeeCount === 5 && "Reaching optimal velocity..."}
                    {coffeeCount > 5 && coffeeCount <= 7 && "Is the code writing itself? 🤔"}
                    {coffeeCount > 7 && coffeeCount <= 10 && "I can see through the bugs now 👁️"}
                    {coffeeCount > 10 && "Maybe water next time? 😅"}
                  </motion.div>
                )}
              </div>
            </InterestCard>
          </CardGrid>

          <Card style={{ marginTop: props => props.theme.spacing.lg }}>
            <h3>Let's Connect</h3>
            <p>
              When I'm not deep in the code, you'll probably catch me listening to indie-pop, playing football, or just chatting with people about cool projects. I'm always interested in hearing about new ideas or potential collaborations.
            </p>
            <SocialButtonContainer>
              <SocialButton bgColor="#0077b5">LinkedIn</SocialButton>
              <SocialButton bgColor="#111111">GitHub</SocialButton>
              <SocialButton bgColor={props => props.theme.colors.primary}>Twitter</SocialButton>
            </SocialButtonContainer>
          </Card>
        </Section>
      )}
    </PageLayout>
  );
}