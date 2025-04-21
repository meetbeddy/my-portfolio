import React, { useState } from "react";
import PageLayout from "../../layouts/PageLayout";
import { StyledButton } from "../../shared/StyledComponents";
import { motion } from "framer-motion";
import TabContainer from "../../shared/TabContainer";
import IntroSection from "./IntroSection";
import SkillsSection from "./SkillSection";
import StorySection from "./StorySection";
import InterestsSection from "./InterestSection";

export default function About() {
    const [activeSection, setActiveSection] = useState("intro");

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    return (
        <PageLayout title="About me" maxWidth="900px">
            <TabContainer
                activeSection={activeSection}
                onTabChange={handleSectionChange}
                tabs={["intro", "skills", "story", "interests"]}
            />

            {activeSection === "intro" && <IntroSection />}
            {activeSection === "skills" && <SkillsSection />}
            {activeSection === "story" && <StorySection />}
            {activeSection === "interests" && <InterestsSection />}

            {activeSection === "intro" && (
                <motion.div
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
                </motion.div>
            )}
        </PageLayout>
    );
}