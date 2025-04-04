import styled from "styled-components";

export const MessageContainer = styled.li`
  display: flex;
  justify-content: ${(props) => (props.$sender ? "flex-end" : "flex-start")};
  line-height: 16px;
  align-items: flex-end;
  gap: 5px;

  .status-icon {
    color: #ffffff;
  }
`;

export const MessageTime = styled.span`
  font-size: 10px;
  color: var(--bg-shaded);
  color: rgba(255, 255, 255, 0.2);
`;

export const MessageCard = styled.div`
  max-width: 80%;
  background-color: ${(props) => (props.$sender ? "var(--bg-shaded)" : "")};
  border: 1px solid var(--border-shaded);
  border-radius: 10px;
  padding: 6px;
  backdrop-filter: blur(3px);
  cursor: pointer;
`;

export const MessageInnerCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: ${(props) => (props.$sender ? "flex-end" : "flex-start")};

  p {
    color: #fff;
    word-wrap: break-word;
    overflow-wrap: break-word;
    white-space: pre-wrap;
    font-size: 12px;
    max-width: 100%;
  }
`;

export const ReplyViewContainer = styled.div`
  background-color: var(--bg-shaded);
  padding: 8px 10px;
  border-radius: 6px;
  margin-bottom: 5px;
  color: #fff;

  .reply-to-user-message {
    font-size: 12px;
    color: var(--text-light-shaded);
    margin-bottom: 2px;
  }

  p {
    font-size: 12px;
  }

  .media-card {
    background-color: transparent !important;
    padding: 5px 0px;
  }
`;
