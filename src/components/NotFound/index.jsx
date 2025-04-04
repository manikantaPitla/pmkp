import React from "react";
import { CustomMainLayout } from "../../utils";
import { ErrorCard, ErrorContainer } from "../ErrorPage/styled-component";

function NotFound() {
  return (
    <CustomMainLayout>
      <ErrorContainer>
        <ErrorCard>
          <p>4❤️4</p>
          <p>PAGE NOT FOUND</p>
        </ErrorCard>
      </ErrorContainer>
    </CustomMainLayout>
  );
}

export default NotFound;
