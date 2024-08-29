// src/components/Card.js
import React from 'react';
import styled from 'styled-components';

const CardWrapper = styled.div`
  background-color: #2a2d3e;
  padding: 20px;
  border-radius: 8px;
  color: #fff;
  flex: 1;
  margin: 10px;
`;

const Card = ({ title, children }) => (
    <CardWrapper>
        <h3>{title}</h3>
        {children}
    </CardWrapper>
);

export default Card;
