import React, { Component } from "react";
import ContactForm from "./ContactForm";

import {
  FlexWrapper,
  RightBox,
  TextSpan,
} from "../../layouts/StyledContainers";

import Card from "../../layouts/Card";
import Map from "../map/Map";

class Contact extends Component {
  state = {
    location: {
      address: "Lugbe, FCT, Abuja.",
      phone: "+234 7064492675",
      lat: 8.9868,
      lng: 7.3626,
    },
  };
  render() {
    const { location } = this.state;
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
        x: "-50vw",
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
      visible: { y: 0, transition: { delay: 2.3, ease: "easeInOut" } },
    };

    return (
      <FlexWrapper
        variants={ContainerVariants}
        initial="initial"
        animate="visible"
        exit="exit"
      >
        <div className="top">
          <h1>Lets get in touch</h1>
        </div>
        <div className="bottom">
          <h1>Lets get in touch</h1>
        </div>

        <TextSpan variants={TextAreaVariants}>
          <p>
            I am available for work and opportunities to collaborate with
            individuals, agencies, and companies. Feel free to send me an email
            or connect with me on social media.
          </p>
          <ContactForm />
        </TextSpan>

        <RightBox variants={RightBoxVariants}>
          <Card location={location} />

          {/* <div className="map-area">
            <Map location={location} zoomLevel={17} />
          </div> */}
        </RightBox>
      </FlexWrapper>
    );
  }
}

export default Contact;
