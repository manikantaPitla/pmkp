import React, { forwardRef } from "react";
import { IconWrapper, InputWrapper, StyledInput } from "./styled-component";

const Input = forwardRef(({ iconSrc, iconAlt = "Icon", ...props }, ref) => {
  return (
    <InputWrapper>
      {iconSrc && (
        <IconWrapper>
          <img src={iconSrc} alt={iconAlt} />
        </IconWrapper>
      )}
      <StyledInput ref={ref} {...props} />
    </InputWrapper>
  );
});

export default Input;
