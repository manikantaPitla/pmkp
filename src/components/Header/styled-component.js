import styled from "styled-components";

export const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  padding: 10px 15px;
  background-color: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  position: fixed;
  width: 100%;
  top: 0px;
  z-index: 1000;
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

  button {
    &:nth-child(1) {
      background-color: #d90429;
      color: #ffffff;
      color: #d90429;
    }
  }

  button {
    background-color: transparent !important;
    color: white;
    border: none;
  }
`;
