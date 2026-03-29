import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Code } from "lucide-react";
import { Badge } from "../../shared/StyledComponents";
import { allFunFacts } from "./data/FunFact";
import FunFactList from "./FunFactList";
import Section from "../../shared/Section";


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

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const SectionHeader = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const IntroSection = () => {
    const [displayText, setDisplayText] = useState("");
    const [typewriterComplete, setTypewriterComplete] = useState(false);
    const [funFacts, setFunFacts] = useState([]);
    const introText = "Hey! I'm Obed, a web developer who loves turning ideas into functional, user-friendly websites.";


    useEffect(() => {
        shuffleFunFacts();
    }, []);


    const shuffleFunFacts = () => {
        const shuffled = [...allFunFacts]
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);
        setFunFacts(shuffled);
    };


    useEffect(() => {
        if (!typewriterComplete) {
            if (displayText.length < introText.length) {
                const timeout = setTimeout(() => {
                    setDisplayText(prev => introText.slice(0, prev.length + 1));
                }, 50);

                return () => clearTimeout(timeout);
            } else {
                setTypewriterComplete(true);
            }
        }
    }, [displayText, typewriterComplete, introText]);

    return (
        <Section id="panel-intro" ariaLabelledby="tab-intro">
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
                    <FunFactList facts={funFacts} />
                </InfoCard>
            </CardGrid>
        </Section>
    );
};

export default IntroSection;