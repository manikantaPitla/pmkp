import styled from "styled-components";

export const StyledButton = styled.button`
  height: var(--primary-el-height);
  border-radius: var(--radius);
  border: 1px solid var(--border-shaded);
  background-color: #fff;
  color: #000;
  padding: 0px 20px;
  cursor: pointer;
  width: 100%;
  font-size: var(--fs-xl);
  transition: all 0.2s ease;
  outline: none;
  position: relative;

  &:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.6);
  }

  &:focus-visible {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }

  &:disabled {
    background-color: #666;
    color: #999;
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    border-width: 2px;
    &:focus-visible {
      outline-width: 3px;
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const CustomButton = styled(StyledButton)`
  height: inherit;
  padding: 5px 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;
