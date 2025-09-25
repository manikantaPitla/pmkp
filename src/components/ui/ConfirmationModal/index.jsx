import React from "react";
import "reactjs-popup/dist/index.css";
import { ConfirmationModalStyles, ModalBody, ModalButton, ModalButtonWrapper, ModalTitle } from "./styled-component";

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", closeOnDocumentClick = true, closeOnEscape = true }) {
  return (
    <ConfirmationModalStyles open={isOpen} onClose={onClose} closeOnDocumentClick={closeOnDocumentClick} closeOnEscape={closeOnEscape} modal>
      {close => (
        <ModalBody>
          <ModalTitle>{title}</ModalTitle>
          <p style={{ fontSize: "12px", textAlign: "center", margin: "0", color: "#666", lineHeight: "1.4" }}>{message}</p>
          <ModalButtonWrapper>
            {cancelText ? (
              <ModalButton type="button" onClick={close}>
                {cancelText}
              </ModalButton>
            ) : null}
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
