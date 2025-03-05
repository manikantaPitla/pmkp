import styled from "styled-components";
import Popup from "reactjs-popup";

// ************** Small Modal Styles ******************

export const ModalSmallCustomStyles = styled(Popup)`
  &-content {
    width: 300px;
    height: 150px;
    box-shadow: var(--shadow);
    border-radius: 15px;
    background-color: var(--bg-shaded);
    border: none;
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
  font-size: 16px;
`;

export const ModalButtonWrapper = styled.div`
  display: flex;
  gap: 10px;

  button {
    font-weight: 500;
    font-size: 13px;
    padding: 8px 15px;
    width: 100px;
  }
`;

// ************** Small Modal Styles ******************

export const StyledModalLarge = styled(Popup)`
  &-content {
    margin: 0 0 !important;
    width: inherit;
    box-shadow: var(--shadow);
    padding: 0;
    border: none;

    @media screen and (max-width: 500px) {
      width: 100%;
    }
  }
`;

// ************** Modal Menu ******************

export const SmallModalMenu = styled(Popup)`
  /* animation */

  &-content {
    width: fit-content !important;
    border-radius: var(--primary-border-radius) !important;
    background-color: var(--primary-background-color);
    border: var(--primary-border);
    box-shadow: var(--shadow);
  }

  &-overlay {
    backdrop-filter: none !important;
  }
`;

// ************** Modal View Media ******************

export const ModalViewMediaWrapper = styled(Popup)`
  &-content {
    border: none;
    padding: 0;
    width: inherit;
    background-color: transparent;
    z-index: 100;

    .modal-content {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: center;
      gap: 10px;
      padding: 40px;
      height: 100vh;

      img {
        object-fit: contain;
        width: 100%;
        height: 100%;
        width: 500px;
        height: 600px;
        border-radius: var(--primary-border-radius);

        @media screen and (max-width: 768px) {
          width: 100%;
          height: fit-content;
        }
      }

      video {
        width: 100%;
        height: 100%;
        border-radius: var(--primary-border-radius);
      }

      .button-wrapper {
        display: flex;
        gap: 10px;

        button {
          flex: 1;
          height: 45px !important;
        }
      }
    }
  }
`;
