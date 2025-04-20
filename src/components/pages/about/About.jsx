import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import PageLayout from "../../layouts/PageLayout";
import { PageParagraph, StyledButton, SubTitle } from "../../shared/StyledComponents";
import { Clock, Headphones, Code, Coffee, Volleyball, Globe } from "lucide-react";

// Styled Components - Updated to use the correct color variables
const TabButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  transition: all 0.3s ease;
  margin: 0.25rem;
  background-color: ${props => props.active ? "var(--primary)" : "rgba(255, 255, 255, 0.1)"};
  color: ${props => props.active ? "white" : "var(--text)"};
  border: none;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? "var(--primary-dark)" : "var(--surface-hover)"};
  }
`;

const TabContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 2rem;
  role: "tablist";
`;

const Section = styled(motion.div)`
  margin-top: 2rem;
  margin-bottom: 2rem;
`;

const GradientCard = styled.div`
  background: linear-gradient(to right, var(--primary), #ff8a8a);
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  color: white;
  margin-bottom: 1.5rem;
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
`;

const TypewriterContainer = styled.div`
  height: 2rem;
  margin-bottom: 1rem;
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
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Tag = styled.span`
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const InfoCard = styled(motion.div)`
  background-color: ${props => props.color || "var(--surface)"};
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
`;

const SkillContainer = styled.div`
  margin-bottom: 1rem;
`;

const SkillHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
`;

const SkillName = styled.span`
  font-weight: 500;
`;

const SkillBarBackground = styled.div`
  width: 100%;
  background-color: var(--surface);
  border-radius: 9999px;
  height: 0.625rem;
`;

const SkillBarFill = styled(motion.div)`
  background-color: var(--primary);
  height: 0.625rem;
  border-radius: 9999px;
`;

const Quote = styled.div`
  background-color: var(--surface);
  border-left: 4px solid var(--primary);
  padding: 1rem;
  font-style: italic;
  margin: 1.5rem 0;
`;

const Timeline = styled.div`
  position: relative;
  padding-left: 2rem;
  
  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: var(--surface);
  }
`;

const TimelineItem = styled.div`
  position: relative;
  padding-bottom: 2rem;
  
  &:last-child {
    padding-bottom: 0;
  }
  
  &:before {
    content: "";
    position: absolute;
    left: -2rem;
    top: 0;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background-color: var(--primary);
    transform: translateX(-0.25rem);
  }
`;

const TimelineTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const InterestCard = styled(motion.div)`
  background: ${props => props.bgColor || "var(--surface)"};
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-0.25rem);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
`;

const InterestTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
`;

const SocialButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
`;

const SocialButton = styled.button`
  background-color: ${props => props.bgColor || "var(--primary)"};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    filter: brightness(90%);
  }
