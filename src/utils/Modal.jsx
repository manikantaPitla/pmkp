import React from "react";
import "reactjs-popup/dist/index.css";
import {
  ModalBody,
  ModalButtonWrapper,
  ModalSmallCustomStyles,
  ModalTitle,
} from "./styled-component";
import { CustomButton } from "../components/ui/Button/styled-component";

export function ModalSmall(props) {
  const { children, content, action } = props;
  const { title, buttonText } = content;

  return (
    <ModalSmallCustomStyles modal {...props} closeOnDocumentClick={false}>
      {(close) => (
        <ModalBody>
          <ModalTitle>{title}</ModalTitle>
          <ModalButtonWrapper>
            <CustomButton $outline onClick={close}>
              Cancel
            </CustomButton>
            <CustomButton
              onClick={() => {
                action();
                close();
              }}
            >
              {buttonText}
            </CustomButton>
          </ModalButtonWrapper>
          {children}
        </ModalBody>
      )}
    </ModalSmallCustomStyles>
  );
}
