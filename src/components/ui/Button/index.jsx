import React from "react";
import { StyledButton } from "./styled-component";

function Button({ props, children }) {
  return <StyledButton {...props}>{children}</StyledButton>;
}

export default Button;
