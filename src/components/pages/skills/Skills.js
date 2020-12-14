import React from "react";
import {
  FlexWrapper,
  RightBox,
  TextSpan,
} from "../../layouts/StyledContainers";
import SkillsCard from "./SkillsCard";

const ContainerVariants = {
  initial: { opacity: 0, x: "100vw" },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      delay: 1,
      duration: 1.5,
    },
  },
  exit: {
    x: "-100vw",
    transition: {
      ease: "easeInOut",
    },
  },
};
const TextAreaVariants = {
  initial: { x: "-100vw" },
  visible: { x: 0, transition: { type: "tween", duration: 1, delay: 1 } },
};
const RightBoxVariants = {
  initial: { y: "100vw" },
  visible: { y: 0, transition: { delay: 2.3, ease: "easeOut" } },
};

export default function Skils() {
  return (
    <FlexWrapper
      variants={ContainerVariants}
      initial="initial"
      animate="visible"
      exit="exit"
    >
      <div className="top">
        <h1>Skills / Experience</h1>
      </div>
      <div className="bottom">
        <h1> Skills / Experience</h1>
      </div>

      <TextSpan variants={TextAreaVariants}>
        <p>
          My main area of expertise is in frontend development. I'm passionate
          about user experience, visualization, and animations. I build web apps
          using HTML, CSS, and Javascript as well Js Framework like React js. I
          have backend experience with Node js and have built simple CRUD
          applications using Express Js. I'm currently learning to create and
          display animated 3D computer graphics in web browsers with Three Js.
          In the future, I'd like to dabble in mobile app development and
          desktop app development.
        </p>
      </TextSpan>
      <RightBox variants={RightBoxVariants}>
        <SkillsCard />
      </RightBox>
    </FlexWrapper>
  );
}
