import React, { useState, useRef, useCallback, useEffect } from "react";
import { getTimeFormat, makeLinksClickable, minimizeText, sanitizeInput } from "../../utils";
import "reactjs-popup/dist/index.css";

function MessageItem({ messageData, userId, setReplyTo, onEditMessage, onDeleteMessage }) {
  const { senderId, message, messageId, timestamp, replyTo, status, media, isSeen, isDeleted } = messageData;
  const [showMenu, setShowMenu] = useState(false);
  const [isLongPressed, setIsLongPressed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const longPressTimer = useRef(null);
  const editInputRef = useRef(null);
  const menuRef = useRef(null);
  const isOwnMessage = userId === senderId;

  const canEdit = isOwnMessage && Date.now() - timestamp <= 15 * 60 * 1000;
  const timeSinceSent = Date.now() - timestamp;
  const minutesLeft = Math.max(0, Math.floor((15 * 60 * 1000 - timeSinceSent) / 60000));

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

  useEffect(() => {
    if (!showMenu || !menuRef.current) return;
    const menu = menuRef.current;
    const messageCard = menu.closest(".message-card");
    if (!messageCard) return;

    const containerEl = messageCard.closest("[data-message-container]") || document.body;

    // Move menu into the container so absolute coords are relative to container
    const originalParent = menu.parentElement;
    let moved = false;
    if (menu.parentElement !== containerEl) {
      containerEl.appendChild(menu);
      moved = true;
    }

    // Save previous inline styles to restore later
    const prev = {
      visibility: menu.style.visibility,
      display: menu.style.display,
      position: menu.style.position,
      left: menu.style.left,
      top: menu.style.top,
      right: menu.style.right,
      bottom: menu.style.bottom,
      transform: menu.style.transform,
    };

    // Make measurable without flashing
    menu.style.visibility = "hidden";
    menu.style.display = "block";
    menu.style.position = "absolute";
    menu.style.left = "0px";
    menu.style.top = "0px";
    menu.style.transform = "none";

    const menuRect = menu.getBoundingClientRect();
    const menuW = Math.round(menuRect.width || 160);
    const menuH = Math.round(menuRect.height || 200);

    const containerRect = containerEl.getBoundingClientRect();
    const msgRect = messageCard.getBoundingClientRect();

    // Compute left (coords relative to container)
    const padding = 8;
    let left;
    let anchor = "center";

    if (isOwnMessage) {
      // align menu's right edge with bubble's right edge; 10px from top of bubble
      left = Math.round(msgRect.right - containerRect.left - menuW);
      anchor = "right";
    } else {
      // place to the right of the bubble
      left = Math.round(msgRect.right - containerRect.left + 8);
      anchor = "left";
      if (left + menuW > containerRect.width - padding) {
        left = Math.round(Math.max(padding, msgRect.left - containerRect.left + (msgRect.width - menuW) / 2));
        anchor = "center";
      }
    }

    // Compute top (relative to container)
    const spaceBelow = containerRect.bottom - msgRect.bottom - padding;
    const spaceAbove = msgRect.top - containerRect.top - padding;
    let top;
    if (isOwnMessage) {
      top = Math.round(msgRect.top - containerRect.top + 18);
    } else if (spaceBelow >= menuH) {
      top = Math.round(msgRect.bottom - containerRect.top + 16);
    } else if (spaceAbove >= menuH) {
      top = Math.round(msgRect.top - containerRect.top - menuH - 16);
    } else {
      top = Math.round(msgRect.top - containerRect.top + (msgRect.height - menuH) / 2);
      top = Math.min(Math.max(padding, top), containerRect.height - menuH - padding);
    }

    // Final horizontal clamp (only for receiver or centered)
    left = Math.min(Math.max(padding, left), containerRect.width - menuW - padding);

    // Apply computed placement
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
    menu.style.right = "auto";
    menu.style.bottom = "auto";
    menu.setAttribute("data-anchor", anchor);
    menu.classList.add("visible");

    // restore visibility display (we kept position / left/top as we want them)
    menu.style.visibility = prev.visibility || "";
    menu.style.display = prev.display || "";

    // Close on scroll/resize to avoid stale positions — alternative: re-position on these events
    const handleCloseOnScroll = () => setShowMenu(false);
    containerEl.addEventListener("scroll", handleCloseOnScroll, { passive: true });
    window.addEventListener("resize", handleCloseOnScroll);

    return () => {
      // cleanup listeners
      containerEl.removeEventListener("scroll", handleCloseOnScroll);
      window.removeEventListener("resize", handleCloseOnScroll);

      // hide/remove visible state
      try {
        menu.classList.remove("visible");
      } catch {}

      // restore previous inline styles
      menu.style.visibility = prev.visibility;
      menu.style.display = prev.display;
      menu.style.position = prev.position;
      menu.style.left = prev.left;
      menu.style.top = prev.top;
      menu.style.right = prev.right;
      menu.style.bottom = prev.bottom;
      menu.style.transform = prev.transform;

      // move back to original parent if we moved it
      if (moved && originalParent) {
        originalParent.appendChild(menu);
      }
    };
  }, [showMenu, isOwnMessage]);

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

  // auto mark handled at list/container level in future

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
      <MessageCard $sender={isOwnMessage} $seen={isSeen} className="message-card">
        {replyTo && (
          <ReplyViewContainer
            $sender={isOwnMessage}
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
          {media && !isDeleted && <MediaView media={media} />}
          {isDeleted ? (
            <DeletedText>Message deleted</DeletedText>
          ) : isEditing ? (
            <EditContainer>
              <textarea
                ref={editInputRef}
                value={editText}
                onChange={e => setEditText(e.target.value)}
                onKeyDown={handleEditKeyDown}
                onBlur={handleSaveEdit}
                className="edit-textarea"
                placeholder="Edit your message..."
              />
              <EditActions>
                <button onClick={handleSaveEdit} className="btn save">
                  Save
                </button>
                <button onClick={handleCancelEdit} className="btn cancel">
                  Cancel
                </button>
              </EditActions>
            </EditContainer>
          ) : (
            <>
              <p id={messageId} dangerouslySetInnerHTML={{ __html: makeLinksClickable(sanitizeInput(message)) }} />
              {messageData.isEdited && <EditedTag>(edited)</EditedTag>}
            </>
          )}
        </MessageInnerCard>

        {/* Message Menu */}
        <MessageMenu ref={menuRef} className={`message-menu ${showMenu ? "visible" : ""}`} $sender={isOwnMessage}>
          {!isDeleted && (
            <MenuItem onClick={handleReply}>
              <Reply />
              Reply
            </MenuItem>
          )}
          {!isDeleted && canEdit && (
            <MenuItem onClick={handleEdit}>
              <Edit3 />
              Edit {minutesLeft > 0 && `(${minutesLeft}m left)`}
            </MenuItem>
          )}
          {isOwnMessage && !isDeleted && (
            <MenuItem onClick={handleDelete}>
              <Trash2 />
              Delete
            </MenuItem>
          )}
          {/* Removed manual mark-as-seen */}
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
