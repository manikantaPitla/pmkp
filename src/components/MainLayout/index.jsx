import React from "react";
import { MainWrapper, SharedContainer } from "./styled-component";

function MainLayout({ children }) {
  return (
    <MainWrapper>
      <SharedContainer>{children}</SharedContainer>
    </MainWrapper>
  );
}

export default MainLayout;
