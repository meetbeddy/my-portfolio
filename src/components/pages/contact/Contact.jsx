import React from "react";
import ContactForm from "./ContactForm";
import PageLayout from "../../layouts/PageLayout";
import { LeftColumn, PageParagraph, RightColumn, TwoColumnLayout } from "../../shared/StyledComponents";
import { RightBoxVariants, TextAreaVariants } from "../../animations";



export default function Contact() {
  const location = {
    address: "Lugbe, FCT, Abuja.",
    phone: "+234 7064492675",
    lat: 8.9868,
    lng: 7.3626,
  };

  return (
    <PageLayout title="Let's get in touch">
      <TwoColumnLayout>
        <LeftColumn variants={TextAreaVariants} flex={1.5}>
          <PageParagraph
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            I am available for work and opportunities to collaborate with
            individuals, agencies, and companies. Feel free to send me an email
            or connect with me on social media.
          </PageParagraph>
          <ContactForm />
        </LeftColumn>

        {/* <RightColumn variants={RightBoxVariants}>
          <Card location={location} />
          
          <div style={{ marginTop: "20px", borderRadius: "8px", overflow: "hidden" }}>
            <Map location={location} zoomLevel={17} />
          </div>
         
        </RightColumn> */}
      </TwoColumnLayout>
    </PageLayout>)
}