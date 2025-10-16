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
