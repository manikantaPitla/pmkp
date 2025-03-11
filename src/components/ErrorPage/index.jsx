import React from "react";
import { CustomMainLayout } from "../MainLayout";
import { ErrorContainer } from "./styled-component";

function ErrorPage({ errMsg }) {
  return (
    <CustomMainLayout>
      <ErrorContainer>
        <p>
          {errMsg} <br />
          reload the page and try again...
        </p>
      </ErrorContainer>
    </CustomMainLayout>
  );
}

export default ErrorPage;
