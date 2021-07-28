import React from "react";
import CardContent from "./CardContent";
import Flippy from "react-flippy";
import {motion} from "framer-motion"

const FlippyStyle = {
  width: "350px",
  height: "250px",
  textAlign: "center",
  color: "black",
  margin: "5px",
};
function WorkCard(props) {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <Flippy
      isFlipped={isFlipped}
      flipDirection="horizontal"
      style={FlippyStyle}
      variants={props.variants}
     
    >
      <CardContent
        imageUrl={props.imageUrl}
        title={props.title}
        handleFlip={handleFlip}
        description={props.description}
        
      />
    </Flippy>
  );
}

export default WorkCard;
