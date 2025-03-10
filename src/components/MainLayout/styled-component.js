import styled from "styled-components";

export const MainWrapper = styled.main`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CustomMainWrapperStyles = styled(MainWrapper)`
  align-items: normal;
`;

export const SharedContainer = styled.div`
  width: 400px;
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const CustomSharedContainer = styled(SharedContainer)`
  padding: 0px;
  gap: 5px;
`;
