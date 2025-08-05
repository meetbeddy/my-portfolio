import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Circle } from "lucide-react";

const FootballInterestCard = ({ bgColor = "#1a1a1a" }) => {
    // Game state
    const [gameState, setGameState] = useState({
        score: 0,
        saves: 0,
        misses: 0,
        attempts: 0,
        isGoal: false,
        isSave: false,
        isMiss: false,
        ballPosition: { x: 50, y: 85 },
        goalkeeperPosition: 50,
        goalkeeperAnimation: 'idle',
        isAnimating: false,
        gamePhase: 'ready',
        aimTarget: { x: 50, y: 40 },
        showAimingLine: false,
        streak: 0,
        bestStreak: 0,
        power: 0,
        isCharging: false,
        maxPower: 100
    });

    const fieldRef = useRef(null);
    const powerChargeRef = useRef(null);

    // Destructure state for easier access
    const {
        score, saves, misses, attempts, isGoal, isSave, isMiss, ballPosition,
        goalkeeperPosition, goalkeeperAnimation, isAnimating, gamePhase, aimTarget,
        showAimingLine, streak, bestStreak, power, isCharging, maxPower
    } = gameState;

    // Constants for game configuration
    const GAME_CONFIG = {
        GOAL_BOUNDS: { minX: 25, maxX: 75, minY: 15, maxY: 50 },
        GOALKEEPER: {
            BASE_REACTION_TIME: 200,
            REACTION_VARIANCE: 150,
            REACH_THRESHOLD: 18,
            SAVE_PROBABILITY: 0.65,
            MOVEMENT_RANGE: { min: 42, max: 58 }
        },
        SHOT: {
            BASE_ACCURACY: 0.85,
            ACCURACY_VARIANCE: 0.15,
            POWER_ACCURACY_FACTOR: 0.3,
            RANDOMNESS: { x: 8, y: 4 }
        },
        POWER: {
            CHARGE_RATE: 2,
            MIN_POWER: 20,
            OPTIMAL_RANGE: { min: 60, max: 85 }
        },
        ANIMATION: {
            SHOT_DURATION: 600,
            RESULT_DISPLAY_TIME: 2500,
            GOALKEEPER_DIVE_DURATION: 400
        }
    };

    // Power charging mechanism
    useEffect(() => {
        if (isCharging) {
            powerChargeRef.current = setInterval(() => {
                setGameState(prev => {
                    const newPower = prev.power + GAME_CONFIG.POWER.CHARGE_RATE;
                    if (newPower >= maxPower) {
                        return { ...prev, power: maxPower };
                    }
                    return { ...prev, power: newPower };
                });
            }, 50);
        } else {
            if (powerChargeRef.current) {
                clearInterval(powerChargeRef.current);
            }
        }

        return () => {
            if (powerChargeRef.current) {
                clearInterval(powerChargeRef.current);
            }
        };
    }, [isCharging, maxPower]);

    // Goalkeeper AI movement - more realistic positioning
    useEffect(() => {
        if (!isAnimating && gamePhase === 'ready') {
            const interval = setInterval(() => {
                const centerBias = 0.3; // Tendency to stay near center
                const randomMove = Math.random() < centerBias
                    ? 45 + Math.random() * 10 // Stay central
                    : GAME_CONFIG.GOALKEEPER.MOVEMENT_RANGE.min +
                    Math.random() * (GAME_CONFIG.GOALKEEPER.MOVEMENT_RANGE.max - GAME_CONFIG.GOALKEEPER.MOVEMENT_RANGE.min);

                setGameState(prev => ({
                    ...prev,
                    goalkeeperPosition: randomMove,
                    goalkeeperAnimation: 'idle'
                }));
            }, 1500 + Math.random() * 1000);
            return () => clearInterval(interval);
        }
    }, [isAnimating, gamePhase]);

    // Calculate success percentage
    const successPercentage = attempts > 0 ? Math.round((score / attempts) * 100) : 0;

    // Reset game after shot with proper goalkeeper reset
    const resetGame = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            isGoal: false,
            isSave: false,
            isMiss: false,
            ballPosition: { x: 50, y: 85 },
            goalkeeperPosition: 50, // Reset to center
            goalkeeperAnimation: 'idle',
            isAnimating: false,
            gamePhase: 'ready',
            showAimingLine: false,
            power: 0,
            isCharging: false
        }));
    }, []);

    // Calculate shot physics based on power
    const calculateShotPhysics = (targetX, targetY, shotPower) => {
        // Power affects accuracy - too much or too little power reduces accuracy
        const powerEfficiency = shotPower < GAME_CONFIG.POWER.MIN_POWER ? 0.3 :
            (shotPower >= GAME_CONFIG.POWER.OPTIMAL_RANGE.min && shotPower <= GAME_CONFIG.POWER.OPTIMAL_RANGE.max) ? 1.0 :
                Math.max(0.4, 1.0 - (shotPower - GAME_CONFIG.POWER.OPTIMAL_RANGE.max) * 0.02);

        const accuracy = GAME_CONFIG.SHOT.BASE_ACCURACY * powerEfficiency;

        // Power affects shot deviation
        const powerDeviation = Math.max(0, (shotPower - GAME_CONFIG.POWER.OPTIMAL_RANGE.max) * 0.3);

        const finalX = targetX + (Math.random() - 0.5) * (GAME_CONFIG.SHOT.RANDOMNESS.x + powerDeviation) * (1 - accuracy);
        const finalY = targetY + (Math.random() - 0.5) * (GAME_CONFIG.SHOT.RANDOMNESS.y + powerDeviation) * (1 - accuracy);

        // Power affects shot speed (animation duration)
        const shotSpeed = Math.max(0.3, Math.min(1.2, shotPower / 70));
        const animationDuration = GAME_CONFIG.ANIMATION.SHOT_DURATION / shotSpeed;

        return { finalX, finalY, animationDuration, powerEfficiency };
    };

    // Execute penalty shot with realistic physics
    const executeShot = useCallback((targetX, targetY, shotPower) => {
        setGameState(prev => ({
            ...prev,
            isAnimating: true,
            attempts: prev.attempts + 1,
            gamePhase: 'shooting',
            isCharging: false
        }));

        const { finalX, finalY, animationDuration } = calculateShotPhysics(targetX, targetY, shotPower);

        // Update ball position with power-based animation
        setGameState(prev => ({ ...prev, ballPosition: { x: finalX, y: finalY } }));

        // Enhanced goalkeeper reaction based on shot direction and power
        const goalkeeperReactionTime = GAME_CONFIG.GOALKEEPER.BASE_REACTION_TIME +
            Math.random() * GAME_CONFIG.GOALKEEPER.REACTION_VARIANCE;

        setTimeout(() => {
            // Goalkeeper dive animation and positioning
            const diveDirection = finalX > 50 ? 'right' : finalX < 50 ? 'left' : 'center';
            let newGoalkeeperPos = goalkeeperPosition;
            let animation = 'idle';

            if (diveDirection === 'right') {
                newGoalkeeperPos = Math.min(70, goalkeeperPosition + 15);
                animation = 'dive-right';
            } else if (diveDirection === 'left') {
                newGoalkeeperPos = Math.max(30, goalkeeperPosition - 15);
                animation = 'dive-left';
            } else {
                animation = 'jump';
            }

            setGameState(prev => ({
                ...prev,
                goalkeeperPosition: newGoalkeeperPos,
                goalkeeperAnimation: animation
            }));
        }, goalkeeperReactionTime);

        // Determine result with enhanced logic
        setTimeout(() => {
            const isWithinGoal = finalX >= GAME_CONFIG.GOAL_BOUNDS.minX &&
                finalX <= GAME_CONFIG.GOAL_BOUNDS.maxX &&
                finalY >= GAME_CONFIG.GOAL_BOUNDS.minY &&
                finalY <= GAME_CONFIG.GOAL_BOUNDS.maxY;

            const goalkeeperReach = Math.abs(finalX - goalkeeperPosition) < GAME_CONFIG.GOALKEEPER.REACH_THRESHOLD;

            // Save probability affected by power and goalkeeper position
            const saveProbability = GAME_CONFIG.GOALKEEPER.SAVE_PROBABILITY *
                (goalkeeperReach ? 1.0 : 0.1) *
                (shotPower > 90 ? 0.7 : 1.0); // Harder to save powerful shots

            const isSaved = isWithinGoal && Math.random() < saveProbability;

            if (isWithinGoal && !isSaved) {
                // Goal scored
                setGameState(prev => ({
                    ...prev,
                    isGoal: true,
                    score: prev.score + 1,
                    streak: prev.streak + 1,
                    bestStreak: Math.max(prev.bestStreak, prev.streak + 1),
                    gamePhase: 'result'
                }));
            } else if (isSaved) {
                // Shot saved
                setGameState(prev => ({
                    ...prev,
                    isSave: true,
                    saves: prev.saves + 1,
                    streak: 0,
                    gamePhase: 'result'
                }));
            } else {
                // Missed
                setGameState(prev => ({
                    ...prev,
                    isMiss: true,
                    misses: prev.misses + 1,
                    streak: 0,
                    gamePhase: 'result'
                }));
            }

            setTimeout(resetGame, GAME_CONFIG.ANIMATION.RESULT_DISPLAY_TIME);
        }, animationDuration);
    }, [goalkeeperPosition, resetGame]);

    // Handle mouse down to start charging power
    const handleMouseDown = useCallback((e) => {
        if (isAnimating || gamePhase !== 'ready') return;

        const field = fieldRef.current;
        const rect = field.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // Only allow shooting in goal area
        const isInGoalArea = x >= GAME_CONFIG.GOAL_BOUNDS.minX &&
            x <= GAME_CONFIG.GOAL_BOUNDS.maxX &&
            y >= GAME_CONFIG.GOAL_BOUNDS.minY &&
            y <= GAME_CONFIG.GOAL_BOUNDS.maxY;

        if (isInGoalArea) {
            setGameState(prev => ({
                ...prev,
                aimTarget: { x, y },
                isCharging: true,
                power: 0
            }));
        }
    }, [isAnimating, gamePhase]);

    // Handle mouse up to execute shot
    const handleMouseUp = useCallback(() => {
        if (isCharging && gamePhase === 'ready') {
            executeShot(aimTarget.x, aimTarget.y, power);
        }
    }, [isCharging, gamePhase, aimTarget, power, executeShot]);

    // Handle mouse movement for aiming
    const handleMouseMove = useCallback((e) => {
        if (gamePhase === 'ready' && !isAnimating) {
            const field = fieldRef.current;
            const rect = field.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            const isInGoalArea = x >= GAME_CONFIG.GOAL_BOUNDS.minX &&
                x <= GAME_CONFIG.GOAL_BOUNDS.maxX &&
                y >= GAME_CONFIG.GOAL_BOUNDS.minY &&
                y <= GAME_CONFIG.GOAL_BOUNDS.maxY;

            setGameState(prev => ({
                ...prev,
                aimTarget: { x, y },
                showAimingLine: isInGoalArea && !prev.isCharging
            }));
        }
    }, [gamePhase, isAnimating]);

    // Handle mouse leave
    const handleMouseLeave = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            showAimingLine: false,
            isCharging: false,
            power: 0
        }));
    }, []);

    // Add global mouse up handler
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (isCharging) {
                handleMouseUp();
            }
        };

        document.addEventListener('mouseup', handleGlobalMouseUp);
        return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
    }, [isCharging, handleMouseUp]);

    // Calculate aiming line properties
    const aimingLineProperties = {
        height: Math.sqrt(
            Math.pow((aimTarget.x - 50) * 4, 2) +
            Math.pow((85 - aimTarget.y) * 4, 2)
        ),
        rotation: Math.atan2(
            (aimTarget.x - 50) * 4,
            (85 - aimTarget.y) * 4
        ) * 180 / Math.PI
    };

    return (
        <div style={{
            backgroundColor: bgColor,
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease'
        }}>
            <div style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                color: 'white'
            }}>
                <Circle style={{
                    marginRight: '0.5rem',
                    color: '#4a9fff'
                }} size={20} /> Football
            </div>

            <p style={{
                color: '#ccc',
                marginBottom: '1rem',
                fontSize: '0.9rem',
                lineHeight: '1.5'
            }}>
                Don't judge the "bulk" though — I'm more about the hustle on the field.
                Football keeps me balanced when I'm not coding.
            </p>

            <div style={{ marginTop: '1rem' }}>
                <h4 style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'white'
                }}>
                    <motion.div
                        animate={{ rotate: [0, 20, 0, -20, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        style={{ marginRight: '8px', fontSize: '1.2rem' }}
                    >
                        ⚽
                    </motion.div>
                    Realistic Penalty Shootout
                </h4>

                <div
                    ref={fieldRef}
                    style={{
                        position: 'relative',
                        background: 'linear-gradient(180deg, #2d5016 0%, #2a4a14 40%, #1f3810 100%)',
                        borderRadius: '8px',
                        cursor: gamePhase === 'ready' ? 'crosshair' : 'default',
                        height: '400px',
                        overflow: 'hidden',
                        userSelect: 'none',
                        border: '3px solid #ffffff',
                        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.3)',
                        backgroundImage: `
                            repeating-linear-gradient(90deg, 
                                transparent, transparent 40px, 
                                rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 42px)
                        `
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                >
                    {/* Field markings */}
                    <FieldMarkings />

                    {/* Enhanced Goalkeeper with animations */}
                    <EnhancedGoalkeeper
                        position={goalkeeperPosition}
                        animation={goalkeeperAnimation}
                    />

                    {/* Ball with realistic physics and shadow */}
                    <motion.div
                        animate={{
                            left: `${ballPosition.x}%`,
                            top: `${ballPosition.y}%`
                        }}
                        transition={{
                            duration: isAnimating ? 0.6 : 0,
                            ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                        style={{
                            position: 'absolute',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 4
                        }}
                    >
                        {/* Ball shadow */}
                        <div style={{
                            position: 'absolute',
                            top: '20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '12px',
                            height: '6px',
                            background: 'radial-gradient(ellipse, rgba(0,0,0,0.4), transparent)',
                            borderRadius: '50%',
                            zIndex: -1
                        }} />

                        {/* Ball */}
                        <motion.div
                            animate={isAnimating ? { rotate: 720 } : {}}
                            transition={{ duration: 0.6, ease: "linear" }}
                            style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '50%',
                                background: 'radial-gradient(circle at 30% 30%, #ffffff, #e0e0e0, #cccccc)',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.4), inset -2px -2px 4px rgba(0,0,0,0.2)',
                                border: '1px solid #999',
                                position: 'relative'
                            }}
                        >
                            {/* Ball pattern */}
                            <div style={{
                                position: 'absolute',
                                top: '2px',
                                left: '2px',
                                right: '2px',
                                bottom: '2px',
                                borderRadius: '50%',
                                background: `
                                    radial-gradient(circle at 25% 25%, transparent 20%, #000 21%, #000 22%, transparent 23%),
                                    radial-gradient(circle at 75% 25%, transparent 20%, #000 21%, #000 22%, transparent 23%),
                                    radial-gradient(circle at 50% 75%, transparent 20%, #000 21%, #000 22%, transparent 23%)
                                `
                            }} />
                        </motion.div>
                    </motion.div>

                    {/* Power meter */}
                    {isCharging && (
                        <PowerMeter power={power} maxPower={maxPower} />
                    )}

                    {/* Enhanced Aiming line with gradient */}
                    {showAimingLine && gamePhase === 'ready' && !isCharging && (
                        <div style={{
                            position: 'absolute',
                            left: '50%',
                            top: '85%',
                            width: '3px',
                            height: aimingLineProperties.height,
                            background: 'linear-gradient(to top, #ffff00, rgba(255,255,0,0.3))',
                            transformOrigin: 'top center',
                            transform: `translateX(-50%) rotate(${aimingLineProperties.rotation}deg)`,
                            zIndex: 2,
                            boxShadow: '0 0 8px rgba(255,255,0,0.8)',
                            borderRadius: '2px'
                        }} />
                    )}

                    {/* Enhanced Target crosshair */}
                    {(showAimingLine || isCharging) && gamePhase === 'ready' && (
                        <div style={{
                            position: 'absolute',
                            left: `${aimTarget.x}%`,
                            top: `${aimTarget.y}%`,
                            transform: 'translate(-50%, -50%)',
                            width: '24px',
                            height: '24px',
                            border: `3px solid ${isCharging ? '#ff4444' : '#ffff00'}`,
                            borderRadius: '50%',
                            zIndex: 3,
                            boxShadow: `0 0 12px ${isCharging ? 'rgba(255,68,68,0.8)' : 'rgba(255,255,0,0.8)'}`,
                            background: `radial-gradient(circle, ${isCharging ? 'rgba(255,68,68,0.1)' : 'rgba(255,255,0,0.1)'}, transparent)`
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '2px',
                                right: '2px',
                                height: '3px',
                                backgroundColor: isCharging ? '#ff4444' : '#ffff00',
                                transform: 'translateY(-50%)',
                                borderRadius: '2px'
                            }} />
                            <div style={{
                                position: 'absolute',
                                left: '50%',
                                top: '2px',
                                bottom: '2px',
                                width: '3px',
                                backgroundColor: isCharging ? '#ff4444' : '#ffff00',
                                transform: 'translateX(-50%)',
                                borderRadius: '2px'
                            }} />
                        </div>
                    )}

                    {/* Enhanced Scoreboard */}
                    <EnhancedScoreboard
                        score={score}
                        saves={saves}
                        misses={misses}
                        attempts={attempts}
                        successPercentage={successPercentage}
                        streak={streak}
                        bestStreak={bestStreak}
                    />

                    {/* Instructions */}
                    <div style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '10px',
                        zIndex: 5,
                        fontSize: '0.75rem',
                        background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(40,40,40,0.9))',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        color: 'white',
                        maxWidth: '200px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                    }}>
                        {gamePhase === 'ready' && !isCharging && 'Hover to aim, hold & release to shoot'}
                        {isCharging && 'Charging power... Release to shoot!'}
                        {gamePhase === 'shooting' && 'Shot in progress...'}
                        {gamePhase === 'result' && 'Get ready for next shot!'}
                    </div>

                    {/* Result messages */}
                    <AnimatePresence>
                        {isGoal && (
                            <ResultMessage
                                text="GOAL! ⚽"
                                bgColor="rgba(0,180,0,0.95)"
                                shadowColor="rgba(0,180,0,0.4)"
                            />
                        )}

                        {isSave && (
                            <ResultMessage
                                text="SAVED! 🧤"
                                bgColor="rgba(220,0,0,0.95)"
                                shadowColor="rgba(220,0,0,0.4)"
                            />
                        )}

                        {isMiss && (
                            <ResultMessage
                                text="MISSED! 😤"
                                bgColor="rgba(255,140,0,0.95)"
                                shadowColor="rgba(255,140,0,0.4)"
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

// Enhanced sub-components
const FieldMarkings = () => (
    <>
        {/* Goal post with 3D effect */}
        <div style={{
            position: 'absolute',
            top: '15%',
            left: '25%',
            width: '50%',
            height: '35%',
            border: '4px solid #ffffff',
            borderBottom: 'none',
            zIndex: 2,
            boxShadow: 'inset 0 0 10px rgba(255,255,255,0.3)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.05), transparent)'
        }}>
            {/* Enhanced Goal net pattern */}
            <div style={{
                width: '100%',
                height: '100%',
                backgroundImage: `
                    repeating-linear-gradient(0deg, 
                        transparent, transparent 10px, 
                        rgba(255,255,255,0.4) 10px, rgba(255,255,255,0.4) 11px),
                    repeating-linear-gradient(90deg, 
                        transparent, transparent 10px, 
                        rgba(255,255,255,0.4) 10px, rgba(255,255,255,0.4) 11px)
                `,
                opacity: 0.7
            }} />

            {/* Goal line */}
            <div style={{
                position: 'absolute',
                bottom: '-4px',
                left: '-4px',
                right: '-4px',
                height: '4px',
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }} />
        </div>

        {/* Penalty spot with grass texture */}
        <div style={{
            position: 'absolute',
            top: '85%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '10px',
            height: '10px',
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            zIndex: 1,
            boxShadow: '0 2px 4px rgba(0,0,0,0.5), inset 0 1px 2px rgba(0,0,0,0.2)'
        }} />

        {/* Enhanced Penalty area marking */}
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '20%',
            width: '60%',
            height: '35%',
            border: '3px solid rgba(255,255,255,0.9)',
            borderTop: 'none',
            borderRadius: '0 0 12px 12px',
            boxShadow: '0 0 10px rgba(255,255,255,0.2)'
        }} />

        {/* Six-yard box */}
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '35%',
            width: '30%',
            height: '20%',
            border: '2px solid rgba(255,255,255,0.9)',
            borderTop: 'none',
            boxShadow: '0 0 6px rgba(255,255,255,0.2)'
        }} />

        {/* Center circle arc */}
        <div style={{
            position: 'absolute',
            bottom: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '40px',
            border: '2px solid rgba(255,255,255,0.6)',
            borderTop: 'none',
            borderRadius: '0 0 80px 80px'
        }} />
    </>
);

