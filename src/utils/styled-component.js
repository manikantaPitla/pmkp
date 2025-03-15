import styled from "styled-components";
import Popup from "reactjs-popup";

export const ModalSmallCustomStyles = styled(Popup)`
  &-overlay {
    backdrop-filter: blur(3px);
  }

  &-content {
    width: 280px;
    height: 120px;
    border-radius: 15px;
    background-color: #ffffff;
    border: none;
    color: #000000;
  }
`;

export const ModalNotifyCustomStyles = styled(ModalSmallCustomStyles)`
  &-content {
    width: 350px;
    height: 180px;
    border-radius: 16px;
  }
`;

export const ModalBody = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 10px;
`;

export const ModalTitle = styled.p`
  font-size: 14px;
`;

export const ModalButtonWrapper = styled.div`
  display: flex;
  gap: 10px;

  button {
    background-color: #000000;
    font-weight: 500;
    font-size: 13px;
    width: 100px;
    color: #ffffff;
    border: 1px solid #000000;

    &:hover {
      background-color: #000000;
      color: #ffffff;
    }

    &:nth-child(1) {
      background-color: transparent;
      color: #000000;
    }
  }
`;
