import React from "react";
import { FlexWrapper } from "./StyledContainers";
import AnimatedBackground from "../shared/AnimatedBackground";
import { ContentContainer, PageHeader } from "../shared/StyledComponents";
import { ContainerVariants } from "../animations";


const PageLayout = ({ title, children, maxWidth }) => {
    return (
        <>
            <AnimatedBackground />

            <FlexWrapper
                variants={ContainerVariants}
                initial="initial"
                animate="visible"
                exit="exit"
            >
                <ContentContainer maxWidth={maxWidth}>
                    <PageHeader>
                        <div className="bottom">
                            <h1>{title}</h1>
                        </div>
                        <div className="top">
                            <h1>{title}</h1>
                        </div>
                    </PageHeader>

                    {children}
                </ContentContainer>
            </FlexWrapper>
        </>
    );
};

export default PageLayout;