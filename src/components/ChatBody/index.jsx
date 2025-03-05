import React, { useEffect, useState } from "react";
import { getUserChats } from "../../services/firebaseFunctions";
import {
  InputWrapper,
  LoaderWrapper,
  MessageContainer,
  MessageItem,
} from "./styled-component";
import useLoading from "../../hooks/useLoading";
import { SquareLoader } from "../../utils/loader";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { SendHorizontal } from "lucide-react";

function ChatBody({ userId }) {
  const [messageList, setMessageList] = useState([]);
  //   console.log(messageList);
  const { loading, startLoading, stopLoading } = useLoading(true);

  useEffect(() => {
    const getChats = async () => {
      try {
        startLoading();
        const chatMessages = await getUserChats(userId);
        setMessageList(chatMessages.messageList);
      } catch (error) {
        console.error(error.message);
      } finally {
        stopLoading();
      }
    };
    getChats();
  }, []);

  return (
    <>
      <MessageContainer>
        {loading ? (
          <LoaderWrapper>
            <SquareLoader />
          </LoaderWrapper>
        ) : messageList.length > 0 ? (
          messageList.map((messageItem) => {
            const { message, senderId, messageId } = messageItem;
            return (
              <MessageItem key={messageId} $sender={userId === senderId}>
                <p>{message}</p>
              </MessageItem>
            );
          })
        ) : (
          "chat data"
        )}
      </MessageContainer>
      <InputWrapper>
        <Input type="text" placeholder="Type message..." />
        <Button>
          <SendHorizontal />
        </Button>
      </InputWrapper>
    </>
  );
}

export default ChatBody;
