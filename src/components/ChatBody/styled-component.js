import styled from "styled-components";

export const MessageContainer = styled.ul`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  gap: 5px;
`;
export const MessageItem = styled.li`
  display: flex;
  justify-content: ${(props) => (props.$sender ? "flex-end" : "flex-start")};
  font-size: 14px;
  color: #000;

  p {
    max-width: 85%;
    padding: 5px 13px;
    border-radius: 25px;
    color: #fff;
    border: 1px solid var(--border-shaded);
    width: fit-content;
    line-break: anywhere;

    background-color: ${(props) => (props.$sender ? "var(--bg-shaded)" : "")};
  }
`;

export const LoaderWrapper = styled.div`
  padding: 40px 0;
  display: flex;
  justify-content: center;
`;
