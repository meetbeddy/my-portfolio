import React from "react";
import styled from "styled-components";
import Section from "../../shared/Section";
import { PageParagraph } from "../../shared/StyledComponents";

const Quote = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-left: 4px solid ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.md};
  font-style: italic;
  margin: ${props => props.theme.spacing.lg} 0;
`;

const Timeline = styled.div`
  position: relative;
  padding-left: ${props => props.theme.spacing.xl};
  
  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: ${props => props.theme.colors.surface};
  }
`;

const TimelineItem = styled.div`
  position: relative;
  padding-bottom: ${props => props.theme.spacing.xl};
  
  &:last-child {
    padding-bottom: 0;
  }
  
  &:before {
    content: "";
    position: absolute;
    left: -${props => props.theme.spacing.xl};
    top: 0;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background-color: ${props => props.theme.colors.primary};
    transform: translateX(-0.25rem);
  }
`;

const TimelineTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const StorySection = () => {
    return (
        <Section id="panel-story" ariaLabelledby="tab-story">
            <PageParagraph>
                I've spent the last few years building both the front and back ends of web apps, whether it's whipping up smooth interfaces with React, or building the server-side with Node.js and NestJS. I'm all about creating websites that don't just work, but feel right.
            </PageParagraph>

            <Quote>
                "At the end of the day, it's all about solving problems making things easier and more efficient for people, whether that's with a better user interface, a smoother backend, or just a system that actually works when you need it."
            </Quote>

            <Timeline>
                <TimelineItem>
                    <TimelineTitle>Where I Started</TimelineTitle>
                    <p>
                        My journey began with a fascination for how websites work, diving into HTML/CSS, and quickly discovering the endless possibilities of JavaScript.
                    </p>
                </TimelineItem>

                <TimelineItem>
                    <TimelineTitle>Where I Am</TimelineTitle>
                    <p>
                        Now I build complete web applications from concept to deployment, focusing on creating intuitive user experiences backed by solid, scalable architecture.
                    </p>
                </TimelineItem>

                <TimelineItem>
                    <TimelineTitle>Where I'm Going</TimelineTitle>
                    <p>
                        Always learning, always growing. I'm continuously exploring new technologies while mastering my current stack to craft better digital experiences. Lately, I've been diving into the world of 3D computer graphics with Three.js, creating immersive web environments that push the boundaries of what the browser can do.
                    </p>
                    <p>
                        At the same time, I'm an enthusiastic builder with Electron and React Native, constantly sharpening my skills in cross-platform development to deliver seamless, responsive experiences across all kinds of devices. Whether it's on the web, desktop, or mobile, I'm all about creating solutions that feel intuitive, polished, and purposeful.
                    </p>
                </TimelineItem>
            </Timeline>
        </Section>
    );
};

export default StorySection;