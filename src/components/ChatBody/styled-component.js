import styled from "styled-components";

export const MessageContainer = styled.ul`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 0px 10px;
  gap: 10px;

  .no-messages {
    text-align: center;
    font-size: var(--fs-secondary);
    color: var(--text-light-shaded);
    margin-top: 20px;
  }
`;

export const LoaderWrapper = styled.div`
  padding: 40px 0;
  display: flex;
  justify-content: center;
`;
