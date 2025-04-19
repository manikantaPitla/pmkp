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

export const Divider = ({ children }) => (
  <DividerStyles>
    <hr />
    {children}
    <hr />
  </DividerStyles>
);
