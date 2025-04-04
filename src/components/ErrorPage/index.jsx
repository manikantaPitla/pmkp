import React from "react";
import { CustomMainLayout, Divider } from "../../utils";
import { ErrorCard, ErrorContainer } from "./styled-component";

function ErrorPage({ errMsg }) {
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
          <p>Reload the page</p>
        </ErrorCard>
      </ErrorContainer>
    </CustomMainLayout>
  );
}

export default ErrorPage;
