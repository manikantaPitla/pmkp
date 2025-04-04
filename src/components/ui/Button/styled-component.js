import styled from "styled-components";

export const StyledButton = styled.button`
  height: 45px;
  border-radius: var(--radius);
  border: 1px solid var(--border-shaded);
  background-color: #fff;
  color: #000;
  padding: 0px 20px;
  cursor: pointer;
  width: 100%;
  font-size: var(--fs-xl);

  &:hover {
    transition: background-color 0.2s;
    background-color: rgba(255, 255, 255, 0.6);
  }
`;

export const CustomButton = styled(StyledButton)`
  height: inherit;
  padding: 5px 12px;
`;
