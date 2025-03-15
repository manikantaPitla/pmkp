import React from "react";
import { StyledButton } from "./styled-component";

function Button({ children, ...props }) {
  return <StyledButton {...props}>{children}</StyledButton>;
}

export default Button;
