import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Coffee } from "lucide-react";

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

const CoffeeInterestCard = ({ bgColor, coffeeCount, setCoffeeCount }) => {
    return (
        <InterestCard bgColor={bgColor}>
            <InterestTitle>
                <motion.div
                    whileHover={{ rotate: [0, -10, 20, -10, 0] }}
                    transition={{ duration: 0.5 }}
                >
                    <Coffee
                        style={{
                            marginRight: '0.5rem',
                            color: '#4a9fff'
                        }}
                        size={20}
                    />
                </motion.div>
                <span>Coffee</span>
            </InterestTitle>
            <p>Essential fuel for coding sessions.</p>

            {/* Enhanced Coffee Interactive Brewing Station */}
            <motion.div
                style={{
                    backgroundColor: 'rgba(103, 65, 35, 0.3)',
                    borderRadius: '12px',
                    padding: '16px 12px',
                    marginTop: '16px',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '2px solid rgba(139, 69, 19, 0.4)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '16px', fontWeight: 'bold' }}>
                    Virtual Coffee Brewing Station
                </div>

                {/* Coffee Machine */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    position: 'relative',
                    height: '120px',
                    marginBottom: '16px'
                }}>
                    {/* Coffee Machine Body */}
                    <div style={{
                        width: '80px',
                        height: '100px',
                        backgroundColor: '#222',
                        borderRadius: '8px 8px 4px 4px',
                        position: 'relative'
                    }}>
                        {/* Machine Display */}
                        <div style={{
                            position: 'absolute',
                            top: '15px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '50px',
                            height: '20px',
                            backgroundColor: '#333',
                            borderRadius: '4px',
                            border: '2px solid #444',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '0.8rem',
                            color: '#00ff00'
                        }}>
                            {coffeeCount}
                        </div>

                        {/* Coffee Spout */}
                        <div style={{
                            position: 'absolute',
                            bottom: '0',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '20px',
                            height: '15px',
                            backgroundColor: '#111',
                            borderRadius: '0 0 5px 5px'
                        }}></div>
                    </div>

                    {/* Coffee Cup */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCoffeeCount(count => count + 1)}
                        style={{
                            position: 'absolute',
                            bottom: '0',
                            width: '60px',
                            height: '70px',
                            borderRadius: '5px 5px 20px 20px',
                            background: 'linear-gradient(to right, #b98b56, #7d5a3c)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Cup Handle */}
                        <div style={{
                            position: 'absolute',
                            right: '-15px',
                            top: '20px',
                            width: '15px',
                            height: '30px',
                            borderRadius: '0 15px 15px 0',
                            borderTop: '5px solid #7d5a3c',
                            borderRight: '5px solid #7d5a3c',
                            borderBottom: '5px solid #7d5a3c'
                        }}></div>

                        {/* Coffee Level */}
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{
                                height: coffeeCount > 0 ? `${Math.min(coffeeCount * 7, 50)}px` : 0
                            }}
                            transition={{ type: 'spring', damping: 10 }}
                            style={{
                                width: '100%',
                                backgroundColor: '#3E2723',
                                borderRadius: '0 0 15px 15px'
                            }}
                        >
                            {/* Coffee Steam Animation */}
                            {coffeeCount > 0 && (
                                <div style={{ position: 'relative' }}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 0 }}
                                        animate={{
                                            opacity: [0, 0.7, 0],
                                            y: -20
                                        }}
                                        transition={{ duration: 2, repeat: Infinity, repeatType: 'loop' }}
                                        style={{
                                            position: 'absolute',
                                            left: '10px',
                                            top: '-20px',
                                            color: 'white',
                                            fontSize: '1.2rem',
                                            filter: 'blur(2px)'
                                        }}
                                    >
                                        ~
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 0 }}
                                        animate={{
                                            opacity: [0, 0.7, 0],
                                            y: -15
                                        }}
                                        transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, repeatType: 'loop' }}
                                        style={{
                                            position: 'absolute',
                                            left: '30px',
                                            top: '-20px',
                                            color: 'white',
                                            fontSize: '1.2rem',
                                            filter: 'blur(2px)'
                                        }}
                                    >
                                        ~
                                    </motion.div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                </div>

                <div style={{
                    textAlign: 'center',
                    fontSize: '0.8rem',
                    marginBottom: '8px'
                }}>
                    <strong>Click the cup to brew!</strong>
                </div>

                {/* Coffee Stats */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    padding: '8px',
                    borderRadius: '4px',
                    fontSize: '0.8rem'
                }}>
                    <div>Cups brewed: <strong>{coffeeCount}</strong></div>
                    <div>Caffeine: <strong>{coffeeCount * 95}mg</strong></div>
                </div>

                {/* Coffee Messages */}
                {coffeeCount > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ delay: 0.3 }}
                        style={{
                            marginTop: '12px',
                            padding: '8px',
                            backgroundColor: 'rgba(0,0,0,0.2)',
                            borderRadius: '4px',
                            fontSize: '0.85rem',
                            fontStyle: 'italic'
                        }}
                    >
                        {coffeeCount === 1 && "First cup of the day! Starting the engines... ☀️"}
                        {coffeeCount === 2 && "Getting warmed up. Ideas starting to flow."}
                        {coffeeCount === 3 && "Now we're talking! Perfect coding momentum."}
                        {coffeeCount === 4 && "Fingers flying across the keyboard now!"}
                        {coffeeCount === 5 && "Reaching optimal coding velocity..."}
                        {coffeeCount > 5 && coffeeCount <= 7 && "Is the code writing itself or is that the caffeine talking?"}
                        {coffeeCount > 7 && coffeeCount <= 10 && "I can hear colors and see sounds now. Debugging is a breeze!"}
                        {coffeeCount > 10 && "Okay, maybe we should switch to water now... My code is starting to look like hieroglyphics! 😅"}
                    </motion.div>
                )}
            </motion.div>
        </InterestCard>
    );
};

export default CoffeeInterestCard;