`;

const resumeButtonVariants = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.3 }
  },
  tap: {
    scale: 0.95
  }
};

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

  // Updated interest cards to use the dark theme color scheme
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
              <Code size={24} style={{ marginRight: "0.5rem" }} /> Developer Profile
            </CardTitle>
            <TypewriterContainer>
              {displayText}<Cursor>|</Cursor>
            </TypewriterContainer>
            <p>
              Right now, I'm based in Abuja, Nigeria—but hey, I'm open to working from anywhere.
            </p>
            <TagContainer>
              {["JavaScript", "React", "Node.js", "NestJS", "UI/UX", "Problem Solver"].map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </TagContainer>
          </GradientCard>

          <CardGrid>
            <InfoCard
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem" }}>My Approach</h3>
              <p>
                I've got a thing for clean code, fast load times, and responsive designs that make you feel
                like you're using something special. At the end of the day, it's all about solving problems.
              </p>
            </InfoCard>

            <InfoCard
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem" }}>Quick Facts</h3>
              <ul style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {funFacts.map((fact, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {fact.icon}
                    <span>{fact.text}</span>
                  </li>
                ))}
              </ul>
            </InfoCard>
          </CardGrid>

          <motion.div
            style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}
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
                variants={resumeButtonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Check Out My Resume
              </StyledButton>
            </a>
          </motion.div>
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
          <SubTitle style={{ textAlign: "center", marginBottom: "2rem" }}>Technical Toolkit</SubTitle>

          <div style={{ marginBottom: "2rem" }}>
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
            <InfoCard>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem" }}>Frontend</h3>
              <TagContainer>
                {["React", "JavaScript", "TypeScript", "HTML/CSS", "Responsive Design", "State Management"].map(skill => (
                  <Tag key={skill} style={{ backgroundColor: "rgba(255, 255, 255, 0.08)", color: "var(--text)" }}>{skill}</Tag>
                ))}
              </TagContainer>
            </InfoCard>

            <InfoCard>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem" }}>Backend</h3>
              <TagContainer>
                {["Node.js", "NestJS", "Express", "APIs", "Database Design", "Authentication"].map(skill => (
                  <Tag key={skill} style={{ backgroundColor: "rgba(255, 255, 255, 0.08)", color: "var(--text)" }}>{skill}</Tag>
                ))}
              </TagContainer>
            </InfoCard>
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
                Always learning, always growing  I’m continuously exploring new technologies while mastering my current stack to craft better digital experiences. Lately, I’ve been diving into the world of 3D computer graphics with Three.js, creating immersive web environments that push the boundaries of what the browser can do.

                At the same time, I’m an enthusiastic builder with Electron and React Native, constantly sharpening my skills in cross-platform development to deliver seamless, responsive experiences across all kinds of devices. Whether it’s on he web, desktop, or mobile  I’m all about creating solutions that feel intuitive, polished, and purposeful.
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
          <SubTitle style={{ textAlign: "center", marginBottom: "2rem" }}>Beyond The Code</SubTitle>

          <CardGrid>
            <InterestCard bgColor={interestCardColors.music}>
              <InterestTitle>
                <Headphones style={{ marginRight: "0.5rem", color: "var(--primary)" }} size={20} /> Music
              </InterestTitle>
              <p>Indie-pop is my coding soundtrack. Nothing beats finding the perfect song to match the problem I'm solving.</p>
            </InterestCard>

            <InterestCard bgColor={interestCardColors.football}>
              <InterestTitle>
                <Volleyball style={{ marginRight: "0.5rem", color: "var(--primary)" }} size={20} /> Football
              </InterestTitle>
              <p>Don't judge the "bulk" though — I'm more about the hustle on the field. Football keeps me balanced when I'm not coding.</p>
            </InterestCard>

            <InterestCard bgColor={interestCardColors.coffee}>
              <InterestTitle>
                <Coffee
                  style={{ marginRight: "0.5rem", cursor: "pointer", color: "var(--primary)" }}
                  size={20}
                  onClick={() => setCoffeeCount(count => count + 1)}
                /> Coffee
              </InterestTitle>
              <p>
                Essential fuel for coding sessions. You've clicked my coffee cup {coffeeCount} times!
              </p>
              {coffeeCount > 5 && (
                <p style={{ fontSize: "0.875rem", fontStyle: "italic", marginTop: "0.5rem" }}>
                  Wow, you really like coffee too! We'd get along well.
                </p>
              )}
            </InterestCard>
          </CardGrid>

          <InfoCard style={{ marginTop: "1.5rem" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem" }}>Let's Connect</h3>
            <p>
              When I'm not deep in the code, you'll probably catch me listening to indie-pop, playing football, or just chatting with people about cool projects. I'm always interested in hearing about new ideas or potential collaborations.
            </p>
            <SocialButtonContainer>
              <SocialButton bgColor="#0077b5">LinkedIn</SocialButton>
              <SocialButton bgColor="#111111">GitHub</SocialButton>
              <SocialButton bgColor="var(--primary)">Twitter</SocialButton>
            </SocialButtonContainer>
          </InfoCard>
        </Section>
      )}
    </PageLayout>
  );
}