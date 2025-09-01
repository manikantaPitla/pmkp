import styled from "styled-components";

export const MessageContainer = styled.ul`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 57.5px 10px 80px;
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

export const ChatInputContainer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  /* background-color: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px); */
`;
