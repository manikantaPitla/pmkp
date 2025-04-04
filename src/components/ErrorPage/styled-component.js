import styled from "styled-components";

export const ErrorContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px 30px;
  gap: 20px;
`;

export const ErrorCard = styled.div`
  border: 2px solid var(--border-shaded);
  padding: 30px 40px;
  border-radius: 15px;
  text-align: center;
  font-size: 14px;
`;
