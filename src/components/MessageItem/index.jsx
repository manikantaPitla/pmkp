import React, { useState, useRef, useCallback, useEffect } from "react";
import { MessageCard, MessageContainer, MessageInnerCard, ReplyViewContainer, MessageMenu, MenuItem } from "./styled-component";
import { Send as SendIcon, CircleX as ErrorIcon, Edit3, Trash2, Eye, Clock, Reply } from "lucide-react";
import { getTimeFormat, makeLinksClickable, minimizeText, sanitizeInput } from "../../utils";
import MediaView from "../MediaView";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { ModalBody, ModalButton, ModalButtonWrapper, ModalTitle } from "../../utils/styled-component";
import styled from "styled-components";

// Custom styled modal for delete confirmation
const DeleteModalStyles = styled(Popup)`
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

function MessageItem({ messageData, userId, setReplyTo, onEditMessage, onDeleteMessage, onMarkAsSeen }) {
  const { senderId, message, messageId, timestamp, replyTo, status, media, isSeen } = messageData;
  const [showMenu, setShowMenu] = useState(false);
  const [isLongPressed, setIsLongPressed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const longPressTimer = useRef(null);
  const editInputRef = useRef(null);
  const menuRef = useRef(null);
  const isOwnMessage = userId === senderId;

  // Check if message is within 15 minutes for editing
  const canEdit = isOwnMessage && Date.now() - timestamp <= 15 * 60 * 1000;
  const timeSinceSent = Date.now() - timestamp;
  const minutesLeft = Math.max(0, Math.floor((15 * 60 * 1000 - timeSinceSent) / 60000));

  // Long press detection
  const handleMouseDown = useCallback(() => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    longPressTimer.current = setTimeout(() => {
      setIsLongPressed(true);
      setShowMenu(true);
    }, 500); // 500ms for long press
  }, []);

  const handleMouseUp = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    // Keep menu open for a bit after long press
    setTimeout(() => setIsLongPressed(false), 100);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (!isLongPressed) {
      setShowMenu(false);
    }
  }, [isLongPressed]);

  // Touch events for mobile
  const handleTouchStart = useCallback(() => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    longPressTimer.current = setTimeout(() => {
      setIsLongPressed(true);
      setShowMenu(true);
    }, 500);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    setTimeout(() => setIsLongPressed(false), 100);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (showMenu && !event.target.closest(".message-menu") && !event.target.closest(".message-card")) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showMenu]);

  // Dynamic menu positioning based on available space
  useEffect(() => {
    if (showMenu && menuRef.current) {
      const menu = menuRef.current;
      const messageCard = menu.closest(".message-card");
      if (!messageCard) return;

      // Use setTimeout to ensure menu is rendered before calculating position
      setTimeout(() => {
        const menuRect = menu.getBoundingClientRect();
        const messageRect = messageCard.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const menuWidth = 120; // Approximate menu width
        const menuHeight = 200; // Approximate menu height
        const padding = 10; // Safe distance from edges

        // Reset any previous positioning
        menu.style.left = "";
        menu.style.right = "";
        menu.style.top = "";
        menu.style.bottom = "";
        menu.style.transform = "";

        // Calculate available space in all directions
        const spaceLeft = messageRect.left - padding;
        const spaceRight = viewportWidth - messageRect.right - padding;
        const spaceTop = messageRect.top - padding;
        const spaceBottom = viewportHeight - messageRect.bottom - padding;

        // Determine best horizontal position
        let horizontalPosition = "";
        let arrowPosition = "";

        if (isOwnMessage) {
          // For sender messages, prefer left side
          if (spaceLeft >= menuWidth) {
            // Enough space on left
            horizontalPosition = "left";
            arrowPosition = "right";
            menu.style.right = "calc(100% + 8px)";
            menu.style.left = "auto";
          } else if (spaceRight >= menuWidth) {
            // Enough space on right
            horizontalPosition = "right";
            arrowPosition = "left";
            menu.style.left = "calc(100% + 8px)";
            menu.style.right = "auto";
          } else {
            // Not enough space on either side, position above/below
            horizontalPosition = "center";
            arrowPosition = "none";
            menu.style.left = "50%";
            menu.style.right = "auto";
            menu.style.transform = "translateX(-50%)";
          }
        } else {
          // For receiver messages, prefer right side
          if (spaceRight >= menuWidth) {
            // Enough space on right
            horizontalPosition = "right";
            arrowPosition = "left";
            menu.style.left = "calc(100% + 8px)";
            menu.style.right = "auto";
          } else if (spaceLeft >= menuWidth) {
            // Enough space on left
            horizontalPosition = "left";
            arrowPosition = "right";
            menu.style.right = "calc(100% + 8px)";
            menu.style.left = "auto";
          } else {
            // Not enough space on either side, position above/below
            horizontalPosition = "center";
            arrowPosition = "none";
            menu.style.left = "50%";
            menu.style.right = "auto";
            menu.style.transform = "translateX(-50%)";
          }
        }

        // Determine best vertical position
        let verticalPosition = "";
        if (spaceBottom >= menuHeight) {
          // Enough space below
          verticalPosition = "below";
          menu.style.top = "calc(100% + 8px)";
          menu.style.bottom = "auto";
          if (horizontalPosition === "center") {
            menu.style.transform = "translateX(-50%)";
          } else {
            menu.style.transform = "translateY(0)";
          }
        } else if (spaceTop >= menuHeight) {
          // Enough space above
          verticalPosition = "above";
          menu.style.bottom = "calc(100% + 8px)";
          menu.style.top = "auto";
          if (horizontalPosition === "center") {
            menu.style.transform = "translateX(-50%)";
          } else {
            menu.style.transform = "translateY(0)";
          }
        } else {
          // Not enough space above or below, center vertically
          verticalPosition = "center";
          if (horizontalPosition === "center") {
            menu.style.transform = "translate(-50%, -50%)";
          } else {
            menu.style.transform = "translateY(-50%)";
          }
        }

        // Update arrow position based on final positioning
        menu.style.setProperty("--arrow-position", arrowPosition);
        menu.style.setProperty("--menu-position", `${horizontalPosition}-${verticalPosition}`);
      }, 10); // Small delay to ensure menu is rendered
    }
  }, [showMenu, isOwnMessage]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(message);
    setShowMenu(false);
    // Focus the input after a short delay to ensure it's rendered
    setTimeout(() => {
      if (editInputRef.current) {
        editInputRef.current.focus();
        editInputRef.current.select();
      }
    }, 100);
  };

  const handleSaveEdit = () => {
    if (editText.trim() && editText !== message) {
      if (onEditMessage) {
        onEditMessage(messageId, editText.trim());
      }
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText(message);
  };

  const handleEditKeyDown = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
    setShowMenu(false);
  };

  const confirmDelete = () => {
    if (onDeleteMessage) {
      onDeleteMessage(messageId);
    }
    setShowDeleteModal(false);
  };

  const handleReply = () => {
    setReplyTo({
      message,
      messageId,
      timestamp,
      media,
      senderId,
    });
    setShowMenu(false);
  };

  const handleMarkAsSeen = () => {
    if (onMarkAsSeen) {
      onMarkAsSeen(messageId);
    }
    setShowMenu(false);
  };

  return (
    <MessageContainer
      key={messageId}
      $sender={isOwnMessage}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <MessageCard $sender={isOwnMessage} className="message-card">
        {replyTo && (
          <ReplyViewContainer
            onClick={() => {
              const replyElement = document.getElementById(replyTo.messageId);
              if (replyElement) replyElement.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <p className="reply-to-user-message">{replyTo.senderId === userId ? "You" : "Anonymous"}</p>

            {replyTo && replyTo?.media && <MediaView media={replyTo?.media} isReplyMsg={true} />}
            <p>{minimizeText(replyTo.message, 120)}</p>
          </ReplyViewContainer>
        )}
        <MessageInnerCard $sender={isOwnMessage}>
          {media && <MediaView media={media} />}
          {isEditing ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
              <textarea
                ref={editInputRef}
                value={editText}
                onChange={e => setEditText(e.target.value)}
                onKeyDown={handleEditKeyDown}
                onBlur={handleSaveEdit}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  padding: "8px",
                  color: "#fff",
                  fontSize: "12px",
                  resize: "none",
                  minHeight: "60px",
                  fontFamily: "inherit",
                }}
                placeholder="Edit your message..."
              />
              <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                <button
                  onClick={handleSaveEdit}
                  style={{
                    background: "#4CAF50",
                    border: "none",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    color: "#fff",
                    fontSize: "10px",
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  style={{
                    background: "#666",
                    border: "none",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    color: "#fff",
                    fontSize: "10px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p id={messageId} dangerouslySetInnerHTML={{ __html: makeLinksClickable(sanitizeInput(message)) }} />
              {messageData.isEdited && <span style={{ fontSize: "10px", color: "rgba(255, 255, 255, 0.5)", fontStyle: "italic" }}>(edited)</span>}
            </>
          )}
        </MessageInnerCard>

        {/* Message Menu */}
        <MessageMenu ref={menuRef} className={`message-menu ${showMenu ? "visible" : ""}`} $sender={isOwnMessage}>
          <MenuItem onClick={handleReply}>
            <Reply />
            Reply
          </MenuItem>
          {canEdit && (
            <MenuItem onClick={handleEdit}>
              <Edit3 />
              Edit {minutesLeft > 0 && `(${minutesLeft}m left)`}
            </MenuItem>
          )}
          {isOwnMessage && (
            <MenuItem onClick={handleDelete}>
              <Trash2 />
              Delete
            </MenuItem>
          )}
          {!isOwnMessage && !isSeen && (
            <MenuItem onClick={handleMarkAsSeen}>
              <Eye />
              Mark as seen
            </MenuItem>
          )}
          <MenuItem disabled>
            <Clock />
            {getTimeFormat(timestamp)}
          </MenuItem>
        </MessageMenu>
      </MessageCard>

      {status && isOwnMessage && status === "sending" ? (
        <SendIcon className="status-icon" size={12} />
      ) : (
        status === "failed" && <ErrorIcon color="red" className="status-icon" size={12} />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModalStyles open={showDeleteModal} onClose={() => setShowDeleteModal(false)} closeOnDocumentClick modal>
        {close => (
          <ModalBody>
            <ModalTitle>Delete Message</ModalTitle>
            <p style={{ fontSize: "12px", textAlign: "center", margin: "0", color: "#666" }}>Are you sure you want to delete this message? This action cannot be undone.</p>
            <ModalButtonWrapper>
              <ModalButton type="button" onClick={close}>
                Cancel
              </ModalButton>
              <ModalButton
                type="button"
                onClick={() => {
                  confirmDelete();
                  close();
                }}
              >
                Delete
              </ModalButton>
            </ModalButtonWrapper>
          </ModalBody>
        )}
      </DeleteModalStyles>
    </MessageContainer>
  );
}

export default React.memo(MessageItem);
