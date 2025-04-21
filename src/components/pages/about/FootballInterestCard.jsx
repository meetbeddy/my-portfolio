import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Volleyball } from "lucide-react";

const InterestCard = styled(motion.div)`
  background: ${props => props.bgColor || props.theme.colors.surface};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borders.radius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  transition: ${props => props.theme.animation.durations.medium} ${props => props.theme.animation.easings.easeInOut};
  
  &:hover {
    transform: translateY(-0.25rem);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const InterestTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  margin-bottom: ${props => props.theme.spacing.sm};
  display: flex;
  align-items: center;
`;

const GameContainer = styled(motion.div)`
  background-color: rgba(0,100,0,0.2);
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  border: 2px solid rgba(255,255,255,0.1);
  position: relative;
  height: 200px;
  overflow: hidden;
`;

const SoccerField = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(to bottom, rgba(0,80,0,0.5), rgba(0,140,0,0.3));
  z-index: 0;
`;

const FieldMarkings = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10%;
  right: 10%;
  height: 70px;
  border: 2px solid rgba(255,255,255,0.5);
  border-bottom: none;
`;

const FieldPenaltyBox = styled.div`
  position: absolute;
  bottom: 10px;
  left: 40%;
  right: 40%;
  height: 30px;
  border: 2px solid rgba(255,255,255,0.5);
  border-bottom: none;
`;

const Goal = styled.div`
  position: absolute;
  bottom: 10px;
  left: 25%;
  right: 25%;
  height: 60px;
  border-top: 4px solid white;
  border-left: 4px solid white;
  border-right: 4px solid white;
  z-index: 1;
`;

const Goalkeeper = styled(motion.div)`
  position: absolute;
  bottom: 20px;
  width: 40px;
  height: 60px;
  background-image: linear-gradient(to bottom, #ff0000, #aa0000);
  border-radius: 10px 10px 0 0;
  z-index: 1;
`;

const GoalkeeperHead = styled.div`
  position: absolute;
  top: -15px;
  left: 5px;
  width: 30px;
  height: 30px;
  background-color: #ffdbac;
  border-radius: 50%;
`;

const GoalkeeperArm = styled.div`
  position: absolute;
  top: 10px;
  width: 20px;
  height: 5px;
  background-color: #dd0000;
  border-radius: 3px;
  z-index: 2;
`;

const LeftArm = styled(GoalkeeperArm)`
  left: -15px;
`;

const RightArm = styled(GoalkeeperArm)`
  right: -15px;
`;

const Ball = styled(motion.div)`
  position: absolute;
  bottom: 30px;
  left: calc(50% - 15px);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: white;
  background-image: radial-gradient(circle at 30% 30%, white, #888);
  z-index: 2;
  cursor: grab;
`;

const Instructions = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 3;
  font-size: 0.8rem;
  background-color: rgba(0,0,0,0.7);
  padding: 4px 8px;
  border-radius: 4px;
  color: white;
`;

const Scoreboard = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0,0,0,0.7);
  color: white;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  z-index: 3;
`;

const ResultMessage = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${props => props.isGoal ? 'rgba(0,128,0,0.8)' : 'rgba(220,0,0,0.8)'};
  color: white;
  font-weight: bold;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 1.2rem;
  z-index: 10;
