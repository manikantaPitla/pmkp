import styled from "styled-components";

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: #303030;
  border-radius: var(--radius);
  height: var(--primary-el-height);
  padding: 0 12px;
  transition: all 0.2s ease;
  border: 2px solid transparent;

  &:focus-within {
    border-color: rgba(255, 255, 255, 0.3);
    background-color: #404040;
  }

  &.error {
    border-color: #ff4444;
    background-color: rgba(255, 68, 68, 0.1);
  }
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
  transition: all 0.2s ease;
  font-size: var(--fs-xl);

  &::placeholder {
    color: #757575;
    opacity: 1;
  }

  &:-webkit-autofill {
    -webkit-text-fill-color: #fff !important;
    transition: background-color 9999s ease-in-out 0s;
  }

`;
