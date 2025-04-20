import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PageLayout from "../../layouts/PageLayout";
import { PageParagraph, StyledButton, SubTitle, Card, Grid, Badge, RevealContainer } from "../../shared/StyledComponents";
import { Clock, Headphones, Code, Coffee, Volleyball, Globe } from "lucide-react";
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

const SkillContainer = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
`;

const SkillHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const SkillName = styled.span`
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const SkillBarBackground = styled.div`
  width: 100%;
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borders.radius.full};
  height: 0.625rem;
`;

const SkillBarFill = styled(motion.div)`
  background-color: ${props => props.theme.colors.primary};
  height: 0.625rem;
  border-radius: ${props => props.theme.borders.radius.full};
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

// Additional styled components for inline styles
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

export default function About() {
  const [activeSection, setActiveSection] = useState("intro");
  const [coffeeCount, setCoffeeCount] = useState(0);
  const [typewriterComplete, setTypewriterComplete] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const introText = "Hey! I'm Obed, a web developer who loves turning ideas into functional, user-friendly websites.";

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

  // Skills with animation
  const skills = [
    { name: "React", level: 90 },
    { name: "Node.js", level: 85 },
    { name: "NestJS", level: 80 },
    { name: "UI/UX", level: 75 },
    { name: "Problem Solving", level: 95 },
  ];

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
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
              <Code size={24} style={{ marginRight: props => props.theme.spacing.sm }} /> Developer Profile
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
              <ul style={{ display: "flex", flexDirection: "column", gap: props => props.theme.spacing.sm }}>
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
              marginTop: props => props.theme.spacing.xl
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

      {/* Skills Section */}
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
            marginBottom: props => props.theme.spacing.xl
          }}>Technical Toolkit</SubTitle>

          <div style={{ marginBottom: props => props.theme.spacing.xl }}>
            {skills.map((skill) => (
              <SkillContainer key={skill.name}>
                <SkillHeader>
                  <SkillName>{skill.name}</SkillName>
                  <span>{skill.level}%</span>
                </SkillHeader>
                <SkillBarBackground>
                  <SkillBarFill
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </SkillBarBackground>
              </SkillContainer>
            ))}
          </div>

          <CardGrid>
            <Card>
              <h3>Frontend</h3>
              <TagContainer>
                {["React", "JavaScript", "TypeScript", "HTML/CSS", "Responsive Design", "State Management"].map(skill => (
                  <Badge key={skill} variant="primary">{skill}</Badge>
                ))}
              </TagContainer>
            </Card>

            <Card>
              <h3>Backend</h3>
              <TagContainer>
                {["Node.js", "NestJS", "Express", "APIs", "Database Design", "Authentication"].map(skill => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </TagContainer>
            </Card>
          </CardGrid>
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
            </InterestCard>

            <InterestCard bgColor={interestCardColors.football}>
              <InterestTitle>
                <Volleyball style={{
                  marginRight: props => props.theme.spacing.sm,
                  color: props => props.theme.colors.primary
                }} size={20} /> Football
              </InterestTitle>
              <p>Don't judge the "bulk" though — I'm more about the hustle on the field. Football keeps me balanced when I'm not coding.</p>
            </InterestCard>

            <InterestCard bgColor={interestCardColors.coffee}>
              <InterestTitle>
                <Coffee
                  style={{
                    marginRight: props => props.theme.spacing.sm,
                    cursor: "pointer",
                    color: props => props.theme.colors.primary
                  }}
                  size={20}
                  onClick={() => setCoffeeCount(count => count + 1)}
                /> Coffee
              </InterestTitle>
              <p>
                Essential fuel for coding sessions. You've clicked my coffee cup {coffeeCount} times!
              </p>
              {coffeeCount > 5 && (
                <CoffeeNote>
                  Wow, you really like coffee too! We'd get along well.
                </CoffeeNote>
              )}
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