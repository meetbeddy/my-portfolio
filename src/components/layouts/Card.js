import React from "react";
import { BouncyButton } from "../button/Button";
import "./card.css";

function Card(props) {
  const { location } = props;
  return (
    <div className="display-card">
      <p className="card-text">
        <i className="fas fa-map-marker-alt"></i>
        {""} {location.address}
      </p>
      <p className="card-text">
        <i className="fas fa-phone-square"></i>
        {""}
        {location.phone}
      </p>
      <div className="social-icons">
        <BouncyButton>
          <i className="fab fa-twitter-square"></i>
        </BouncyButton>
        <BouncyButton style={{ animationDelay: "0.07s" }}>
          <i className="fab fa-linkedin"></i>
        </BouncyButton>
        <BouncyButton style={{ animationDelay: "0.14s" }}>
          <i className="fab fa-github-square"></i>
        </BouncyButton>
        <BouncyButton style={{ animationDelay: "0.21s" }}>
          <i className="fab fa-facebook-square"></i>
        </BouncyButton>
      </div>
    </div>
  );
}

export default Card;
