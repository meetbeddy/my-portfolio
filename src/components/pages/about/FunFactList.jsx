
import React from "react";
import styled from "styled-components";
import * as Icons from "lucide-react";


const FactListItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const FunFactList = ({ facts }) => {
    return (
        <ul style={{ display: "flex", flexDirection: "column", gap: '10px' }}>
            {facts.map((fact, i) => {
                const Icon = Icons[fact.icon] || Icons["CircleHelp"];
                return (
                    <FactListItem key={i}>
                        <Icon size={24} />
                        <span>{fact.text}</span>
                    </FactListItem>
                )
            })}
        </ul>
    );
};

export default FunFactList;