const EnhancedGoalkeeper = ({ position, animation }) => {
    const getAnimationProps = () => {
        switch (animation) {
            case 'dive-left':
                return {
                    rotate: -25,
                    x: -8,
                    y: -3,
                    transition: { duration: 0.4, ease: "easeOut" }
                };
            case 'dive-right':
                return {
                    rotate: 25,
                    x: 8,
                    y: -3,
                    transition: { duration: 0.4, ease: "easeOut" }
                };
            case 'jump':
                return {
                    y: -8,
                    transition: { duration: 0.3, ease: "easeOut" }
                };
            default:
                return {
                    rotate: 0,
                    x: 0,
                    y: 0,
                    transition: { duration: 0.5, ease: "easeInOut" }
                };
        }
    };

    return (
        <motion.div
            animate={{
                left: `${position}%`,
                ...getAnimationProps()
            }}
            style={{
                position: 'absolute',
                top: '48%', // Position on goal line
                transform: 'translateX(-50%)',
                width: '24px',
                height: '70px',
                zIndex: 3
            }}
        >
            {/* Goalkeeper shadow */}
            <div style={{
                position: 'absolute',
                bottom: '-5px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '20px',
                height: '8px',
                background: 'radial-gradient(ellipse, rgba(0,0,0,0.3), transparent)',
                borderRadius: '50%',
                zIndex: -1
            }} />

            {/* Goalkeeper body */}
            <div style={{
                width: '24px',
                height: '45px',
                background: 'linear-gradient(180deg, #ff6b35, #e55a2b)',
                borderRadius: '6px',
                position: 'relative',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.2)'
            }}>
                {/* Jersey number */}
                <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: 'white',
                    fontSize: '8px',
                    fontWeight: 'bold',
                    textShadow: '1px 1px 1px rgba(0,0,0,0.5)'
                }}>
                    1
                </div>

                {/* Enhanced arms with realistic movement */}
                <motion.div
                    animate={animation === 'dive-left' ? { rotate: -60, x: -6, y: -2 } :
                        animation === 'dive-right' ? { rotate: 60, x: 6, y: -2 } :
                            animation === 'jump' ? { rotate: -30, y: -4 } : { rotate: 10, y: 0 }}
                    style={{
                        position: 'absolute',
                        top: '12px',
                        left: '-10px',
                        width: '16px',
                        height: '5px',
                        background: 'linear-gradient(90deg, #ffdbac, #f4c2a1)',
                        borderRadius: '3px',
                        transformOrigin: 'right center',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                    }}
                />
                <motion.div
                    animate={animation === 'dive-left' ? { rotate: 60, x: -6, y: -2 } :
                        animation === 'dive-right' ? { rotate: -60, x: 6, y: -2 } :
                            animation === 'jump' ? { rotate: 30, y: -4 } : { rotate: -10, y: 0 }}
                    style={{
                        position: 'absolute',
                        top: '12px',
                        right: '-10px',
                        width: '16px',
                        height: '5px',
                        background: 'linear-gradient(90deg, #f4c2a1, #ffdbac)',
                        borderRadius: '3px',
                        transformOrigin: 'left center',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                    }}
                />

                {/* Legs */}
                <div style={{
                    position: 'absolute',
                    bottom: '-18px',
                    left: '4px',
                    width: '6px',
                    height: '18px',
                    background: 'linear-gradient(180deg, #333, #222)',
                    borderRadius: '0 0 3px 3px'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '-18px',
                    right: '4px',
                    width: '6px',
                    height: '18px',
                    background: 'linear-gradient(180deg, #333, #222)',
                    borderRadius: '0 0 3px 3px'
                }} />

                {/* Boots */}
                <div style={{
                    position: 'absolute',
                    bottom: '-22px',
                    left: '2px',
                    width: '8px',
                    height: '4px',
                    backgroundColor: '#000',
                    borderRadius: '2px'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '-22px',
                    right: '2px',
                    width: '8px',
                    height: '4px',
                    backgroundColor: '#000',
                    borderRadius: '2px'
                }} />
            </div>

            {/* Enhanced Goalkeeper head */}
            <div style={{
                width: '20px',
                height: '20px',
                background: 'radial-gradient(circle at 30% 30%, #ffdbac, #f4c2a1)',
                borderRadius: '50%',
                margin: '2px auto',
                position: 'relative',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
                {/* Eyes with expression */}
                <div style={{
                    position: 'absolute',
                    top: '6px',
                    left: '4px',
                    width: '3px',
                    height: '3px',
                    backgroundColor: '#000',
                    borderRadius: '50%'
                }} />
                <div style={{
                    position: 'absolute',
                    top: '6px',
                    right: '4px',
                    width: '3px',
                    height: '3px',
                    backgroundColor: '#000',
                    borderRadius: '50%'
                }} />

                {/* Nose */}
                <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '2px',
                    height: '2px',
                    backgroundColor: '#e0a080',
                    borderRadius: '50%'
                }} />

                {/* Hair */}
                <div style={{
                    position: 'absolute',
                    top: '-2px',
                    left: '2px',
                    right: '2px',
                    height: '8px',
                    backgroundColor: '#8B4513',
                    borderRadius: '10px 10px 0 0',
                    zIndex: -1
                }} />

                {/* Enhanced Gloves with better positioning */}
                <motion.div
                    animate={animation === 'dive-left' ? { x: -3, y: 2 } :
                        animation === 'dive-right' ? { x: 3, y: 2 } :
                            animation === 'jump' ? { y: -2 } : {}}
                    style={{
                        position: 'absolute',
                        top: '-6px',
                        left: '-16px',
                        width: '10px',
                        height: '10px',
                        background: 'radial-gradient(circle, #ffffff, #e0e0e0)',
                        borderRadius: '50%',
                        border: '2px solid #1a472a',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}
                />
                <motion.div
                    animate={animation === 'dive-left' ? { x: -3, y: 2 } :
                        animation === 'dive-right' ? { x: 3, y: 2 } :
                            animation === 'jump' ? { y: -2 } : {}}
                    style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-16px',
                        width: '10px',
                        height: '10px',
                        background: 'radial-gradient(circle, #ffffff, #e0e0e0)',
                        borderRadius: '50%',
                        border: '2px solid #1a472a',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}
                />
            </div>
        </motion.div>
    );
};

