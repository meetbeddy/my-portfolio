import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "../../layouts/PageLayout";
import styled, { keyframes } from "styled-components";

// ─── Animations ───────────────────────────────────────────────────────────────
const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

// ─── Styled Components ────────────────────────────────────────────────────────
const PageWrap = styled(motion.div)`
  padding: 0 1rem 4rem;
  max-width: 860px;
  margin: 0 auto;
`;

/* ── Tab bar ── */
const TabBar = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
`;

const Tab = styled(motion.button)`
  padding: 0.45rem 1.2rem;
  border-radius: 2rem;
  border: none;
  cursor: pointer;
  font-size: 0.8rem;
  font-family: inherit;
  letter-spacing: 1px;
  transition: background 0.2s, color 0.2s;
  background: ${p => p.$active
    ? 'linear-gradient(135deg, #e04848, #b02020)'
    : 'rgba(255,255,255,0.07)'};
  color: ${p => p.$active ? '#fff' : 'rgba(255,255,255,0.55)'};
  box-shadow: ${p => p.$active ? '0 4px 14px rgba(224,72,72,0.35)' : 'none'};
`;

/* ── Skills: category group ── */
const CategoryGroup = styled(motion.div)`
  margin-bottom: 2rem;
`;

const CategoryLabel = styled.h3`
  font-size: 0.62rem;
  letter-spacing: 3px;
  color: rgba(255,255,255,0.3);
  text-transform: uppercase;
  margin: 0 0 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.07);
  }
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
`;

const Chip = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.38rem 0.9rem;
  border-radius: 2rem;
  border: 1px solid ${p => p.$color}44;
  background: ${p => p.$color}12;
  color: ${p => p.$color};
  font-size: 0.78rem;
  font-family: inherit;
  cursor: pointer;
  letter-spacing: 0.5px;
  transition: background 0.18s, box-shadow 0.18s;

  &:hover, &[data-active="true"] {
    background: ${p => p.$color}24;
    box-shadow: 0 0 14px ${p => p.$color}44;
  }

  i { font-size: 0.85rem; }
`;

/* ── Skill detail card ── */
const DetailCard = styled(motion.div)`
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-left: 3px solid ${p => p.$color || '#e04848'};
  border-radius: 0.75rem;
  padding: 1rem 1.2rem;
  margin-bottom: 1.5rem;
  font-size: 0.85rem;
  line-height: 1.7;
  color: rgba(255,255,255,0.7);
`;

const DetailName = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: ${p => p.$color};
  margin-bottom: 0.3rem;
  letter-spacing: 1px;
`;

/* ── Experience timeline ── */
const Timeline = styled.div`
  position: relative;
  padding-left: 1.5rem;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 8px;
    bottom: 8px;
    width: 2px;
    background: linear-gradient(to bottom, #e04848, rgba(224,72,72,0.1));
    border-radius: 1px;
  }
`;

const Job = styled(motion.div)`
  position: relative;
  padding-bottom: 2rem;

  &:last-child { padding-bottom: 0; }

  &::before {
    content: '';
    position: absolute;
    left: -1.5rem;
    top: 6px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #e04848;
    box-shadow: 0 0 10px rgba(224,72,72,0.6);
    transform: translateX(-4px);
  }
`;

const JobHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-bottom: 0.5rem;
`;

const JobTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 700;
  color: rgba(255,255,255,0.9);
`;

const JobCompany = styled.div`
  font-size: 0.8rem;
  color: #e04848;
  font-weight: 600;
  margin-bottom: 0.2rem;
`;

const JobPeriod = styled.div`
  font-size: 0.7rem;
  color: rgba(255,255,255,0.3);
  letter-spacing: 1px;
  white-space: nowrap;
`;

const JobDesc = styled.p`
  font-size: 0.8rem;
  color: rgba(255,255,255,0.55);
  line-height: 1.7;
  margin: 0.5rem 0;
`;

const BulletList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const Bullet = styled.li`
  font-size: 0.78rem;
  color: rgba(255,255,255,0.5);
  line-height: 1.6;
  position: relative;
  padding-left: 1rem;

  &::before {
    content: '→';
    position: absolute;
    left: 0;
    color: #e04848;
    font-size: 0.68rem;
  }
`;

const TechRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.7rem;
`;

const TechPill = styled.span`
  font-size: 0.68rem;
  padding: 0.2rem 0.55rem;
  border-radius: 1rem;
  background: rgba(224,72,72,0.1);
  border: 1px solid rgba(224,72,72,0.25);
  color: rgba(255,255,255,0.55);
  letter-spacing: 0.5px;
`;

const EduBox = styled(motion.div)`
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 0.75rem;
  padding: 1.2rem 1.4rem;
  margin-top: 2rem;
`;

const EduTitle = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: rgba(255,255,255,0.9);
  margin-bottom: 0.25rem;
