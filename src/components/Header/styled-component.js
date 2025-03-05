import styled from "styled-components";

export const HeaderWrapper = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  /* background-color: green; */
`;

export const UserNameWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  div {
    height: 42px;
    width: 42px;
    border-radius: 50px;
    border: 1px solid var(--bg-shaded);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
`;