const PowerMeter = ({ power, maxPower }) => {
    const powerPercentage = (power / maxPower) * 100;
    const getPowerColor = () => {
        if (powerPercentage < 30) return '#ff4444';
        if (powerPercentage < 60) return '#ffaa00';
        if (powerPercentage < 85) return '#44ff44';
        return '#ff4444'; // Too much power is bad
    };

    const getPowerLabel = () => {
        if (powerPercentage < 30) return 'TOO WEAK';
        if (powerPercentage < 60) return 'BUILDING';
        if (powerPercentage < 85) return 'PERFECT';
        return 'TOO STRONG';
    };

    return (
        <div style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '220px',
            height: '30px',
            background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(40,40,40,0.9))',
            borderRadius: '15px',
            zIndex: 10,
            overflow: 'hidden',
            border: '2px solid #fff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}>
            <motion.div
                animate={{ width: `${powerPercentage}%` }}
                style={{
                    height: '100%',
                    background: `linear-gradient(90deg, ${getPowerColor()}, ${getPowerColor()}dd)`,
                    borderRadius: '13px',
                    boxShadow: `0 0 15px ${getPowerColor()}`,
                    position: 'relative'
                }}
            />

            {/* Power indicator zones */}
            <div style={{
                position: 'absolute',
                top: '0',
                left: '30%',
                width: '1px',
                height: '100%',
                backgroundColor: 'rgba(255,255,255,0.5)'
            }} />
            <div style={{
                position: 'absolute',
                top: '0',
                left: '60%',
                width: '1px',
                height: '100%',
                backgroundColor: 'rgba(255,255,255,0.5)'
            }} />
            <div style={{
                position: 'absolute',
                top: '0',
                left: '85%',
                width: '1px',
                height: '100%',
                backgroundColor: 'rgba(255,255,255,0.5)'
            }} />

            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                zIndex: 2
            }}>
                {getPowerLabel()} - {Math.round(powerPercentage)}%
            </div>
        </div>
    );
};

