import React, { Component } from "react";
import WorkCard from "./WorkCard";
import { Boxes } from "../../layouts/StyledContainers";

class WorkCards extends Component {
  constructor() {
    super();
    this.state = {
      projects: [
        {
          projectTitle: "YouTube Video Downloader",
          imgUrl: "/image/youtube.png",
          description:
            "Lorem ipsum dolor sit amet consectetur adipiscing elite",
          infoLink: "/projects/anthills",
          key: 1,
        },
        {
          projectTitle: "My Portfolio",
          imgUrl: "/image/my_portfolio.png",
          description:
            "Lorem ipsum dolor sit amet consectetur adipiscing elite",
          infoLink: "/projects/myportfolio",
          key: 2,
        },
        {
          projectTitle: "3reen Shop Admin Panel",
          imgUrl: "/image/3reen.png",
          description:
            "Lorem ipsum dolor sit amet consectetur adipiscing elite",
          infoLink: "/projects/justcakes",
          key: 3,
        },
        {
          projectTitle: "Technical Oath Aluminium Portfolio Site",
          imgUrl: "/image/technical_oath.png",

          description:
            "Lorem ipsum dolor sit amet consectetur adipiscing elite",
          infoLink: "/projects/shoppinglist",
          key: 4,
        },
        {
          projectTitle: "Weather App",
          imgUrl: "/image/weather_app.png",
          description:
            "Lorem ipsum dolor sit amet consectetur adipiscing elite",
          infoLink: "/projects/shoppinglist",
          key: 5,
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
        transition: { staggerChildren: 1.3 },
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
            <WorkCard
              title={project.projectTitle}
              imageUrl={project.imgUrl}
              description={project.description}
              variants={cardVariants}
            />
          );
        })}
      </Boxes>
    );
  }
}

export default WorkCards;
