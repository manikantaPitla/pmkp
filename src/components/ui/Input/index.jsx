import { forwardRef } from "react";

const Input = forwardRef(({ iconSrc, iconAlt = "Icon", error, label, id, ...props }, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const labelId = `${inputId}-label`;
  const errorId = `${inputId}-error`;

  return (
    <InputWrapper className={error ? "error" : ""}>
      {iconSrc && (
        <IconWrapper>
          <img src={iconSrc} alt={iconAlt} aria-hidden="true" />
        </IconWrapper>
      )}
      {label && (
        <label htmlFor={inputId} id={labelId} style={{ display: "none" }}>
          {label}
        </label>
      )}
      <StyledInput
        ref={ref}
        id={inputId}
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? "true" : "false"}
        {...props}
      />
      {error && (
        <div id={errorId} role="alert" aria-live="polite" style={{ display: "none" }}>
          {error}
        </div>
      )}
    </InputWrapper>
  );
});

export default Input;
