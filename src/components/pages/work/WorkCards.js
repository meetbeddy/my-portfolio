import React, { Component } from "react";
import WorkCard from "./WorkCard";
import { Boxes, Frame } from "../../layouts/StyledContainers";

class WorkCards extends Component {
  constructor() {
    super();
    this.state = {
      projects: [
        {
          projectTitle: "Ant hills",
          imgUrl: "https://placedog.net/640/480?random",
          description:
            "Lorem ipsum dolor sit amet consectetur adipiscing elite",
          infoLink: "/projects/anthills",
          key: 1,
        },
        {
          projectTitle: "My Portfolio",
          imgUrl: "https://placedog.net/640/480?random",
          description:
            "Lorem ipsum dolor sit amet consectetur adipiscing elite",
          infoLink: "/projects/myportfolio",
          key: 2,
        },
        {
          projectTitle: "Just Cakes",
          imgUrl: "https://placedog.net/500/280",
          description:
            "Lorem ipsum dolor sit amet consectetur adipiscing elite",
          infoLink: "/projects/justcakes",
          key: 3,
        },
        {
          projectTitle: "shopping list",
          imgUrl: "https://via.placeholder.com/150",
          description:
            "Lorem ipsum dolor sit amet consectetur adipiscing elite",
          infoLink: "/projects/shoppinglist",
          key: 4,
        },
      ],
    };
  }

  render() {
    const { projects } = this.state;

    const frameVariants = {
      before: { opacity: 0 },
      after: {
        opacity: 1,
        transition: { staggerChildren: 1.5 },
      },
    };

    const cardVariants = {
      before: {
        opacity: 0,
        y: 40,
        transition: {
          type: "spring",
          damping: 16,
          stiffness: 200,
        },
      },
      after: {
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          damping: 16,
          stiffness: 200,
        },
      },
    };
    return (
      <Boxes variants={frameVariants} initial="before" animate="after">
        {projects.map((project) => {
          return (
            <Frame
              style={{ position: "relative" }}
              variants={cardVariants}
              key={project.key}
            >
              <WorkCard
                title={project.projectTitle}
                imageUrl={project.imgUrl}
                description={project.description}
              />
            </Frame>
          );
        })}
      </Boxes>
    );
  }
}

export default WorkCards;
