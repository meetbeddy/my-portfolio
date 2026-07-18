import React from "react";
import ContactForm from "./ContactForm";
import PageLayout from "../../layouts/PageLayout";
import { LeftColumn, PageParagraph, TwoColumnLayout } from "../../shared/StyledComponents";
import { TextAreaVariants } from "../../animations";



export default function Contact() {
  return (
    <PageLayout title="Let's get in touch" maxWidth="800px">
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
      </TwoColumnLayout>
    </PageLayout>)
}
