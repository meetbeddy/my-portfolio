import React from "react";
import { FrontSide, BackSide } from "react-flippy";
import { motion } from "framer-motion";
import { BouncyButton } from "../../button/Button";

const buttonStyle = {
  backgroundColor: "transparent",
  width: "10px",
  border: "0",
  position: "absolute",
  left: "80%",
  top: "85%",
};

const CardContent = (props) => {
  return (
    <React.Fragment>
      <FrontSide
        style={{
          backgroundColor: "white",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            border: "1px solid silver",
            height: "220px",
            width: "220px",
            marginBottom: "20px",
            overflow: " hidden",
          }}
        >
          <img
            src={props.imageUrl}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>

        <p>{props.title}</p>
        <button
          onClick={() => {
            props.handleFlip();
          }}
          style={buttonStyle}
        >
          <motion.i
            whileHover={{ scale: 1.5 }}
            animate={{ rotateX: 360 }}
            transition={{ type: "spring", stiffness: 500, duration: 2 }}
            className="fas fa-info-circle fa-sm"
          ></motion.i>
        </button>
      </FrontSide>
      <BackSide
        style={{
          backgroundColor: "#EB6864",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <h5 style={{}}>{props.title}</h5>
        <div
          style={{
            border: "1px solid silver",
            height: "220px",
            width: "220px",
            marginBottom: "28px",
            textAlign: "center",
            overflow: " hidden",
          }}
        >
          <p>{props.description}</p>
        </div>

        <span
          style={{
            position: "absolute",
            bottom: "2px",
            left: "0vw",
            width: "50%",
          }}
        >
          <button
            onClick={() => {
              props.handleFlip();
            }}
            style={{
              backgroundColor: "transparent",
              width: "10px",
              border: "0",
            }}
          >
            <motion.i
              className="far fa-arrow-alt-circle-left"
              whileHover={{ scale: 1.5 }}
              animate={{ rotate: 360 }}
              transition={{ type: "spring", stiffness: 500, duration: 2 }}
            ></motion.i>
          </button>
        </span>
        <span
          style={{
            position: "absolute",
            bottom: "2px",
            right: "1vw",
            width: "50%",
          }}
        >
          <BouncyButton> visit</BouncyButton>
        </span>
      </BackSide>
    </React.Fragment>
  );
};

export default CardContent;
