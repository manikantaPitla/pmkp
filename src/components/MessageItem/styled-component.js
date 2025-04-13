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
  font-size: 8px;
  color: var(--bg-shaded);
  color: rgba(255, 255, 255, 0.2);
  line-height: normal;
`;

export const MessageCard = styled.div`
  max-width: 80%;
  background-color: ${(props) =>
    props.$sender ? "var(--bg-shaded)" : "#171717"};
  /* border: 1px solid var(--border-shaded); */
  border-radius: 10px;
  padding: 6px 10px;
  /* backdrop-filter: blur(3px); */
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

export const MessageInnerCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  /* align-items: ${(props) => (props.$sender ? "flex-end" : "flex-start")}; */
  align-items: flex-end;

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
  background-color: #171717;
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
