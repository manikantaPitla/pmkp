import styled from "styled-components";

export const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  padding: 20px 10px 15px;
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
    font-size: 14px;
    font-weight: 500;
  }

  p {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.5);
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
