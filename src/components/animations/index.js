import { keyframes } from "styled-components";

export const circleMove = keyframes`
    0%, 100% {
        clip-path: circle(var(--title-circle-radius, 72px) at 78% 50%);
    }
    50% {
        clip-path: circle(var(--title-circle-radius, 72px) at 8% 50%);
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
