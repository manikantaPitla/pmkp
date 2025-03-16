import React from "react";
import {
  CustomMainWrapperStyles,
  CustomSharedContainer,
  MainWrapper,
  SharedContainer,
  DividerStyles,
} from "./styled-component";

export const MainLayout = ({ children }) => (
  <MainWrapper>
    <SharedContainer>{children}</SharedContainer>
  </MainWrapper>
);

export const CustomMainLayout = ({ children }) => (
  <CustomMainWrapperStyles>
    <CustomSharedContainer>{children}</CustomSharedContainer>
  </CustomMainWrapperStyles>
);

export const Divider = ({ text }) => (
  <DividerStyles>
    <hr />
    {text}
    <hr />
  </DividerStyles>
);
