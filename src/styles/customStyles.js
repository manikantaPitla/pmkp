import styled from "styled-components";

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--text-light-shaded);
  font-size: 12px;

  hr {
    background-color: var(--bg-shaded);
    height: 2px;
    border: none;
    flex: 1;
  }
`;
