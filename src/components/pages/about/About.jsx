import React from "react";
import { motion } from "framer-motion";
import PageLayout from "../../layouts/PageLayout";
import { PageParagraph, StyledButton, SubTitle } from "../../shared/StyledComponents";
import { TextAreaVariants } from "../../animations";


export default function About() {
  return (
    <PageLayout title="About me" maxWidth="800px">
      <motion.div variants={TextAreaVariants}>
        <SubTitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          I'm a Web Developer currently based in Abuja, Nigeria.
        </SubTitle>

        <PageParagraph
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          I'm passionate about developing beautiful and intuitive web designs
          into magnificent and functional websites, whether it's for
          individuals, small businesses, or large corporations. I specialize in
          semantic markups, CSS, Javascript, and all aspects of frontend
          development. I'm currently open to remote opportunities and working on
          enterprising projects.
          <br /><br />
          When I'm not coding and listening to indie-pop songs, I enjoy
          connecting with people and sharing experiences. I'm a huge football
          fan, and occasionally, you could find me pulling my not so significant
          bulk around in the football field with friends.
        </PageParagraph>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          <a
            href="https://drive.google.com/file/d/1GG_Q7PrssF2dtY8D5zc4ThWdwDBXun5H/view?usp=sharing"
            rel="noreferrer"
            target="_blank"
          >
            <StyledButton as="a">My Resume</StyledButton>
          </a>
        </motion.div>
      </motion.div>
    </PageLayout>
  );
}
