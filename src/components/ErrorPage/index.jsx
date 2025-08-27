import React from "react";
import { CustomMainLayout, Divider } from "../../utils";
import { ErrorCard, ErrorContainer } from "./styled-component";

function ErrorPage({ errMsg, onRetry }) {
  const handleRetry = () => {
    if (onRetry && typeof onRetry === "function") {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <CustomMainLayout>
      <ErrorContainer>
        <ErrorCard>
          <p>
            {errMsg} <br />
          </p>
          <Divider text={"❤️"} />
          <p>Try again later</p>
          <Divider text={"OR"} />
          <button
            onClick={handleRetry}
            style={{
              background: "none",
              border: "none",
              color: "#007bff",
              textDecoration: "underline",
              cursor: "pointer",
              fontSize: "inherit",
              padding: 0,
            }}
          >
            Reload the page
          </button>
        </ErrorCard>
      </ErrorContainer>
    </CustomMainLayout>
  );
}

export default ErrorPage;
