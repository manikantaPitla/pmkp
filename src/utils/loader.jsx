import { squircle } from "ldrs";
squircle.register();

export const SquareLoader = () => (
  <div>
    <l-squircle size="35" stroke="4" stroke-length="0.15" bg-opacity="0.1" speed="0.9" color="white"></l-squircle>
  </div>
);

export const FullPageLoader = () => (
  <div
    style={{
      height: "100vh",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <SquareLoader />
  </div>
);
