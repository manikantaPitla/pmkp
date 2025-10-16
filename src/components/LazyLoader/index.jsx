import styled from "styled-components";

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background-color: #000000;
`;

const LazyLoader = ({ children, fallback = null }) => {
  const defaultFallback = (
    <LoadingContainer>
      <div style={{ textAlign: "center" }}>
        <SquareLoader />
      </div>
    </LoadingContainer>
  );

  return <Suspense fallback={fallback || defaultFallback}>{children}</Suspense>;
};

export default LazyLoader;
