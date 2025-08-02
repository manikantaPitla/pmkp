import styled from "styled-components";

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: #303030;
  border-radius: var(--radius);
  height: var(--primary-el-height);
  padding: 0 12px;
`;

export const IconWrapper = styled.div`
  margin-right: 10px;
  display: flex;
  align-items: center;

  img {
    width: 24px;
    height: 24px;
    object-fit: contain;
    color: #757575;
  }
`;

export const StyledInput = styled.input`
  flex: 1;
  padding: 10px 0;
  border: none;
  background-color: transparent;
  caret-color: #ffffff;
  color: #fff;
  outline: none;

  &:-webkit-autofill {
    -webkit-text-fill-color: #fff !important;
    transition: background-color 9999s ease-in-out 0s;
  }
`;
