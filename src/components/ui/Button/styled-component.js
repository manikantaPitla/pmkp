import styled from "styled-components";

export const StyledButton = styled.button`
  height: 45px;
  border-radius: 15px;
  border-color: var(--border-shaded);
  background-color: #fff;
  color: #000;
  padding: 0px 20px;
  font-size: 14px;
  cursor: pointer;
  width: 100%;

  &:hover {
    transition: background-color 0.2s;
    background-color: rgba(255, 255, 255, 0.6);
  }
`;
