import styled from "styled-components";
import Popup from "reactjs-popup";

export const MessageContainer = styled.li`
  display: flex;
  justify-content: ${props => (props.$sender ? "flex-end" : "flex-start")};
  line-height: 16px;
  align-items: flex-end;
  gap: 5px;
  position: relative;

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
  background-color: ${props => (props.$sender ? "var(--bg-shaded)" : "#171717")};
  /* border: 1px solid var(--border-shaded); */
  border-radius: 20px;
  padding: 10px 12px;
  /* backdrop-filter: blur(3px); */
  cursor: pointer;
  /* border: 1px solid rgba(255, 255, 255, 0.08); */
  position: relative;
  border-right: ${props => (props.$sender ? `1px solid ${props.$seen ? "var(--status-seen)" : "var(--status-unseen)"}` : "none")};

  &:hover {
    .message-menu {
      opacity: 1;
      visibility: visible;
    }
  }
`;

export const MessageMenu = styled.div`
  position: absolute;
  background-color: #2a2a2a;
  border-radius: 8px;
  padding: 6px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.04);
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 160ms ease,
    visibility 160ms ease;
  z-index: 998;
  min-width: 120px;
  max-width: 220px;
  white-space: nowrap;

  &.visible {
    opacity: 1;
    visibility: visible;
  }

  &::after {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
  }

  &[data-anchor="right"]::after {
    right: -6px;
    top: 50%;
    transform: translateY(-50%);
    border-left: 6px solid #2a2a2a;
  }

  &[data-anchor="left"]::after {
    left: -6px;
    top: 50%;
    transform: translateY(-50%);
    border-right: 6px solid #2a2a2a;
  }
`;

export const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #3a3a3a;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;

    &:hover {
      background-color: transparent;
    }
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const MessageInnerCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: ${props => (props.$sender ? "flex-end" : "flex-start")};
  width: 100%;

  p {
    color: #fff;
    word-wrap: break-word;
    overflow-wrap: break-word;
    overflow-wrap: anywhere;
    word-break: break-word;
    white-space: pre-wrap;
    font-size: 12px;
    max-width: 100%;

    a {
      color: inherit;
      text-decoration: underline;
      word-break: break-all;
      overflow-wrap: anywhere;
      display: inline-block;
      max-width: 100%;
    }
  }
`;

export const ReplyViewContainer = styled.div`
  background-color: #0f0f0f; /* stronger contrast to differentiate from main message */
  padding: 8px 10px;
  border-radius: 6px;
  margin-bottom: 5px;
  color: #fff;
  border-left: 2px solid rgba(255, 255, 255, 0.08);

  .reply-to-user-message {
    font-size: 12px;
    color: var(--text-light-shaded);
    margin-bottom: 2px;
  }

  p {
    font-size: 12px;
    margin: 0;
    word-break: break-word;
    overflow-wrap: anywhere;
  }

  .media-card {
    background-color: transparent !important;
    padding: 0;
    /* Edge-to-edge: extend width past horizontal padding and shift left */
    width: calc(100% + 20px);
    transform: translateX(-10px);
    margin: 0;
    display: block;

    img,
    video {
      width: 100% !important;
      height: auto !important;
      display: block;
      border-radius: 6px;
    }
  }
`;

export const DeletedText = styled.p`
  font-style: italic;
  opacity: 0.7;
`;

export const EditContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;

  .edit-textarea {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    padding: 8px;
    color: #fff;
    font-size: 12px;
    resize: none;
    min-height: 60px;
    font-family: inherit;
  }
`;

export const EditActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;

  .btn {
    border: none;
    border-radius: 4px;
    padding: 4px 8px;
    color: #fff;
    font-size: 10px;
    cursor: pointer;
  }

  .btn.save {
    background: #4caf50;
  }

  .btn.cancel {
    background: #666;
  }
`;

export const EditedTag = styled.span`
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
`;

export const DeleteModalStyles = styled(Popup)`
  &-overlay {
    backdrop-filter: blur(3px);
    z-index: 9999;
  }

  &-content {
    width: 300px;
    min-height: 140px;
    border-radius: 15px;
    background-color: #ffffff;
    border: none;
    color: #000000;
    padding: 0;
    z-index: 10000;
  }
`;
