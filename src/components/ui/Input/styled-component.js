import styled from "styled-components";

export const StyledInput = styled.input`
  height: 45px;
  border-radius: 10px;
  border-color: var(--border-shaded);
  background-color: var(--bg-shaded);
  padding: 0px 20px;
  font-size: 14px;

  &::placeholder {
    color: #5e5e5e !important;
  }

  outline: none;
`;
