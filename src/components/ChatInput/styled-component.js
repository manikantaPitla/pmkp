import styled from "styled-components";

export const InputWrapper = styled.form`
  display: flex;
  align-items: center;
  gap: 5px;
  position: relative;
  margin: 10px 10px 10px;
  height: 48px;
  border-radius: 25px;
  border: 1px solid var(--border-shaded);
  background-color: transparent;

  padding: 0px 3px 0px 20px;
  font-size: var(--fs-l) !important;

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus {
    transition: background-color 5000s ease-in-out 0s;
  }

  .file-input {
    display: none;
  }
`;

export const FormButton = styled.button`
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
`;

export const FormInput = styled.input`
  flex: 1;
  background-color: transparent;
  outline: none;
  border: none;
  height: inherit;
  color: #fff !important;
`;

const SharedPreviewContainer = styled.div`
  display: flex;
  align-items: center;
  background: #f1f1f1;
  padding: 8px;
  border-radius: 10px;
  margin-bottom: 8px;
  width: 100%;
  position: absolute;
  bottom: 45px;
  left: 0px;
`;

export const ReplyPreview = styled(SharedPreviewContainer)`
  gap: 20px;

  button {
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    color: #000;
  }
`;

export const MediaPreview = styled(SharedPreviewContainer)`
  backdrop-filter: blur(4px);
  background-color: var(--border-shaded);
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;

  label {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  div {
    overflow-y: auto;
    height: 80vh;
    max-height: 75vh;
    width: 100%;
    flex: 1;
    overflow: hidden;
    border-radius: 8px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }

  .button-wrapper {
    display: flex;
    gap: 8px;
  }
`;

export const ReplyMessageInnerContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .user-reply-text {
    color: var(--text-dark-shaded);
    font-size: var(--fs-m);
  }
`;

export const ReplyMessageItem = styled.div`
  background-color: var(--bg-shaded-dark);
  padding: 6px 10px;
  border-radius: 10px;

  p {
    font-size: var(--fs-l);
    color: #000000;
    white-space: wrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .media-card {
    background-color: transparent !important;
    color: #000 !important;
    padding: 0px;
  }
`;
