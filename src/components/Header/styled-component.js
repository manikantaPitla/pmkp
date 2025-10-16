import styled from "styled-components";

export const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  padding: 10px 15px;
  background-color: rgba(0, 0, 0, 0.1);
  /* backdrop-filter: blur(10px);
  position: fixed;
  width: 100%;
  top: 0px;
  z-index: 1000; */
`;

export const UserNameWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const ProfileDataWrapper = styled.div`
  display: flex;
  flex-direction: column;

  h1 {
    font-size: var(--fs-xl);
    font-weight: 500;
  }

  p {
    font-size: var(--fs-m);
    color: var(--text-light-shaded);
  }
`;

export const MenuWrapper = styled.div`
  display: flex;
  gap: 5px;
  position: relative;

  button {
    background-color: transparent !important;
    color: #ffffff !important;
    border: none;
    border-radius: 8px;
    padding: 8px;
    min-width: 40px;
    min-height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    cursor: pointer;

    &:hover:not(:disabled) {
      background-color: rgba(255, 255, 255, 0.1) !important;
      border-color: rgba(255, 255, 255, 0.4) !important;
    }

    &:active {
      transform: scale(0.95);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

export const MenuDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background-color: #2a2a2a;
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  min-width: 200px;
  max-width: 300px;
  overflow: hidden;
  z-index: 1001;
  animation: slideIn 0.2s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-8px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  &::after {
    content: "";
    position: absolute;
    top: -6px;
    right: 16px;
    width: 0;
    height: 0;
    /* border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid #2a2a2a; */
  }

  @media (max-width: 768px) {
    min-width: 180px;
    max-width: 200px;
  }
`;

export const MenuItem = styled.button`
  display: flex;
  align-items: flex-start;

  span {
    flex: 1;
    text-align: left;
  }

  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  background: none;
  color: #ffffff;
  font-size: 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #3a3a3a;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;

    &:hover {
      background-color: transparent;
    }
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;
