import styled from "styled-components";

export const MessageContainer = styled.ul`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  gap: 10px;

  .no-messages {
    text-align: center;
    font-size: var(--fs-secondary);
    color: var(--text-light-shaded);
  }
`;
export const MessageItem = styled.li`
  display: flex;
  justify-content: ${(props) => (props.$sender ? "flex-end" : "flex-start")};
  color: #000;
  line-height: 16px;
  font-size: var(--fs-secondary);
  align-items: flex-end;
  gap: 5px;

  .status-icon {
    color: #ffffff;
  }

  .message-main-container {
    max-width: 86%;
    background-color: ${(props) => (props.$sender ? "var(--bg-shaded)" : "")};
    border: 1px solid var(--border-shaded);
    border-radius: 10px;
    padding: 5px 10px;
  }

  .message-items-container {
    display: flex;
    flex-direction: column;
    align-items: ${(props) => (props.$sender ? "flex-end" : "flex-start")};
  }

  p {
    color: #fff;
    width: fit-content;
    line-break: anywhere;
  }
`;

export const ReplyViewContainer = styled.div`
  background-color: var(--bg-shaded);
  padding: 6px;
  border-radius: 10px;
  margin-bottom: 5px;

  .reply-to-user-message {
    font-size: 12px;
    color: var(--text-light-shaded);
    margin-bottom: 2px;
  }
`;

export const MessageTime = styled.span`
  font-size: 10px;
  color: var(--bg-shaded);
  color: rgba(255, 255, 255, 0.2);
`;

export const LoaderWrapper = styled.div`
  padding: 40px 0;
  display: flex;
  justify-content: center;
`;
