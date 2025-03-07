import styled from "styled-components";

export const InputWrapper = styled.form`
  display: flex;
  align-items: center;
  gap: 5px;

  height: 48px;
  border-radius: 25px;
  border: 1px solid var(--border-shaded);
  background-color: var(--bg-shaded);
  padding: 0px 3px 0px 20px;
  font-size: 14px;

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus {
    transition: background-color 5000s ease-in-out 0s;
  }

  input {
    flex: 1;
    background-color: transparent;
    outline: none;
    border: none;
    height: inherit;
  }

  button {
    cursor: pointer;
    padding: 0px !important;
    height: inherit;
    width: 40px;
    height: 40px;
    border-radius: 25px;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
    color: #000000;
  }
`;
