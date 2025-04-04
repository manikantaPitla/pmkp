import React from "react";
import "reactjs-popup/dist/index.css";
import {
  ModalBody,
  ModalButton,
  ModalButtonWrapper,
  ModalSmallCustomStyles,
  ModalTitle,
} from "./styled-component";
import { StyledButton } from "../components/ui/Button/styled-component";

export function ModalSmall(props) {
  const { children, content, action } = props;
  const { title, buttonText } = content;

  return (
    <ModalSmallCustomStyles modal {...props} closeOnDocumentClick>
      {(close) => (
        <ModalBody>
          <ModalTitle>{title}</ModalTitle>
          <ModalButtonWrapper>
            <ModalButton type="button" onClick={close}>
              Cancel
            </ModalButton>
            <ModalButton
              type="button"
              onClick={() => {
                action();
                close();
              }}
            >
              {buttonText}
            </ModalButton>
          </ModalButtonWrapper>
          {children}
        </ModalBody>
      )}
    </ModalSmallCustomStyles>
  );
}
