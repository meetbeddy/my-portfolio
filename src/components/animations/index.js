import { keyframes } from "styled-components";


export const circleMove = keyframes`
  0%, 100% {
    clip-path: circle(10% at 75% 50%);
  }
  25% {
    clip-path: circle(10% at 6.5% 50%);
  }
`;


export const ContainerVariants = {
    initial: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
        },
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.2,
            ease: [0.4, 0, 1, 1],
        },
    },
};

export const TextAreaVariants = {
    initial: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
            delay: 0.1,
        }
    },
};

export const RightBoxVariants = {
    initial: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
            delay: 0.2,
        }
    },
};

// Ball animations
export const floatingBall = {
    animate: {
        y: [0, -15, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
        },
    },
};

export const rotatingBall = {
    animate: {
        rotate: 360,
        transition: {
            duration: 8,
            repeat: Infinity,
            ease: "linear",
        },
    },
};

export const pulsatingBall = {
    animate: {
        scale: [1, 1.1, 1],
        opacity: [0.7, 0.9, 0.7],
        transition: {
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
        },
    },
};