`;

const EduSub = styled.div`
  font-size: 0.8rem;
  color: rgba(255,255,255,0.4);
  letter-spacing: 1px;
`;

// ─── Data ─────────────────────────────────────────────────────────────────────
const skillCategories = [
  {
    label: "Frontend",
    skills: [
      { id: "react",      name: "React",       color: "#61DAFB", icon: "fab fa-react",      years: 4, desc: "Expert-level React — Hooks, Context API, Redux Toolkit, Next.js, performance optimisation, and component design patterns." },
      { id: "angular",    name: "Angular",     color: "#DD0031", icon: "fab fa-angular",    years: 3, desc: "Enterprise Angular apps — RxJS, Angular Material, reactive forms, lazy modules, and NgRx state management." },
      { id: "typescript", name: "TypeScript",  color: "#3178C6", icon: null,                years: 4, desc: "Strict typing across full-stack projects — generics, decorators, interface-driven design, and type guards." },
      { id: "html",       name: "HTML5",       color: "#E34F26", icon: "fab fa-html5",      years: 5, desc: "Semantic, accessible HTML5 markup — well-structured, SEO-friendly, and human readable." },
      { id: "css",        name: "CSS3",        color: "#1572B6", icon: "fab fa-css3-alt",   years: 5, desc: "CSS3, Flexbox, Grid, animations, and responsive design — experienced with styled-components and CSS Modules." },
      { id: "redux",      name: "Redux / RTK", color: "#764ABC", icon: null,                years: 4, desc: "Redux and Redux Toolkit for predictable state management — actions, reducers, selectors, and middleware." },
    ]
  },
  {
    label: "Backend",
    skills: [
      { id: "nodejs",  name: "Node.js",     color: "#68A063", icon: "fab fa-node-js", years: 3, desc: "RESTful APIs and microservices with Node.js and Express — auth, middleware, JWT, and scalable architecture." },
      { id: "nestjs",  name: "NestJS",      color: "#E0234E", icon: null,             years: 2, desc: "Enterprise-grade NestJS APIs — dependency injection, guards, interceptors, TypeORM, and modular architecture." },
      { id: "express", name: "Express.js",  color: "#aaaaaa", icon: null,             years: 3, desc: "REST API design with Express — routing, middleware, error handling, and integration with MongoDB / PostgreSQL." },
    ]
  },
  {
    label: "Database",
    skills: [
      { id: "mongodb",  name: "MongoDB",    color: "#47A248", icon: null, years: 4, desc: "NoSQL schema design, aggregation pipelines, Mongoose ORM, and optimised queries for production applications." },
      { id: "postgres", name: "PostgreSQL", color: "#336791", icon: null, years: 3, desc: "Relational database design, SQL queries, migrations, and TypeORM-based workflows for structured data." },
      { id: "mysql",    name: "MySQL",      color: "#4479A1", icon: null, years: 3, desc: "MySQL for relational data storage — schema design, indexing, query optimisation, and ORM integration." },
    ]
  },
  {
    label: "Tools & DevOps",
    skills: [
      { id: "git",    name: "Git / GitHub",     color: "#F05032", icon: "fab fa-github",   years: 5, desc: "Branching strategies, pull requests, code reviews, and collaborative workflows on GitHub." },
      { id: "docker", name: "Docker",           color: "#2496ED", icon: "fab fa-docker",   years: 2, desc: "Containerisation with Docker — Dockerfiles, Compose, and environment consistency across dev and prod." },
      { id: "ci",     name: "GitHub Actions",   color: "#2088FF", icon: null,              years: 2, desc: "CI/CD pipelines with GitHub Actions — automated testing, linting, and deployment workflows." },
      { id: "agile",  name: "Agile / Scrum",    color: "#ffb74d", icon: null,              years: 4, desc: "Scrum methodology, sprint planning, Jira, and cross-functional team collaboration." },
    ]
  },
];

const experience = [
  {
    company: "Compumetrics Solutions Ltd",
    position: "Full-Stack Developer",
    period: "Dec 2022 – Present",
    type: "Hybrid",
    desc: "Collaborating with a team of developers to conceptualise and execute applications using React, Angular, and TypeScript for enterprise clients.",
    bullets: [
      "Achieved a 20% reduction in page load times through asset optimisation and lazy loading",
      "Redesigned user role system from role-based to granular permission-based, improving security",
      "Contributed to code reviews and best practice adherence across the team",
    ],
    tech: ["React", "Angular", "TypeScript", "Node.js", "Redux"]
  },
  {
    company: "Hero Technology Ltd (EagleApp)",
    position: "Full-Stack Developer",
    period: "Aug 2022 – Dec 2022",
    type: "Hybrid",
    desc: "Led an Agile team building microservices-based applications in React, Node.js, and Express under the Scrum framework.",
    bullets: [
      "Led microservices-based application design and implementation",
      "Mentored junior developers in software development best practices",
      "Participated in code reviews, maintaining high team code quality",
    ],
    tech: ["React", "Node.js", "Express.js", "Microservices", "Scrum"]
  },
  {
    company: "3reen Ltd",
    position: "Frontend Developer",
    period: "Nov 2020 – Mar 2021",
    type: "Remote",
    desc: "Collaborated with designers and developers to build an e-commerce startup store.",
    bullets: [
      "Built complex layouts with React and styled-components",
      "Engineered state management with Redux and hooks",
      "Converted Figma prototypes directly into production-ready code",
    ],
    tech: ["React", "styled-components", "Redux", "Figma", "CSS3"]
  },
  {
    company: "Freelance",
    position: "Web Developer",
    period: "Aug 2019",
    type: "Remote",
    desc: "Worked independently and in teams to build and optimise websites for clients.",
    bullets: [
      "Optimised web performance, decreasing page load times",
      "Developed and maintained client websites",
    ],
    tech: ["JavaScript", "HTML5", "CSS3", "React"]
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
const sectionVariants = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const jobVariants = {
  hidden:  { opacity: 0, x: -12 },
  visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.08, duration: 0.3 } }),
};

export default function Skills() {
  const [activeTab, setActiveTab] = useState("skills");
  const [activeSkill, setActiveSkill] = useState(null);

  const handleChip = (skill) => {
    setActiveSkill(prev => (prev?.id === skill.id ? null : skill));
  };

  return (
    <PageLayout title="Skills / Experience" maxWidth="900px">
      <PageWrap
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Tab selector */}
        <TabBar>
          {["skills", "experience"].map(t => (
            <Tab
              key={t}
              $active={activeTab === t}
              onClick={() => { setActiveTab(t); setActiveSkill(null); }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              {t === "skills" ? "Technical Skills" : "Work Experience"}
            </Tab>
          ))}
        </TabBar>

        <AnimatePresence mode="wait">

          {/* ── SKILLS TAB ─────────────────────────────────────────────── */}
          {activeTab === "skills" && (
            <motion.div
              key="skills"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10, transition: { duration: 0.18 } }}
            >
              {/* Skill detail panel */}
              <AnimatePresence>
                {activeSkill && (
                  <DetailCard
                    key={activeSkill.id}
                    $color={activeSkill.color}
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    <DetailName $color={activeSkill.color}>
                      {activeSkill.name}
                      <span style={{ fontSize: "0.7rem", marginLeft: "0.6rem", color: "rgba(255,255,255,0.3)", fontWeight: 400 }}>
                        {activeSkill.years}+ yrs
                      </span>
                    </DetailName>
                    {activeSkill.desc}
                  </DetailCard>
                )}
              </AnimatePresence>

              {/* Skill categories */}
              {skillCategories.map((cat, ci) => (
                <CategoryGroup
                  key={cat.label}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: ci * 0.07, duration: 0.3 }}
                >
                  <CategoryLabel>{cat.label}</CategoryLabel>
                  <ChipRow>
                    {cat.skills.map(skill => (
                      <Chip
                        key={skill.id}
                        $color={skill.color}
                        data-active={activeSkill?.id === skill.id}
                        onClick={() => handleChip(skill)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {skill.icon && <i className={skill.icon} />}
                        {skill.name}
                      </Chip>
                    ))}
                  </ChipRow>
                </CategoryGroup>
              ))}
            </motion.div>
          )}

          {/* ── EXPERIENCE TAB ─────────────────────────────────────────── */}
          {activeTab === "experience" && (
            <motion.div
              key="experience"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10, transition: { duration: 0.18 } }}
            >
              <Timeline>
                {experience.map((job, i) => (
                  <Job
                    key={job.company}
                    custom={i}
                    variants={jobVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <JobHeader>
                      <div>
                        <JobTitle>{job.position}</JobTitle>
                        <JobCompany>{job.company} · {job.type}</JobCompany>
                      </div>
                      <JobPeriod>{job.period}</JobPeriod>
                    </JobHeader>

                    <JobDesc>{job.desc}</JobDesc>

                    <BulletList>
                      {job.bullets.map((b, bi) => (
                        <Bullet key={bi}>{b}</Bullet>
                      ))}
                    </BulletList>

                    <TechRow>
                      {job.tech.map(t => (
                        <TechPill key={t}>{t}</TechPill>
                      ))}
                    </TechRow>
                  </Job>
                ))}
              </Timeline>

              {/* Education */}
              <EduBox
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.3 }}
              >
                <div style={{ fontSize: "0.6rem", letterSpacing: "3px", color: "rgba(255,255,255,0.3)", marginBottom: "0.6rem" }}>
                  EDUCATION
                </div>
                <EduTitle>Bachelor of Science — Computer Science</EduTitle>
                <EduSub>University of Nigeria, Nsukka</EduSub>
              </EduBox>
            </motion.div>
          )}

        </AnimatePresence>
      </PageWrap>
    </PageLayout>
  );
}
