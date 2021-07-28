import React from "react";
import WorkCards from "./WorkCards";
import { FlexWrapper, FlexContainer } from "../../layouts/StyledContainers";

const ContainerVariants = {
  initial: { opacity: 0 },
  visible: {
    opacity: 1,

    transition: {
      delay: 0.5,
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

const projectVariants = {
  initial: { x: "-100vw" },
  visible: { x: 0, transition: { type: "tween", duration: 1, delay: 1 } },
};

export default function Work() {
  return (
    <FlexWrapper
      variants={ContainerVariants}
      initial="initial"
      animate="visible"
      exit="exit"
    >
      <div className="top">
        <h1> Projects</h1>
      </div>
      <div className="bottom">
        <h1>Projects</h1>
      </div>
      <FlexContainer variants={projectVariants}>
        <WorkCards />
      </FlexContainer>
    </FlexWrapper>
  );
}
