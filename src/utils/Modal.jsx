import React from "react";
import "reactjs-popup/dist/index.css";
import {
  ModalBody,
  ModalButtonWrapper,
  ModalSmallCustomStyles,
  ModalTitle,
} from "./styled-component";
import Button from "../components/ui/Button";
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
            <StyledButton type="button" $outline onClick={close}>
              Cancel
            </StyledButton>
            <StyledButton
              type="button"
              onClick={() => {
                action();
                close();
              }}
            >
              {buttonText}
            </StyledButton>
          </ModalButtonWrapper>
          {children}
        </ModalBody>
      )}
    </ModalSmallCustomStyles>
  );
}
