import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const ProfileSkeleton = () => (
  <>
    <h1>
      <Skeleton height={10} width={100} />
    </h1>
    <p>
      <Skeleton height={10} width={200} />
    </p>
  </>
);
