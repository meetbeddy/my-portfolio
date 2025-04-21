import React, { useState } from "react";
import styled from "styled-components";
import Section from "../../shared/Section";
import MusicInterestCard from "./MusicInterestCard";
import FootballInterestCard from "./FootballInterestCard";
import CoffeeInterestCard from "./CofeeInterestCard";
import SocialButtons from "./SocialButton";
import { SubTitle } from "../../shared/StyledComponents";

const Card = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borders.radius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.sm};
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

// Interest cards with theme colors
const interestCardColors = {
    music: "rgba(255, 255, 255, 0.05)",
    football: "rgba(255, 255, 255, 0.08)",
    coffee: "rgba(255, 255, 255, 0.12)"
};

const InterestsSection = () => {
    const [coffeeCount, setCoffeeCount] = useState(0);

    return (
        <Section id="panel-interests" ariaLabelledby="tab-interests">
            <SubTitle style={{
                textAlign: "center",
                marginBottom: "2rem"
            }}>Beyond The Code</SubTitle>

            <CardGrid>
                <MusicInterestCard bgColor={interestCardColors.music} />
                <FootballInterestCard bgColor={interestCardColors.football} />
                <CoffeeInterestCard
                    bgColor={interestCardColors.coffee}
                    coffeeCount={coffeeCount}
                    setCoffeeCount={setCoffeeCount}
                />
            </CardGrid>

            <Card style={{ marginTop: "2rem" }}>
                <h3>Let's Connect</h3>
                <p>
                    When I'm not deep in the code, you'll probably catch me listening to indie-pop, playing football, or just chatting with people about cool projects. I'm always interested in hearing about new ideas or potential collaborations.
                </p>
                <SocialButtons />
            </Card>
        </Section>
    );
};

export default InterestsSection;