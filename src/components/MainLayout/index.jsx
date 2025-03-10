import React from "react";
import {
  CustomMainWrapperStyles,
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
    <SharedContainer>{children}</SharedContainer>
  </CustomMainWrapperStyles>
);

export default MainLayout;
