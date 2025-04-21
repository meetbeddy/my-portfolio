import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { CheckCircle, Link } from "lucide-react";
import { SubTitle } from "../../shared/StyledComponents";
import Section from "../../shared/Section";
import { masteryLevels, skills } from "./data/skillData";

const Card = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borders.radius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.sm};
`;


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

const detailsVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } }
};

const SkillsSection = () => {
    const [expandedSkill, setExpandedSkill] = useState(null);

    const toggleExpandSkill = (skillId) => {
        setExpandedSkill(expandedSkill === skillId ? null : skillId);
    };

    return (
        <Section id="panel-skills" ariaLabelledby="tab-skills">
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
    );
};

export default SkillsSection;