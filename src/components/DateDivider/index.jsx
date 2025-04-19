// components/DateDivider/index.jsx
import React from "react";
import styled from "styled-components";

const Divider = styled.li`
  display: flex;
  justify-content: center;
  margin: 10px 0 10px;
  font-size: 8px;
  font-weight: 500;
  color: var(--text-light-shaded);
  p {
    width: fit-content;
    background-color: var(--bg-shaded);
    padding: 5px 8px;
    border-radius: 6px;
  }
`;

const DateDivider = ({ date }) => (
  <Divider>
    <p>{date}</p>
  </Divider>
);

export default React.memo(DateDivider);
