import styled from "styled-components";

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
  padding: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.2s ease,
    visibility 0.2s ease;
  z-index: 2000;
  min-width: 120px;
  max-width: 200px;
  white-space: nowrap;

  &.visible {
    opacity: 1;
    visibility: visible;
  }

  /* Dynamic arrow positioning */
  &::after {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
  }

  /* Arrow for left positioning */
  &[style*="right: calc(100% + 8px)"]::after {
    right: -6px;
    top: 50%;
    transform: translateY(-50%);
    border-left: 6px solid #2a2a2a;
  }

  /* Arrow for right positioning */
  &[style*="left: calc(100% + 8px)"]::after {
    left: -6px;
    top: 50%;
    transform: translateY(-50%);
    border-right: 6px solid #2a2a2a;
  }

  /* Arrow for above positioning */
  &[style*="bottom: calc(100% + 8px)"]::after {
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    border-top: 6px solid #2a2a2a;
  }

  /* Arrow for below positioning */
  &[style*="top: calc(100% + 8px)"]::after {
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    border-bottom: 6px solid #2a2a2a;
  }

  /* No arrow for center positioning */
  &[style*="transform: translate(-50%, -50%)"]::after,
  &[style*="transform: translateX(-50%)"]::after {
    display: none;
  }

  /* Responsive positioning for small screens */
  @media (max-width: 768px) {
    min-width: 100px;
    max-width: 150px;
    font-size: 11px;
  }

  /* Ensure menu stays within container bounds */
  @media (max-width: 480px) {
    max-width: 120px;
    min-width: 80px;
    font-size: 10px;
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
  gap: 1px;
  /* align-items: ${props => (props.$sender ? "flex-end" : "flex-start")}; */
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
