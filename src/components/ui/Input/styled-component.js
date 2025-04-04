import styled from "styled-components";

export const StyledInput = styled.input`
  height: 45px;
  border-radius: var(--radius);
  border: 1px solid var(--border-shaded);
  background-color: var(--bg-shaded);
  padding: 0px 20px;
  font-size: var(--fs-xl);

  &::placeholder {
    color: #5e5e5e !important;
  }

  outline: none;
`;
