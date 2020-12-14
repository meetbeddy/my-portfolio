import React from "react";
import CardContent from "./CardContent";
import Flippy from "react-flippy";

const FlippyStyle = {
  width: "250px",
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
