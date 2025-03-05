import styled from "styled-components";
import Popup from "reactjs-popup";

// ************** Small Modal Styles ******************

export const ModalSmallCustomStyles = styled(Popup)`
  &-content {
    width: 250px;
    height: 100px;
    box-shadow: 0px 1px 1px -1px rgba(255, 255, 255, 0.1),
      0px 1px 1px 0px rgba(255, 255, 255, 0.1),
      0px 1px 2px 0px rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    background-color: #ffffff;
    border: none;
    color: #000000;
  }
`;

export const ModalBody = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 15px;
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
    padding: 10px 15px;
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
