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
  height: 2rem;
  margin-bottom: ${props => props.theme.spacing.md};
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
  const [typewriterComplete, setTypewriterComplete] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const introText = "Hey! I'm Obed, a web developer who loves turning ideas into functional, user-friendly websites.";

  // Enhanced skills data with more context
  const skills = [
    {
      id: "react",
      name: "React",
      level: "Expert",
      years: 4,
      color: "#61DAFB",
      description: "Building complex UI components with React's latest features and patterns",
      technologies: ["Hooks", "Context API", "Redux", "Next.js", "Performance Optimization"],
      projects: [
        { name: "E-commerce Platform", link: "#projects/ecommerce" },
        { name: "Content Management System", link: "#projects/cms" }
      ]
    },
    {
      id: "nodejs",
      name: "Node.js",
      level: "Advanced",
      years: 3,
      color: "#68A063",
      description: "Creating robust backend services with a focus on scalability and performance",
      technologies: ["Express", "RESTful APIs", "Authentication", "Microservices"],
      projects: [
        { name: "User Management API", link: "#projects/user-api" },
        { name: "Payment Processing Service", link: "#projects/payment" }
      ]
    },
    {
      id: "nestjs",
      name: "NestJS",
      level: "Proficient",
      years: 2,
      color: "#E0234E",
      description: "Building enterprise-grade applications with TypeScript-based architecture",
      technologies: ["TypeORM", "Dependency Injection", "Modules", "Guards"],
      projects: [
        { name: "Content Delivery API", link: "#projects/content-api" }
      ]
    },
    {
      id: "uiux",
      name: "UI/UX",
      level: "Intermediate",
      years: 3,
      color: "#FF7EB6",
      description: "Designing intuitive interfaces with focus on user experience and accessibility",
      technologies: ["Wireframing", "Prototyping", "User Testing", "Responsive Design"],
      projects: [
        { name: "Design System", link: "#projects/design-system" }
      ]
    },
    {
      id: "problem",
      name: "Problem Solving",
      level: "Expert",
      years: 5,
      color: "#FFC107",
      description: "Analytical approach to complex technical challenges across different domains",
      technologies: ["Algorithms", "System Design", "Debugging", "Performance Tuning"],
      projects: [
        { name: "E-commerce Search Optimization", link: "#projects/search-opt" },
        { name: "Real-time Data Processing", link: "#projects/realtime" }
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
              {["JavaScript", "React", "Node.js", "NestJS", "UI/UX", "Problem Solver"].map(tag => (
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
            I've spent the last few years building both the front and back ends of web apps, whether it's whipping up smooth interfaces with React, or building the server-side with Node.js and NestJS. I'm all about creating websites that don't just work, but feel right.
          </PageParagraph>

          <Quote>
            "At the end of the day, it's all about solving problems making things easier and more efficient for people, whether that's with a better user interface, a smoother backend, or just a system that actually works when you need it."
          </Quote>

          <Timeline>
            <TimelineItem>
              <TimelineTitle>Where I Started</TimelineTitle>
              <p>
                My journey began with a fascination for how websites work, diving into HTML/CSS, and quickly discovering the endless possibilities of JavaScript.
              </p>
            </TimelineItem>

            <TimelineItem>
              <TimelineTitle>Where I Am</TimelineTitle>
              <p>
                Now I build complete web applications from concept to deployment, focusing on creating intuitive user experiences backed by solid, scalable architecture.
              </p>
            </TimelineItem>

            <TimelineItem>
              <TimelineTitle>Where I'm Going</TimelineTitle>
              <p>
                Always learning, always growing. I'm continuously exploring new technologies while mastering my current stack to craft better digital experiences. Lately, I've been diving into the world of 3D computer graphics with Three.js, creating immersive web environments that push the boundaries of what the browser can do.
              </p>
              <p>
                At the same time, I'm an enthusiastic builder with Electron and React Native, constantly sharpening my skills in cross-platform development to deliver seamless, responsive experiences across all kinds of devices. Whether it's on the web, desktop, or mobile, I'm all about creating solutions that feel intuitive, polished, and purposeful.
              </p>
            </TimelineItem>
          </Timeline>
        </Section>
      )}

      {/* Interests Section */}
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
              <p>Don't judge the "bulk" though — I'm more about the hustle on the field. Football keeps me balanced when I'm not coding.</p>

              {/* Football Mini-Game */}
              <div style={{ marginTop: props => props.theme.spacing.md }}>
                <h4 style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <motion.div
                    animate={{ rotate: [0, 20, 0, -20, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{ marginRight: '8px', fontSize: '1.2rem' }}
                  >
                    ⚽
                  </motion.div>
                  Mini Penalty Game
                </h4>

                {/* Football penalty mini-game */}
                <motion.div
                  whileHover={{
                    boxShadow: '0 8px 15px rgba(0,0,0,0.3)'
                  }}
                  style={{
                    backgroundColor: 'rgba(0,100,0,0.2)',
                    borderRadius: '8px',
                    padding: '16px',
                    cursor: 'pointer',
                    border: '2px solid rgba(255,255,255,0.1)',
                    position: 'relative',
                    height: '180px',
                    overflow: 'hidden'
                  }}
                >
                  {/* Soccer field background */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'linear-gradient(to bottom, rgba(0,80,0,0.5), rgba(0,140,0,0.3))',
                    zIndex: 0
                  }}>
                    {/* Field markings */}
                    <div style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '10%',
                      right: '10%',
                      height: '70px',
                      border: '2px solid rgba(255,255,255,0.5)',
                      borderBottom: 'none'
                    }}></div>
                    <div style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '40%',
                      right: '40%',
                      height: '30px',
                      border: '2px solid rgba(255,255,255,0.5)',
                      borderBottom: 'none'
                    }}></div>
                  </div>

                  {/* Goal */}
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '25%',
                    right: '25%',
                    height: '60px',
                    borderTop: '4px solid white',
                    borderLeft: '4px solid white',
                    borderRight: '4px solid white',
                    zIndex: 1
                  }}></div>

                  {/* Interactive football */}
                  <motion.div
                    drag
                    dragConstraints={{
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0
                    }}
                    dragElastic={0.7}
                    whileDrag={{ scale: 1.2 }}
                    dragTransition={{ bounceStiffness: 600, bounceDamping: 10 }}
                    style={{
                      position: 'absolute',
                      bottom: '30px',
                      left: 'calc(50% - 15px)',
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      backgroundImage: 'radial-gradient(circle at 30% 30%, white, #888)',
                      zIndex: 2,
                      cursor: 'grab'
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      fontSize: '0.6rem',
                      width: '100%',
                      textAlign: 'center',
                      top: '8px',
                      fontWeight: 'bold'
                    }}>
                      DRAG
                    </div>
                  </motion.div>

                  {/* Goalkeeper (static) */}
                  <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: 'calc(50% - 20px)',
                    width: '40px',
                    height: '60px',
                    backgroundImage: 'linear-gradient(to bottom, #ff0000, #aa0000)',
                    borderRadius: '10px 10px 0 0',
                    zIndex: 1
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '-15px',
                      left: '5px',
                      width: '30px',
                      height: '30px',
                      backgroundColor: '#ffdbac',
                      borderRadius: '50%'
                    }}></div>
                  </div>

                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    zIndex: 3,
                    fontSize: '0.8rem',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    color: 'white'
                  }}>
                    Drag the ball to score!
                  </div>
                </motion.div>
              </div>
            </InterestCard>

            <InterestCard bgColor={interestCardColors.coffee}>
              <InterestTitle>
                <motion.div
                  whileHover={{ rotate: [0, -10, 20, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Coffee
                    style={{
                      marginRight: props => props.theme.spacing.sm,
                      color: props => props.theme.colors.primary
                    }}
                    size={20}
                  />
                </motion.div>
                <span>Coffee</span>
              </InterestTitle>
              <p>Essential fuel for coding sessions.</p>

              {/* Enhanced Coffee Interactive Brewing Station */}
              <motion.div
                style={{
                  backgroundColor: 'rgba(103, 65, 35, 0.3)',
                  borderRadius: '12px',
                  padding: '16px 12px',
                  marginTop: '16px',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '2px solid rgba(139, 69, 19, 0.4)'
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: '16px', fontWeight: 'bold' }}>
                  Virtual Coffee Brewing Station
                </div>

                {/* Coffee Machine */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  position: 'relative',
                  height: '120px',
                  marginBottom: '16px'
                }}>
                  {/* Coffee Machine Body */}
                  <div style={{
                    width: '80px',
                    height: '100px',
                    backgroundColor: '#222',
                    borderRadius: '8px 8px 4px 4px',
                    position: 'relative'
                  }}>
                    {/* Machine Display */}
                    <div style={{
                      position: 'absolute',
                      top: '15px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '50px',
                      height: '20px',
                      backgroundColor: '#333',
                      borderRadius: '4px',
                      border: '2px solid #444',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: '0.8rem',
                      color: '#00ff00'
                    }}>
                      {coffeeCount}
                    </div>

                    {/* Coffee Spout */}
                    <div style={{
                      position: 'absolute',
                      bottom: '0',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '20px',
                      height: '15px',
                      backgroundColor: '#111',
                      borderRadius: '0 0 5px 5px'
                    }}></div>
                  </div>

                  {/* Coffee Cup */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCoffeeCount(count => count + 1)}
                    style={{
                      position: 'absolute',
                      bottom: '0',
                      width: '60px',
                      height: '70px',
                      borderRadius: '5px 5px 20px 20px',
                      background: 'linear-gradient(to right, #b98b56, #7d5a3c)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Cup Handle */}
                    <div style={{
                      position: 'absolute',
                      right: '-15px',
                      top: '20px',
                      width: '15px',
                      height: '30px',
                      borderRadius: '0 15px 15px 0',
                      borderTop: '5px solid #7d5a3c',
                      borderRight: '5px solid #7d5a3c',
                      borderBottom: '5px solid #7d5a3c'
                    }}></div>

                    {/* Coffee Level */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{
                        height: coffeeCount > 0 ? `${Math.min(coffeeCount * 7, 50)}px` : 0
                      }}
                      transition={{ type: 'spring', damping: 10 }}
                      style={{
                        width: '100%',
                        backgroundColor: '#3E2723',
                        borderRadius: '0 0 15px 15px'
                      }}
                    >
                      {/* Coffee Steam Animation */}
                      {coffeeCount > 0 && (
                        <div style={{ position: 'relative' }}>
                          <motion.div
                            initial={{ opacity: 0, y: 0 }}
                            animate={{
                              opacity: [0, 0.7, 0],
                              y: -20
                            }}
                            transition={{ duration: 2, repeat: Infinity, repeatType: 'loop' }}
                            style={{
                              position: 'absolute',
                              left: '10px',
                              top: '-20px',
                              color: 'white',
                              fontSize: '1.2rem',
                              filter: 'blur(2px)'
                            }}
                          >
                            ~
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, y: 0 }}
                            animate={{
                              opacity: [0, 0.7, 0],
                              y: -15
                            }}
                            transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, repeatType: 'loop' }}
                            style={{
                              position: 'absolute',
                              left: '30px',
                              top: '-20px',
                              color: 'white',
                              fontSize: '1.2rem',
                              filter: 'blur(2px)'
                            }}
                          >
                            ~
                          </motion.div>
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                </div>

                <div style={{
                  textAlign: 'center',
                  fontSize: '0.8rem',
                  marginBottom: '8px'
                }}>
                  <strong>Click the cup to brew!</strong>
                </div>

                {/* Coffee Stats */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  padding: '8px',
                  borderRadius: '4px',
                  fontSize: '0.8rem'
                }}>
                  <div>Cups brewed: <strong>{coffeeCount}</strong></div>
                  <div>Caffeine: <strong>{coffeeCount * 95}mg</strong></div>
                </div>

                {/* Coffee Messages */}
                {coffeeCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ delay: 0.3 }}
                    style={{
                      marginTop: '12px',
                      padding: '8px',
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      fontStyle: 'italic'
                    }}
                  >
                    {coffeeCount === 1 && "First cup of the day! Starting the engines... ☀️"}
                    {coffeeCount === 2 && "Getting warmed up. Ideas starting to flow."}
                    {coffeeCount === 3 && "Now we're talking! Perfect coding momentum."}
                    {coffeeCount === 4 && "Fingers flying across the keyboard now!"}
                    {coffeeCount === 5 && "Reaching optimal coding velocity..."}
                    {coffeeCount > 5 && coffeeCount <= 7 && "Is the code writing itself or is that the caffeine talking?"}
                    {coffeeCount > 7 && coffeeCount <= 10 && "I can hear colors and see sounds now. Debugging is a breeze!"}
                    {coffeeCount > 10 && "Okay, maybe we should switch to water now... My code is starting to look like hieroglyphics! 😅"}
                  </motion.div>
                )}
              </motion.div>
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