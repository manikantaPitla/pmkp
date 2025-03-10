import React from "react";
import {
  CustomMainWrapperStyles,
  CustomSharedContainer,
  MainWrapper,
  SharedContainer,
} from "./styled-component";

function MainLayout({ children }) {
  return (
    <MainWrapper>
      <SharedContainer>{children}</SharedContainer>
    </MainWrapper>
  );
}

export const CustomMainLayout = ({ children }) => (
  <CustomMainWrapperStyles>
    <CustomSharedContainer>{children}</CustomSharedContainer>
  </CustomMainWrapperStyles>
);

export default MainLayout;
