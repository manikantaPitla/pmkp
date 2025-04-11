import styled from "styled-components";

export const MediaCard = styled.div`
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px;
  background-color: var(--border-shaded);
  border-radius: 6px;
  min-width: 200px;

  .media-details {
    flex-grow: 1;
    line-height: 14px;
    p {
      font-size: 10px;
    }
  }

  .media-uploading-status {
    height: 35px;
    width: 35px;
    border: 1px solid var(--border-shaded);
    border-radius: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    p {
        font-size:10px;
    }
  }
`;

export const MediaOpenItem = styled.div`
  background-color: var(--border-shaded);
  padding: 5px 10px;
  border-radius:15px;
  p {
    font-size: 10px !important;
  }
`;
