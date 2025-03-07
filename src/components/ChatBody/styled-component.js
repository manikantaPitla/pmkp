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
    font-size: 13px;
    color: var(--border-shaded);
  }
`;
export const MessageItem = styled.li`
  display: flex;
  align-items: ${(props) => (props.$sender ? "flex-end" : "flex-start")};
  flex-direction: column;
  font-size: 12px;
  color: #000;
  line-height: 15px;

  div {
    max-width: 85%;
    border-radius: 3px;
    padding: 5px 13px;
    border-left: ${(props) =>
      props.$sender ? "none" : "3px solid var(--border-shaded)"};
    border-right: ${(props) => (props.$sender ? "3px solid white" : "none")};
    display: flex;
    flex-direction: column;
    align-items: ${(props) => (props.$sender ? "flex-end" : "flex-start")};
    /* border: 1px solid var(--border-shaded); */
    /* background-color: ${(props) =>
      props.$sender ? "var(--bg-shaded)" : ""}; */
  }

  p {
    color: #fff;
    width: fit-content;
    line-break: anywhere;
  }
`;

export const MessageTime = styled.span`
  font-size: 10px;
  color: var(--bg-shaded) !important;
`;

export const LoaderWrapper = styled.div`
  padding: 40px 0;
  display: flex;
  justify-content: center;
`;
