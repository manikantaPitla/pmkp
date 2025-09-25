import styled from "styled-components";
import Popup from "reactjs-popup";
import { StyledButton } from "../Button/styled-component";

export const ConfirmationModalStyles = styled(Popup)`
  &-overlay {
    backdrop-filter: blur(3px);
    z-index: 999999;
    background-color: rgba(0, 0, 0, 0.4);
  }

  &-content {
    width: 320px;
    min-height: 160px;
    border-radius: 15px;
    background-color: #ffffff;
    border: none;
    color: #000000;
    padding: 0;
    z-index: 1000000;
  }
`;

export const ModalBody = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 20px;
  .modal-message {
    font-size: 12px;
    text-align: center;
    margin: 0;
    color: #666;
    line-height: 1.4;
  }
`;

export const ModalTitle = styled.p`
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  text-align: center;
`;

export const ModalButtonWrapper = styled.div`
  display: flex;
  gap: 10px;

  button {
    font-weight: 500;
    font-size: 13px;
    width: 100px;
    border: 1px solid #000000;

    &:nth-child(1) {
      background-color: transparent;
      color: #000000;

      &:hover {
        background-color: #f5f5f5;
        color: #000000;
      }
    }

    &:nth-child(2) {
      background-color: #000000;
      color: #ffffff;

      &:hover {
        background-color: #333333;
        color: #ffffff;
      }
    }
  }
`;

export const ModalButton = styled(StyledButton)`
  height: 40px;
  border-radius: 50px;
  font-size: var(--fs-l) !important;
  font-family: inherit;
`;
