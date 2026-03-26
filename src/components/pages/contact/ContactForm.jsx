import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import "./contact-form.css";
import { ButtonSmall } from "../../button/Button";
import { StyledButton } from "../../shared/StyledComponents";

// Email validation
const emailRegex = RegExp(
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const toastifySuccess = () => {
    toast.success("Form sent!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      className: "submit-feedback success",
    });
  };

  const toastifyFail = () => {
    toast.error("Form failed to send!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      className: "submit-feedback fail",
    });
  };

  const validateForm = () => {
    // Check if there are any errors
    const hasErrors = Object.values(formErrors).some(error => error.length > 0);

    // Check if all fields are filled
    const allFieldsFilled = Object.values(formData).every(value => value.length > 0);

    return !hasErrors && allFieldsFilled;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate fields as they change
    let newFormErrors = { ...formErrors };

    switch (name) {
      case "name":
        newFormErrors.name = value.length < 1 ? "Please enter your name." : "";
        break;
      case "email":
        newFormErrors.email = emailRegex.test(value)
          ? ""
          : "Please enter a valid email address.";
        break;
      case "subject":
        newFormErrors.subject = value.length < 1 ? "Please enter a subject." : "";
        break;
      case "message":
        newFormErrors.message = value.length < 1 ? "Please enter a message" : "";
        break;
      default:
        break;
    }

    setFormErrors(newFormErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Handle form validation success
      const { name, email, subject, message } = formData;

      // Set template params
      const templateParams = {
        name,
        email,
        subject,
        message,
      };

      emailjs.send(
        "service_rf3rkxx",
        "template_6s1vmqn",
        templateParams,
        "user_l15dG16IIuwQ1yPxpgG5I"
      ).then(() => {
        toastifySuccess();
        resetForm();
      }).catch(() => {
        toastifyFail();
      });

      console.log(`
        --SUBMITTING--
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        Message: ${message}
      `);
    } else {
      // Handle form validation failure
      console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
      toastifyFail();
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  };

  return (
    <div className="contact-form">
      <form id="contact-form" onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="form-field">
            <input
              type="text"
              name="name"
              value={formData.name}
              className={`form-input ${formErrors.name.length > 0 ? "error" : ""}`}
              onChange={handleChange}
              placeholder="Name"
              noValidate
            />
            {formErrors.name.length > 0 && (
              <span className="error-message">{formErrors.name}</span>
            )}
          </div>

          <div className="form-field">
            <input
              type="email"
              name="email"
              value={formData.email}
              className={`form-input ${formErrors.email.length > 0 ? "error" : ""}`}
              onChange={handleChange}
              placeholder="Email"
              noValidate
            />
            {formErrors.email.length > 0 && (
              <span className="error-message">{formErrors.email}</span>
            )}
          </div>
        </div>

        <div className="form-grid">
          <div className="form-field">
            <input
              type="text"
              name="subject"
              value={formData.subject}
              className={`form-input ${formErrors.subject.length > 0 ? "error" : ""}`}
              onChange={handleChange}
              placeholder="Subject"
              noValidate
            />
            {formErrors.subject.length > 0 && (
              <span className="error-message">{formErrors.subject}</span>
            )}
          </div>

          <div className="form-field">
            <textarea
              rows="5"
              name="message"
              value={formData.message}
              className={`form-input ${formErrors.message.length > 0 ? "error" : ""}`}
              onChange={handleChange}
              placeholder="Message"
              noValidate
            />
            {formErrors.message.length > 0 && (
              <span className="error-message">{formErrors.message}</span>
            )}
          </div>
        </div>
        <StyledButton onClick={handleSubmit}>Submit</StyledButton>
        <ToastContainer />
      </form>
    </div>
  );
};

export default ContactForm;