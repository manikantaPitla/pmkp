import styled from "styled-components";

export const InputWrapper = styled.form`
  display: flex;
  align-items: center;
  gap: 5px;
  position: relative;

  height: 48px;
  border-radius: 25px;
  border: 1px solid var(--border-shaded);
  background-color: var(--bg-shaded);
  padding: 0px 3px 0px 20px;
  font-size: 14px;

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus {
    transition: background-color 5000s ease-in-out 0s;
  }

  input {
    flex: 1;
    background-color: transparent;
    outline: none;
    border: none;
    height: inherit;
  }

  button {
    cursor: pointer;
    padding: 0px !important;
    height: inherit;
    width: 40px;
    height: 40px;
    border-radius: 25px;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
    color: #000000;
  }
`;

export const ReplyPreview = styled.div`
  display: flex;
  align-items: center;
  background: #f1f1f1;
  padding: 8px;
  border-radius: 10px;
  margin-bottom: 8px;
  width: 100%;
  position: absolute;
  top: -70px;
  left: 0px;

  div {
    flex: 1;

    .user-reply-text {
      color: var(--text-dark-shaded);
      font-size: 12px;
    }
  }

  p {
    flex: 1;
    font-size: var(--fs-secondary);
    color: #000000;
    white-space: wrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  button {
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
  }
`;