const EnhancedScoreboard = ({
    score,
    saves,
    misses,
    attempts,
    successPercentage,
    streak,
    bestStreak
}) => (
    <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.95), rgba(40,40,40,0.95))',
        color: 'white',
        padding: '12px 16px',
        borderRadius: '12px',
        fontSize: '0.8rem',
        zIndex: 5,
        minWidth: '140px',
        border: '2px solid rgba(255,255,255,0.2)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(5px)'
    }}>
        <div style={{
            fontWeight: 'bold',
            marginBottom: '8px',
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: '#4a9fff',
            textAlign: 'center',
            borderBottom: '1px solid rgba(74,159,255,0.3)',
            paddingBottom: '4px'
        }}>
            ⚽ Penalty Stats
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '4px' }}>⚽</span>Goals:
            </span>
            <span style={{ color: '#44ff44', fontWeight: 'bold', fontSize: '0.9rem' }}>{score}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '4px' }}>🧤</span>Saves:
            </span>
            <span style={{ color: '#ff4444', fontWeight: 'bold', fontSize: '0.9rem' }}>{saves}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '4px' }}>❌</span>Misses:
            </span>
            <span style={{ color: '#ffaa00', fontWeight: 'bold', fontSize: '0.9rem' }}>{misses}</span>
        </div>

        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '6px',
            paddingBottom: '6px',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '4px' }}>📊</span>Total:
            </span>
            <span style={{ fontWeight: 'bold' }}>{attempts}</span>
        </div>

        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '4px'
        }}>
            <span style={{ fontSize: '0.75rem' }}>Success Rate:</span>
            <span style={{
                color: successPercentage >= 70 ? '#44ff44' :
                    successPercentage >= 50 ? '#ffaa00' : '#ff4444',
                fontWeight: 'bold',
                fontSize: '0.9rem'
            }}>
                {successPercentage}%
            </span>
        </div>

        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.7rem',
            opacity: 0.9
        }}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '2px' }}>🔥</span>Streak:
            </span>
            <span style={{
                color: streak > 0 ? '#44ff44' : 'white',
                fontWeight: streak > 2 ? 'bold' : 'normal'
            }}>
                {streak} <span style={{ opacity: 0.7 }}>(Best: {bestStreak})</span>
            </span>
        </div>
    </div>
);

