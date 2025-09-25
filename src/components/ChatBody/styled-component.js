import styled from "styled-components";

export const MessageContainer = styled.ul`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  padding: 10px 10px 80px;
  gap: 5px;
  overscroll-behavior-y: contain;
  overscroll-behavior: contain;
  position: relative;

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

export const InlineInfo = styled.div`
  text-align: center;
  padding: 10px;
  color: var(--text-light-shaded);
  /* Non-sticky: just appears at the top of the list when loading */
`;

export const EndInfo = styled.div`
  text-align: center;
  padding: 10px;
  color: var(--text-light-shaded);
  font-size: var(--fs-s);
`;
