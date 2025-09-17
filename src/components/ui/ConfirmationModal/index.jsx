import React from "react";
import "reactjs-popup/dist/index.css";
import { ConfirmationModalStyles, ModalBody, ModalButton, ModalButtonWrapper, ModalTitle } from "./styled-component";

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel" }) {
  return (
    <ConfirmationModalStyles open={isOpen} onClose={onClose} closeOnDocumentClick modal>
      {close => (
        <ModalBody>
          <ModalTitle>{title}</ModalTitle>
          <p style={{ fontSize: "12px", textAlign: "center", margin: "0", color: "#666", lineHeight: "1.4" }}>{message}</p>
          <ModalButtonWrapper>
            <ModalButton type="button" onClick={close}>
              {cancelText}
            </ModalButton>
            <ModalButton
              type="button"
              onClick={() => {
                onConfirm();
                close();
              }}
            >
              {confirmText}
            </ModalButton>
          </ModalButtonWrapper>
        </ModalBody>
      )}
    </ConfirmationModalStyles>
  );
}

export default ConfirmationModal;