const ResultMessage = ({ text, bgColor, shadowColor }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.5, y: -30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 30 }}
        transition={{
            type: "spring",
            stiffness: 300,
            damping: 20
        }}
        style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: `linear-gradient(135deg, ${bgColor}, ${bgColor}cc)`,
            color: 'white',
            fontWeight: 'bold',
            padding: '24px 36px',
            borderRadius: '20px',
            fontSize: '1.6rem',
            zIndex: 10,
            textAlign: 'center',
            boxShadow: `0 12px 24px ${shadowColor}, 0 0 40px ${shadowColor}`,
            border: '3px solid rgba(255,255,255,0.4)',
            backdropFilter: 'blur(10px)',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}
    >
        <motion.div
            animate={{
                scale: [1, 1.05, 1],
                textShadow: [
                    '2px 2px 4px rgba(0,0,0,0.5)',
                    '2px 2px 8px rgba(0,0,0,0.8)',
                    '2px 2px 4px rgba(0,0,0,0.5)'
                ]
            }}
            transition={{ duration: 0.8, repeat: Infinity }}
        >
            {text}
        </motion.div>

        {/* Celebration particles effect */}
        {text.includes('GOAL') && (
            <>
                <motion.div
                    animate={{
                        rotate: [0, 360],
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0]
                    }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    style={{
                        position: 'absolute',
                        top: '-10px',
                        left: '-10px',
                        fontSize: '1rem'
                    }}
                >
                    ✨
                </motion.div>
                <motion.div
                    animate={{
                        rotate: [0, -360],
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0]
                    }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                    style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '-10px',
                        fontSize: '1rem'
                    }}
                >
                    🎉
                </motion.div>
            </>
        )}
    </motion.div>
);

export default FootballInterestCard;