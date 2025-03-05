import { squircle } from "ldrs";
squircle.register();

export const SquareLoader = () => (
  <div>
    <l-squircle
      size="35"
      stroke="3"
      stroke-length="0.15"
      bg-opacity="0.1"
      speed="0.9"
      color="white"
    ></l-squircle>
  </div>
);
