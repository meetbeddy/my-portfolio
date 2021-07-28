import { FlexWrapper, TextSpan } from "../../layouts/StyledContainers";
import { Button } from "../../button/Button";

const ContainerVariants = {
  initial: { opacity: 0, x: "100vw" },
  visible: {
    opacity: 1,
    x: 0,
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
const TextAreaVariants = {
  initial: { x: "-100vw" },
  visible: { x: 0, transition: { type: "tween", duration: 1, delay: 1 } },
};

export default function About() {
  return (
    <FlexWrapper
      variants={ContainerVariants}
      initial="initial"
      animate="visible"
      exit="exit"
    >
      <div className="top">
        <h1>About me</h1>
      </div>
      <div className="bottom">
        <h1>About me</h1>
      </div>

      <TextSpan variants={TextAreaVariants}>
        <h5 style={{ fontSize: "1.4em", color: "#f5b7b3" }}>
          I'm a Web Developer currently based in Abuja, Nigeria.
        </h5>
        <p>
          {" "}
          I'm passionate about developing beautiful and intuitive web designs
          into magnificent and functional websites, whether it's for
          individuals, small businesses, or large corporations. I specialize in
          semantic markups, CSS, Javascript, and all aspects of frontend
          development. I'm currently open to remote opportunities and working on
          enterprising projects.
          <br />
          When I'm not coding and listening to indie-pop songs, I enjoy
          connecting with people and sharing experiences. I'm a huge football
          fan, and occasionally, you could find me pulling my not so significant
          bulk around in the football field with friends.
        </p>
        <a
          href="https://drive.google.com/file/d/1GG_Q7PrssF2dtY8D5zc4ThWdwDBXun5H/view?usp=sharing"
          rel="noreferrer"
          target="_blank"
        >
          <Button>My Resume</Button>
        </a>
      </TextSpan>
    </FlexWrapper>
  );
}
