import { useState, useCallback } from "react";

function useLoading(initialLoading = false) {
  const [loading, setLoading] = useState(initialLoading);
  const [loadingId, setLoadingId] = useState(null);

  const startLoading = useCallback(() => setLoading(true), []);
  const stopLoading = useCallback(() => setLoading(false), []);

  return { loading, stopLoading, startLoading, loadingId, setLoadingId };
}

export default useLoading;
