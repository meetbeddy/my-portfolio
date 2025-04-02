import React from "react";
import SkillsCard from "./SkillsCard";
import { PageParagraph, TwoColumnLayout, LeftColumn, RightColumn } from "../../shared/StyledComponents";
import PageLayout from "../../layouts/PageLayout";
import { RightBoxVariants, TextAreaVariants } from "../../animations";


export default function Skills() {
  return (
    <PageLayout title="Skills / Experience">
      <TwoColumnLayout>
        <LeftColumn variants={TextAreaVariants}>
          <PageParagraph
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            My main area of expertise is in frontend development. I'm passionate
            about user experience, visualization, and animations. I build web apps
            using HTML, CSS, and Javascript as well as JS Frameworks like React.
            <br /><br />
            I have backend experience with Node.js and have built CRUD
            applications using Express.js. I'm currently exploring 3D computer graphics
            with Three.js to create immersive web experiences.
            <br /><br />
            I'm also an Electron and React Native enthusiast, always
            seeking to improve my skills in cross-platform development to deliver
            seamless experiences across all devices.
          </PageParagraph>
        </LeftColumn>

        <RightColumn variants={RightBoxVariants}>
          <SkillsCard />
        </RightColumn>
      </TwoColumnLayout>
    </PageLayout>
  );
}
