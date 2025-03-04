import styled from "styled-components";

export const MessageContainer = styled.ul`
  display: flex;
  flex-direction: column;
  padding: 50px 0;
  gap: 8px;
`;
export const MessageItem = styled.li`
  display: flex;
  justify-content: ${(props) => (props.$sender ? "flex-end" : "flex-start")};
  font-size: 14px;
  color: #000;

  p {
    padding: 5px 10px;
    border-radius: 8px;
    background-color: #fff;
    width: fit-content;
  }
`;
