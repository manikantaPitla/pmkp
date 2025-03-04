import { useState } from "react";

function useLoading(initialLoading = false) {
  const [loading, setLoading] = useState(initialLoading);
  const [loadingId, setLoadingId] = useState(null);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  return { loading, stopLoading, startLoading, loadingId, setLoadingId };
}

export default useLoading;
