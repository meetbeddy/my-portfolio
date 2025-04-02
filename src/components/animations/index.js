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
    initial: { opacity: 0, x: "100vw" },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 50,
            damping: 20,
            delay: 0.3,
            duration: 1,
        },
    },
    exit: {
        x: "-100vw",
        transition: {
            ease: "easeInOut",
            duration: 0.5,
        },
    },
};

export const TextAreaVariants = {
    initial: { x: "-100vw", opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 50,
            damping: 20,
            delay: 0.8
        }
    },
};

export const RightBoxVariants = {
    initial: { y: "50vh", opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 50,
            damping: 20,
            delay: 1.2
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