`;

const FootballInterestCard = ({ bgColor }) => {
    const [score, setScore] = useState(0);
    const [saves, setSaves] = useState(0);
    const [isGoal, setIsGoal] = useState(false);
    const [isSave, setIsSave] = useState(false);
    const [ballPosition, setBallPosition] = useState({ x: 0, y: 0 });
    const [goalkeeperPosition, setGoalkeeperPosition] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Randomize goalkeeper position periodically
    useEffect(() => {
        const interval = setInterval(() => {
            setGoalkeeperPosition(Math.random() * 100 - 50);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleDragEnd = (_, info) => {
        if (isAnimating) return;

        setIsAnimating(true);
        // Store the ball position for animation
        setBallPosition({ x: info.offset.x, y: info.offset.y });

        // Check if it's a goal or save
        const isWithinGoal = Math.abs(info.offset.x) < 80 && info.offset.y < -40;
        const isBlockedByGoalkeeper = Math.abs(info.offset.x - goalkeeperPosition) < 30 && info.offset.y < -30;

        if (isWithinGoal && !isBlockedByGoalkeeper) {
            // It's a goal!
            setIsGoal(true);
            setScore(prev => prev + 1);
            setTimeout(() => {
                setIsGoal(false);
                setBallPosition({ x: 0, y: 0 });
                setIsAnimating(false);
            }, 1500);
        } else if (isBlockedByGoalkeeper) {
            // Goalkeeper saved it!
            setIsSave(true);
            setSaves(prev => prev + 1);
            setTimeout(() => {
                setIsSave(false);
                setBallPosition({ x: 0, y: 0 });
                setIsAnimating(false);
            }, 1500);
        } else {
            // Missed the goal
            setTimeout(() => {
                setBallPosition({ x: 0, y: 0 });
                setIsAnimating(false);
            }, 1000);
        }
    };

    // Handle click/tap on the field
    const handleFieldClick = (e) => {
        if (isAnimating) return;

        const field = e.currentTarget;
        const rect = field.getBoundingClientRect();

        // Calculate click position relative to the center bottom (where the ball starts)
        const x = e.clientX - rect.left - rect.width / 2;
        const y = -(e.clientY - rect.bottom + 30);

        // Simulate drag end with the calculated position
        handleDragEnd(null, { offset: { x, y } });
    };

    return (
        <InterestCard bgColor={bgColor}>
            <InterestTitle>
                <Volleyball style={{
                    marginRight: '0.5rem',
                    color: '#4a9fff'
                }} size={20} /> Football
            </InterestTitle>
            <p>Don't judge the "bulk" though — I'm more about the hustle on the field. Football keeps me balanced when I'm not coding.</p>

            {/* Football Mini-Game */}
            <div style={{ marginTop: '1rem' }}>
                <h4 style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <motion.div
                        animate={{ rotate: [0, 20, 0, -20, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        style={{ marginRight: '8px', fontSize: '1.2rem' }}
                    >
                        ⚽
                    </motion.div>
                    Interactive Penalty Game
                </h4>

                {/* Football penalty mini-game */}
                <GameContainer
                    whileHover={{
                        boxShadow: '0 8px 15px rgba(0,0,0,0.3)'
                    }}
                    onClick={handleFieldClick}
                >
                    {/* Soccer field background */}
                    <SoccerField>
                        <FieldMarkings />
                        <FieldPenaltyBox />
                    </SoccerField>

                    {/* Goal */}
                    <Goal />

                    {/* Scoreboard */}
                    <Scoreboard>
                        <div>Goals: {score}</div>
                        <div>Saves: {saves}</div>
                    </Scoreboard>

                    {/* Goalkeeper */}
                    <Goalkeeper
                        animate={{ x: goalkeeperPosition }}
                        transition={{ type: "spring", stiffness: 100 }}
                    >
                        <GoalkeeperHead />
                        <LeftArm />
                        <RightArm />
                    </Goalkeeper>

                    {/* Interactive football */}
                    <Ball
                        drag={!isAnimating}
                        dragConstraints={{
                            top: -150,
                            left: -100,
                            right: 100,
                            bottom: 0
                        }}
                        dragElastic={0.7}
                        whileDrag={{ scale: 1.2 }}
                        dragTransition={{ bounceStiffness: 600, bounceDamping: 10 }}
                        onDragEnd={handleDragEnd}
                        animate={{
                            x: ballPosition.x,
                            y: ballPosition.y,
                            rotate: isAnimating ? 360 : 0
                        }}
                        transition={{
                            type: isAnimating ? "spring" : "tween",
                            duration: isAnimating ? 0.5 : 0
                        }}
                    >
                        {!isAnimating && (
                            <div style={{
                                position: 'absolute',
                                fontSize: '0.6rem',
                                width: '100%',
                                textAlign: 'center',
                                top: '8px',
                                fontWeight: 'bold'
                            }}>
                                DRAG
                            </div>
                        )}
                    </Ball>

                    {/* Result messages */}
                    {isGoal && (
                        <ResultMessage
                            isGoal={true}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            GOAL!
                        </ResultMessage>
                    )}

                    {isSave && (
                        <ResultMessage
                            isGoal={false}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            SAVED!
                        </ResultMessage>
                    )}

                    <Instructions>
                        Drag the ball or click anywhere to shoot!
                    </Instructions>
                </GameContainer>
            </div>
        </InterestCard>
    );
};

export default FootballInterestCard;